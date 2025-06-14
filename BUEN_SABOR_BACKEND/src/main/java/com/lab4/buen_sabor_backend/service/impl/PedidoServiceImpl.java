package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import com.lab4.buen_sabor_backend.repository.EmpleadoRepository;
import com.lab4.buen_sabor_backend.service.*;
import com.lab4.buen_sabor_backend.service.impl.specification.PedidoSpecification;
import static com.lab4.buen_sabor_backend.service.impl.specification.PedidoSpecification.*;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.repository.PedidoRepository;
import org.springframework.transaction.annotation.Transactional; // CAMBIO AQUÍ
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoServiceImpl.class);

    private final PedidoRepository pedidoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ExcelService excelService;
    private final PdfService pdfService;
    private final ArticuloInsumoService articuloInsumoService;
    private final SucursalInsumoService sucursalInsumoService;
    private final ArticuloManufacturadoService articuloManufacturadoService;

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, PdfService pdfService, ArticuloInsumoService articuloInsumoService,
                             SucursalInsumoService sucursalInsumoService, ArticuloManufacturadoService articuloManufacturadoService,
                             EmpleadoRepository empleadoRepository, ExcelService excelService) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.articuloInsumoService = articuloInsumoService;
        this.sucursalInsumoService = sucursalInsumoService;
        this.articuloManufacturadoService = articuloManufacturadoService;
        this.empleadoRepository = empleadoRepository;
        this.pdfService = pdfService;
        this.excelService = excelService;
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

    //Buscar pedidos con filtros para Cliente
    @Override
    public Page<Pedido> findPedidosByClienteWithFilters(
            Long clienteId,
            String sucursalNombre,
            Estado estado,
            LocalDateTime desde,
            LocalDateTime hasta,
            String nombreArticulo,
            Pageable pageable
    ) {
        Specification<Pedido> spec = Specification.where(clienteIdEquals(clienteId))
                .and(sucursalNombreContains(sucursalNombre))
                .and(estadoEquals(estado))
                .and(fechaBetween(desde, hasta))
                .and(contieneArticulo(nombreArticulo));

        return pedidoRepository.findAll(spec, pageable);
    }

    //Buscar pedidos con filtros
    @Override
    public Page<Pedido> buscarPedidosFiltrados(
            Long idSucursal,
            Estado estado,
            String clienteNombre,
            Long idPedido,
            Long idEmpleado, // <-- NUEVO PARÁMETRO
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta,
            Pageable pageable
    ) {
        Specification<Pedido> spec = Specification
                .where(PedidoSpecification.sucursalIdEquals(idSucursal))
                .and(PedidoSpecification.estadoEquals(estado))
                .and(PedidoSpecification.clienteNombreContains(clienteNombre))
                .and(PedidoSpecification.idEquals(idPedido))
                .and(PedidoSpecification.empleadoIdEquals(idEmpleado)) // <-- NUEVA LÍNEA
                .and(PedidoSpecification.fechaBetween(fechaDesde, fechaHasta));
        return pedidoRepository.findAll(spec, pageable);
    }

    //Buscar el detalle del pedido para Cliente.
    @Override
    public Optional<Pedido> findByIdAndCliente(Long idPedido, Long clienteId) {
        return pedidoRepository.findByIdAndClienteId(idPedido, clienteId);
    }

    @Override
    public void actualizarEstadoPorPago(Long pedidoId, Estado estado) {
        pedidoRepository.changeEstado(pedidoId, estado);
    }

    //Generar PDF para el Cliente.
    @Override
    @Transactional
    public byte[] generarFacturaPDF(Long pedidoId, Long clienteId) {
        Pedido pedido = pedidoRepository.findByIdAndClienteId(pedidoId, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Pedido no encontrado o no pertenece al cliente"));

        return pdfService.generarFacturaPedido(pedido);
    }
    @Override
    public boolean verificarStockPedido(Pedido pedido) {
        try {
            // Map< ID del SucursalInsumo, RequerimientoInfo >
            Map<Long, RequerimientoInfo> requerimientos = new HashMap<>();
            Sucursal sucursal = pedido.getSucursal();
            double totalCosto = 0.0;

            for (DetallePedido detPed : pedido.getDetalles()) {
                Articulo art = detPed.getArticulo();
                int cantidadPed = detPed.getCantidad();

                try {
                    // Intentar como insumo directo
                    ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());

                    if (!insumo.getEsParaElaborar()) {
                        SucursalInsumo si = insumo.getSucursalInsumo();
                        if (!si.getSucursal().getId().equals(sucursal.getId())) {
                            return false; // No hay stock en esta sucursal
                        }

                        // Consolidar requerimientos por ID de SucursalInsumo
                        Long siId = si.getId();
                        requerimientos.merge(siId,
                                new RequerimientoInfo(si, (double)cantidadPed, insumo.getPrecioCompra() * cantidadPed),
                                (existing, nuevo) -> new RequerimientoInfo(
                                        existing.getSucursalInsumo(),
                                        existing.getCantidadRequerida() + nuevo.getCantidadRequerida(),
                                        existing.getCostoTotal() + nuevo.getCostoTotal()
                                )
                        );
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

                            double cantidadRequerida = dam.getCantidad() * cantidadPed;
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
                        return false;
                    }
                }
            }

            // Calcular costo total
            totalCosto = requerimientos.values().stream()
                    .mapToDouble(RequerimientoInfo::getCostoTotal)
                    .sum();
            pedido.setTotalCosto(totalCosto);

            // Verificar stock disponible antes de proceder
            for (RequerimientoInfo req : requerimientos.values()) {
                SucursalInsumo si = req.getSucursalInsumo();
                double requerido = req.getCantidadRequerida();

                // Refrescar el stock actual desde la base de datos para evitar datos obsoletos
                si = sucursalInsumoService.getById(si.getId());

                if (si.getStockActual() < requerido) {
                    System.out.println("Stock insuficiente para insumo ID: " + si.getId() +
                            ". Requerido: " + requerido + ", Disponible: " + si.getStockActual());
                    return false;
                }
            }

            // Si llegamos aquí, hay stock suficiente - proceder con la transacción
            return true;

        } catch (Exception e) {
            logger.error("Error al procesar pedido: ", e);
            return false;
        }
    }


    @Override
    @Transactional
    public void cambiarEstadoPedido(Pedido pedidoRequest) {
        Pedido pedido = pedidoRepository.findByIdAndSucursalId(pedidoRequest.getId(), pedidoRequest.getSucursal().getId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado para esa sucursal."));

        Empleado empleado = empleadoRepository.findById(pedidoRequest.getEmpleado().getId())
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));

        Rol rol = empleado.getUsuario().getRol();
        Estado estadoActual = pedido.getEstado();
        Estado nuevoEstado = pedidoRequest.getEstado();

        if (!puedeCambiarEstado(rol, estadoActual, nuevoEstado)) {
            throw new RuntimeException("Cambio de estado no permitido para el rol " + rol);
        }

        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);
    }

    private boolean puedeCambiarEstado(Rol rol, Estado actual, Estado nuevo) {
        if (rol == Rol.ADMINISTRADOR || rol == Rol.CAJERO) return true;

        // No se puede retroceder (excepto ADMIN y CAJERO)
        if (nuevo.ordinal() < actual.ordinal()) return false;

        return switch (rol) {
            case CLIENTE -> actual == Estado.PENDIENTE && nuevo == Estado.CANCELADO;
            case DELIVERY -> actual == Estado.EN_DELIVERY && nuevo == Estado.ENTREGADO;
            case COCINERO -> actual == Estado.PREPARACION && nuevo == Estado.LISTO;
            default -> false;
        };
    }

    @Override
    public boolean verificarYDescontarStockPedido(Pedido pedido) {
        try {
            // Map< ID del SucursalInsumo, RequerimientoInfo >
            Map<Long, RequerimientoInfo> requerimientos = new HashMap<>();
            Sucursal sucursal = pedido.getSucursal();
            double totalCosto = 0.0;

            for (DetallePedido detPed : pedido.getDetalles()) {
                Articulo art = detPed.getArticulo();
                int cantidadPed = detPed.getCantidad();

                try {
                    // Intentar como insumo directo
                    ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());

                    if (!insumo.getEsParaElaborar()) {
                        SucursalInsumo si = insumo.getSucursalInsumo();
                        if (!si.getSucursal().getId().equals(sucursal.getId())) {
                            return false; // No hay stock en esta sucursal
                        }

                        // Consolidar requerimientos por ID de SucursalInsumo
                        Long siId = si.getId();
                        requerimientos.merge(siId,
                                new RequerimientoInfo(si, (double)cantidadPed, insumo.getPrecioCompra() * cantidadPed),
                                (existing, nuevo) -> new RequerimientoInfo(
                                        existing.getSucursalInsumo(),
                                        existing.getCantidadRequerida() + nuevo.getCantidadRequerida(),
                                        existing.getCostoTotal() + nuevo.getCostoTotal()
                                )
                        );
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

                            double cantidadRequerida = dam.getCantidad() * cantidadPed;
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
                        return false;
                    }
                }
            }

            // Calcular costo total
            totalCosto = requerimientos.values().stream()
                    .mapToDouble(RequerimientoInfo::getCostoTotal)
                    .sum();
            pedido.setTotalCosto(totalCosto);

            // Verificar stock disponible antes de proceder
            for (RequerimientoInfo req : requerimientos.values()) {
                SucursalInsumo si = req.getSucursalInsumo();
                double requerido = req.getCantidadRequerida();

                // Refrescar el stock actual desde la base de datos para evitar datos obsoletos
                si = sucursalInsumoService.getById(si.getId());

                if (si.getStockActual() < requerido) {
                    System.out.println("Stock insuficiente para insumo ID: " + si.getId() +
                            ". Requerido: " + requerido + ", Disponible: " + si.getStockActual());
                    return false;
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
    protected boolean guardarPedidoConTransaccion(Pedido pedido, Map<Long, RequerimientoInfo> requerimientos) {
        try {
            // Descontar stock
            for (RequerimientoInfo req : requerimientos.values()) {
                SucursalInsumo si = req.getSucursalInsumo();
                // Refrescar la entidad para asegurar que tenemos la versión más actual
                si = sucursalInsumoService.getById(si.getId());

                double nuevoStock = si.getStockActual() - req.getCantidadRequerida();
                si.setStockActual(nuevoStock);

                // Guardar explícitamente si es necesario
                sucursalInsumoService.save(si);

                logger.info("Stock actualizado para insumo ID: " + si.getId() +
                        ". Cantidad descontada: " + req.getCantidadRequerida() +
                        ". Stock restante: " + nuevoStock);
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

    // Clase helper para consolidar requerimientos
    private static class RequerimientoInfo {
        private final SucursalInsumo sucursalInsumo;
        private final double cantidadRequerida;
        private final double costoTotal;

        public RequerimientoInfo(SucursalInsumo sucursalInsumo, double cantidadRequerida, double costoTotal) {
            this.sucursalInsumo = sucursalInsumo;
            this.cantidadRequerida = cantidadRequerida;
            this.costoTotal = costoTotal;
        }

        public SucursalInsumo getSucursalInsumo() { return sucursalInsumo; }
        public double getCantidadRequerida() { return cantidadRequerida; }
        public double getCostoTotal() { return costoTotal; }
    }

    @Override
    public Pedido findFirstByClienteIdOrderByIdDesc(Long clienteId) {
        return pedidoRepository.findFirstByClienteIdOrderByIdDesc(clienteId);
    }

    @Override
    public byte[] exportarPedidosAExcel(List<Pedido> pedidos) {
        return excelService.exportarPedidosAExcel(pedidos);
    }
}
