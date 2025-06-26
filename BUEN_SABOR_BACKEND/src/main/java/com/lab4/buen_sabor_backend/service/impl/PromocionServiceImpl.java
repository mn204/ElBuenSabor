package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import com.lab4.buen_sabor_backend.repository.ArticuloInsumoRepository;
import com.lab4.buen_sabor_backend.repository.ArticuloManufacturadoRepository;
import com.lab4.buen_sabor_backend.repository.PromocionRepository;

import com.lab4.buen_sabor_backend.service.PromocionService;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import com.lab4.buen_sabor_backend.service.impl.specification.PromocionSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PromocionServiceImpl extends MasterServiceImpl<Promocion, Long> implements PromocionService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(PromocionServiceImpl.class);

    private final PromocionRepository promocionRepository;
    private final SucursalInsumoService sucursalInsumoService;
    private final ArticuloInsumoRepository articuloInsumoRepository;
    private final ArticuloManufacturadoRepository articuloManufacturadoRepository;

    @Autowired
    public PromocionServiceImpl(PromocionRepository promocionRepository, SucursalInsumoService sucursalInsumoService, ArticuloInsumoRepository articuloInsumoRepository, ArticuloManufacturadoRepository articuloManufacturadoRepository) {
        super(promocionRepository);
        this.promocionRepository = promocionRepository;
        this.sucursalInsumoService = sucursalInsumoService;
        this.articuloInsumoRepository = articuloInsumoRepository;
        this.articuloManufacturadoRepository = articuloManufacturadoRepository;
    }

    @Override
    public boolean verificarStockPromocion(Promocion promocion, int cantidad, Long sucursalId) {
        try {
            Map<Long, Double> requerimientos = new HashMap<>(); // ID SucursalInsumo -> Cantidad requerida

            for (DetallePromocion deta : promocion.getDetalles()) {
                Articulo art = deta.getArticulo();
                int cantidadPed = deta.getCantidad() * cantidad;

                try {
                    Optional<ArticuloInsumo> optionalInsumo = articuloInsumoRepository.findById(art.getId());
                    if (optionalInsumo.isPresent()) {
                        ArticuloInsumo insumo = optionalInsumo.get();

                        if (!insumo.getEsParaElaborar()) {
                            SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursalId, insumo.getId());
                            if (si == null) throw new RuntimeException("El artículo no tiene stock");

                            Long siId = si.getId();
                            requerimientos.merge(siId, (double) cantidadPed, Double::sum);
                        }
                    }else {
                        try {
                            Optional<ArticuloManufacturado> optionalManufacturado = articuloManufacturadoRepository.findById(art.getId());
                            if (optionalManufacturado.isPresent()) {
                                ArticuloManufacturado man = optionalManufacturado.get();

                                for (DetalleArticuloManufacturado dam : man.getDetalles()) {
                                    ArticuloInsumo ai = dam.getArticuloInsumo();
                                    double cantidadRequerida = dam.getCantidad() * cantidadPed;

                                    SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursalId, ai.getId());
                                    if (si == null) throw new RuntimeException("El artículo no tiene stock");

                                    Long siId = si.getId();
                                    requerimientos.merge(siId, cantidadRequerida, Double::sum);
                                }
                            }

                        } catch (EntityNotFoundException ex) {
                            throw new RuntimeException("El artículo no existe");
                        }
                    }
                } catch (EntityNotFoundException e) {
                    // Es manufacturado
                    System.out.println(e.getMessage());
                }
            }

            // Verificar que haya stock suficiente en cada SucursalInsumo
            for (Map.Entry<Long, Double> entry : requerimientos.entrySet()) {
                Long siId = entry.getKey();
                double requerido = entry.getValue();

                SucursalInsumo si = sucursalInsumoService.getById(siId);
                if (si.getStockActual() < requerido) {
                    return false; // No hay suficiente stock
                }
            }

            return true; // Todo OK
        } catch (Exception e) {
            logger.error("Error al verificar stock de promoción: ", e);
            return false;
        }
    }

    @Override
    public List<Promocion> findPromocionsBySucursal(Sucursal sucursal) {
        return promocionRepository.findPromocionesActivasPorSucursalConArticulosNoEliminados(sucursal);
    }

    @Override
    public List<Promocion> findByDetalles_Articulo_Id(Long id) {
        return promocionRepository.findByDetallesArticuloId(id);
    }


    @Override
    @Transactional
    public Promocion save(Promocion entity) {
        validarDatosBasicos(entity);
        validarDetalles(entity);

        for (DetallePromocion detalle : entity.getDetalles()) {
            detalle.setPromocion(entity);
        }

        for (ImagenPromocion imagen : entity.getImagenes()) {
            imagen.setPromocion(entity);
        }

        // Verificar duplicado
        if (promocionRepository.existsByDenominacion(entity.getDenominacion())) {
            throw new IllegalArgumentException("Ya existe una promoción con la denominación: " + entity.getDenominacion());
        }

        logger.info("Guardando Promocion: {}", entity.getDenominacion());
        return super.save(entity);
    }

    @Override
    @Transactional
    public Promocion update(Long id, Promocion entity) {
        validarDatosBasicos(entity);
        validarDetalles(entity);

        // Verificar duplicado excluyendo ID actual
        if (promocionRepository.existsByDenominacionAndIdNot(entity.getDenominacion(), id)) {
            throw new IllegalArgumentException("Ya existe una promoción con la denominación: " + entity.getDenominacion());
        }

        for (DetallePromocion detalle : entity.getDetalles()) {
            detalle.setPromocion(entity);
        }

        for (ImagenPromocion imagen : entity.getImagenes()) {
            imagen.setPromocion(entity);
        }

        double total = 0;
        for (DetallePromocion detalle : entity.getDetalles()) {
            total += detalle.getCantidad() * detalle.getArticulo().getPrecioVenta();
            detalle.setPromocion(entity);
        }
        entity.setPrecioPromocional(total - (total * (entity.getDescuento() / 100)));

        logger.info("Actualizando Promocion con ID: {}", id);
        return super.update(id, entity);
    }

    private void validarDatosBasicos(Promocion promocion) {
        if (promocion.getDenominacion() == null || promocion.getDenominacion().trim().isEmpty()) {
            throw new IllegalArgumentException("La denominación de la promoción es obligatoria");
        }

        if (promocion.getFechaDesde() == null || promocion.getFechaHasta() == null) {
            throw new IllegalArgumentException("Debe especificar el rango de fechas de vigencia");
        }

        if (promocion.getFechaDesde().isAfter(promocion.getFechaHasta())) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }

        if (promocion.getHoraDesde() == null || promocion.getHoraHasta() == null) {
            throw new IllegalArgumentException("Debe especificar el rango horario");
        }

        if (promocion.getHoraDesde().isAfter(promocion.getHoraHasta())) {
            throw new IllegalArgumentException("La hora de inicio no puede ser posterior a la hora de fin");
        }

        if (promocion.getPrecioPromocional() == null || promocion.getPrecioPromocional() <= 0) {
            throw new IllegalArgumentException("El precio promocional debe ser mayor a 0");
        }

        if (promocion.getTipoPromocion() == null) {
            throw new IllegalArgumentException("Debe especificar el tipo de promoción");
        }

        if (promocion.getSucursales().isEmpty()) {
            throw new IllegalArgumentException("Debe asociar al menos una sucursal a la promoción");
        }
    }

    private void validarDetalles(Promocion promocion) {
        if (promocion.getDetalles() == null || promocion.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("La promoción debe contener al menos un producto");
        }

        for (DetallePromocion detalle : promocion.getDetalles()) {
            if (detalle.getArticulo() == null) {
                throw new IllegalArgumentException("Cada detalle debe tener un artículo asignado");
            }

            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad de un detalle debe ser mayor a 0");
            }
        }
    }

    @Override
    public boolean existsById(Long id) {
        return promocionRepository.existsById(id);
    }

    @Override
    public Page<Promocion> buscarPromocionesFiltradas(String denominacion,
                                                      TipoPromocion tipoPromocion,
                                                      Boolean activa,
                                                      OffsetDateTime fechaHoraDesde,
                                                      OffsetDateTime fechaHoraHasta,
                                                      Double precioMin,
                                                      Double precioMax,
                                                      Pageable pageable) {
        Specification<Promocion> spec = PromocionSpecification.filtrar(
                denominacion,
                tipoPromocion,
                activa,
                fechaHoraDesde,
                fechaHoraHasta,
                precioMin,
                precioMax,
                null // o pasá el ID de sucursal si querés filtrar también por eso
        );
        return promocionRepository.findAll(spec, pageable);
    }



}