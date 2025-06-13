package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
import com.lab4.buen_sabor_backend.service.impl.specification.PedidoSpecification;
import static com.lab4.buen_sabor_backend.service.impl.specification.PedidoSpecification.*;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.repository.PedidoRepository;
import com.lab4.buen_sabor_backend.service.PedidoService;
import org.springframework.transaction.annotation.Transactional; // CAMBIO AQUÍ
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoServiceImpl.class);
    private final PedidoRepository pedidoRepository;
    private final ArticuloInsumoService articuloInsumoService;
    private final ArticuloManufacturadoService articuloManufacturadoService;

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, ArticuloInsumoService articuloInsumoService, ArticuloManufacturadoService articuloManufacturadoService) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.articuloInsumoService = articuloInsumoService;
        this.articuloManufacturadoService = articuloManufacturadoService;
    }

    @Override
    @Transactional
    public Pedido save(Pedido entity) {
        // Validaciones antes de guardar
        for(DetallePedido detalle : entity.getDetalles()) {
            detalle.setPedido(entity);
        }
        logger.info("Guardando Pedido: {}", entity.getId());
        return super.save(entity);
    }

    @Override
    public List<Pedido> findPedidosByClienteWithFilters(
            Long clienteId,
            String sucursalNombre,
            Estado estado,
            LocalDateTime desde,
            LocalDateTime hasta,
            String nombreArticulo
    ) {
        Specification<Pedido> spec = Specification.where(clienteIdEquals(clienteId))
                .and(sucursalNombreContains(sucursalNombre))
                .and(estadoEquals(estado))
                .and(fechaBetween(desde, hasta))
                .and(contieneArticulo(nombreArticulo));

        return pedidoRepository.findAll(spec);
    }

    @Override
    public Optional<Pedido> findByIdAndCliente(Long idPedido, Long clienteId) {
        return pedidoRepository.findByIdAndClienteId(idPedido, clienteId);
    }

    @Override
    public boolean verificarYDescontarStockPedido(Pedido pedido) {
        try {
            // Map< SucursalInsumo, cantidadTotalRequerida >
            Map<SucursalInsumo, Double> requerimientos = new HashMap<>();
            Sucursal sucursal = pedido.getSucursal();

            for (DetallePedido detPed : pedido.getDetalles()) {
                Articulo art = detPed.getArticulo();
                int cantidadPed = detPed.getCantidad();

                try {
                    ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());
                    if (!insumo.getEsParaElaborar()) {
                        SucursalInsumo si = insumo.getSucursalInsumo();
                        if (!si.getSucursal().getId().equals(sucursal.getId())) {
                            return false; // No hay stock en esta sucursal
                        }
                        requerimientos.merge(si, (double)cantidadPed, Double::sum);
                    }
                } catch (EntityNotFoundException e) {
                    // Es un artículo manufacturado
                    try {
                        ArticuloManufacturado man = articuloManufacturadoService.getById(art.getId());

                        for (DetalleArticuloManufacturado dam : man.getDetalles()) {
                            ArticuloInsumo ai = dam.getArticuloInsumo();
                            SucursalInsumo si = ai.getSucursalInsumo();
                            if (!si.getSucursal().getId().equals(sucursal.getId())) {
                                return false; // No hay insumos en esta sucursal
                            }

                            double totalReq = dam.getCantidad() * cantidadPed;
                            requerimientos.merge(si, totalReq, Double::sum);
                        }
                    } catch (EntityNotFoundException ex) {
                        // Artículo no existe
                        return false;
                    }
                }
            }

            // Verificar stock disponible antes de proceder
            for (Map.Entry<SucursalInsumo, Double> entry : requerimientos.entrySet()) {
                SucursalInsumo si = entry.getKey();
                double requerido = entry.getValue();
                if (si.getStockActual() < requerido) {
                    System.out.println("Stock insuficiente");
                    return false; // Stock insuficiente
                }
            }

            // Si llegamos aquí, hay stock suficiente - proceder con la transacción
            return guardarPedidoConTransaccion(pedido, requerimientos);

        } catch (Exception e) {
            logger.error("Error al procesar pedido: ", e);
            return false;
        }
    }

    @Transactional
    protected boolean guardarPedidoConTransaccion(Pedido pedido, Map<SucursalInsumo, Double> requerimientos) {
        try {
            // Descontar stock
            for (Map.Entry<SucursalInsumo, Double> entry : requerimientos.entrySet()) {
                SucursalInsumo si = entry.getKey();
                si.setStockActual(si.getStockActual() - entry.getValue());
                // El stock se actualiza automáticamente por estar en contexto JPA
            }

            // Guardar pedido
            for(DetallePedido detalle : pedido.getDetalles()) {
                detalle.setPedido(pedido);
            }
            pedidoRepository.save(pedido);
            return true;

        } catch (Exception e) {
            logger.error("Error al guardar pedido con transacción: ", e);
            throw e; // Re-lanzar para que haga rollback
        }
    }
}