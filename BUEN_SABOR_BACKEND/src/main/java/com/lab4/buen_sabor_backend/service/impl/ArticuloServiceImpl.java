package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.controller.PedidoController;
import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.repository.ArticuloRepository;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
import com.lab4.buen_sabor_backend.service.ArticuloService;
import com.lab4.buen_sabor_backend.service.SucursalInsumoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service

public class ArticuloServiceImpl extends MasterServiceImpl<Articulo, Long>
        implements ArticuloService {
    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);

    private final ArticuloRepository articuloRepository;
    private final ArticuloManufacturadoService articuloManufacturadoService;
    private final ArticuloInsumoService articuloInsumoService;
    private final SucursalInsumoService sucursalInsumoService;
    @Autowired
    public ArticuloServiceImpl(ArticuloRepository articuloRepository, ArticuloRepository articuloRepository1, ArticuloManufacturadoService articuloManufacturadoService, ArticuloInsumoService articuloInsumoService, SucursalInsumoService sucursalInsumoService) {
        super(articuloRepository);
        this.articuloRepository = articuloRepository1;
        this.articuloManufacturadoService = articuloManufacturadoService;
        this.articuloInsumoService = articuloInsumoService;
        this.sucursalInsumoService = sucursalInsumoService;
    }

    @Override
    public boolean existsById(Long id) {
        return articuloRepository.existsById(id);
    }

    @Override
    public List<Articulo> findByDenominacionAndEliminadoFalse(String denominacion) {
        return articuloRepository.findByDenominacionContainingIgnoreCaseAndEliminadoFalse(denominacion);
    }

    @Override
    public boolean verificarStockArticulo(Articulo articulo, Long sucursalId) {
        try {
            // Map< ID del SucursalInsumo, RequerimientoInfo >
                Map<Long, RequerimientoInfo> requerimientos = new HashMap<>();

            try {
                // Intentar como insumo directo
                ArticuloInsumo insumo = articuloInsumoService.getById(articulo.getId());

                if (!insumo.getEsParaElaborar()) {
                    SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursalId, insumo.getId());
                    if (si == null) {
                        throw new RuntimeException("El artículo no tiene stock en esta sucursal");
                    }

                    // Para un solo artículo, cantidad requerida = 1
                    Long siId = si.getId();
                    double cantidadRequerida = 1.0;
                    double costoComponente = insumo.getPrecioCompra() * cantidadRequerida;

                    requerimientos.put(siId, new RequerimientoInfo(si, cantidadRequerida, costoComponente));
                }

            } catch (EntityNotFoundException e) {
                // Es un artículo manufacturado
                try {
                    ArticuloManufacturado man = articuloManufacturadoService.getById(articulo.getId());

                    for (DetalleArticuloManufacturado dam : man.getDetalles()) {
                        ArticuloInsumo ai = dam.getArticuloInsumo();
                        SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursalId, ai.getId());
                        if (si == null) {
                            throw new RuntimeException("El artículo no tiene stock en esta sucursal");
                        }

                        // Para un solo artículo manufacturado
                        double cantidadRequerida = dam.getCantidad();
                        double costoComponente = ai.getPrecioCompra() * cantidadRequerida;

                        // Consolidar requerimientos por ID de SucursalInsumo
                        Long siId = si.getId();
                        requerimientos.merge(siId,
                                new RequerimientoInfo(si, cantidadRequerida, costoComponente),
                                (existing, nuevo) -> new RequerimientoInfo(
                                        existing.getSucursalInsumo(),
                                        existing.getCantidadRequerida() + nuevo.getCantidadRequerida(),
                                        existing.getCostoTotal() + nuevo.getCostoTotal()
                                )
                        );
                    }
                } catch (EntityNotFoundException ex) {
                    // Artículo no existe
                    throw new RuntimeException("El artículo no existe");
                }
            }

            // Verificar stock disponible
            for (RequerimientoInfo req : requerimientos.values()) {
                SucursalInsumo si = req.getSucursalInsumo();
                double requerido = req.getCantidadRequerida();

                // Refrescar el stock actual desde la base de datos para evitar datos obsoletos
                si = sucursalInsumoService.getById(si.getId());

                if (si.getStockActual() < requerido) {
                    throw new RuntimeException("No hay stock suficiente del insumo ID: " + si.getId() +
                            " en la sucursal. Stock actual: " + si.getStockActual() +
                            ", Requerido: " + requerido);
                }
            }

            // Si llegamos aquí, hay stock suficiente
            return true;

        } catch (Exception e) {
            logger.error("Error al verificar stock del artículo: ", e);
            throw new RuntimeException("Error al verificar stock del artículo: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Articulo> findArticuloByCategoriaId(Long categoriaId) {
        return articuloRepository.findArticuloByCategoriaId(categoriaId);
    }

    // Clase auxiliar (si no existe ya)
    public static class RequerimientoInfo {
        private SucursalInsumo sucursalInsumo;
        private double cantidadRequerida;
        private double costoTotal;

        public RequerimientoInfo(SucursalInsumo sucursalInsumo, double cantidadRequerida, double costoTotal) {
            this.sucursalInsumo = sucursalInsumo;
            this.cantidadRequerida = cantidadRequerida;
            this.costoTotal = costoTotal;
        }

        // Getters
        public SucursalInsumo getSucursalInsumo() {
            return sucursalInsumo;
        }

        public double getCantidadRequerida() {
            return cantidadRequerida;
        }

        public double getCostoTotal() {
            return costoTotal;
        }
    }

}
