package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.DetallePromocion;
import com.lab4.buen_sabor_backend.model.ImagenPromocion;
import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import com.lab4.buen_sabor_backend.repository.PromocionRepository;

import com.lab4.buen_sabor_backend.service.PromocionService;
import com.lab4.buen_sabor_backend.service.impl.specification.PromocionSpecification;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromocionServiceImpl extends MasterServiceImpl<Promocion, Long> implements PromocionService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(PromocionServiceImpl.class);

    private final PromocionRepository promocionRepository;

    @Autowired
    public PromocionServiceImpl(PromocionRepository promocionRepository) {
        super(promocionRepository);
        this.promocionRepository = promocionRepository;
    }

    @Override
    public List<Promocion> findPromocionsBySucursal(Sucursal sucursal) {
        return promocionRepository.findBySucursales(sucursal);
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
    public Page<Promocion> buscarPromocionesFiltradas(Long idSucursal, Boolean activa, TipoPromocion tipoPromocion,
                                                      LocalDate fechaDesde, LocalDate fechaHasta, Pageable pageable) {

        Specification<Promocion> spec = Specification.where(PromocionSpecification.conSucursal(idSucursal))
                .and(PromocionSpecification.conActiva(activa))
                .and(PromocionSpecification.conTipo(tipoPromocion))
                .and(PromocionSpecification.desdeFecha(fechaDesde))
                .and(PromocionSpecification.hastaFecha(fechaHasta));

        return promocionRepository.findAll(spec, pageable);
    }


}