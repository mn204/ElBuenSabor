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
import java.util.*;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoServiceImpl.class);

    private final PedidoRepository pedidoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final ExcelService excelService;
    private final PdfService pdfService;
    private final EmailService emailService;
    private final PromocionService promocionService;
    private final DetallePedidoService detallePedidoService;
    private final ArticuloInsumoService articuloInsumoService;
    private final ArticuloService articuloService;
    private final SucursalInsumoService sucursalInsumoService;
    private final ArticuloManufacturadoService articuloManufacturadoService;

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, PdfService pdfService, ArticuloInsumoService articuloInsumoService,
                             SucursalInsumoService sucursalInsumoService, ArticuloManufacturadoService articuloManufacturadoService,
                             EmpleadoRepository empleadoRepository, ExcelService excelService, EmailService emailService, PromocionService promocionService, DetallePedidoService detallePedidoService, ArticuloService articuloService) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.articuloInsumoService = articuloInsumoService;
        this.sucursalInsumoService = sucursalInsumoService;
        this.articuloManufacturadoService = articuloManufacturadoService;
        this.empleadoRepository = empleadoRepository;
        this.pdfService = pdfService;
        this.excelService = excelService;
        this.emailService = emailService;
        this.promocionService = promocionService;
        this.detallePedidoService = detallePedidoService;
        this.articuloService = articuloService;
    }

    @Override
    @Transactional
    public Pedido save(Pedido entity) {
        // Validaciones antes de guardar
        for (DetallePedido detalle : entity.getDetalles()) {
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
            Long idEmpleado,
            Boolean pagado,
            LocalDateTime fechaDesde,
            LocalDateTime fechaHasta,
            Pageable pageable
    ) {
        Specification<Pedido> spec = Specification
                .where(PedidoSpecification.sucursalIdEquals(idSucursal))
                .and(PedidoSpecification.estadoEquals(estado))
                .and(PedidoSpecification.clienteNombreContains(clienteNombre))
                .and(PedidoSpecification.idEquals(idPedido))
                .and(PedidoSpecification.empleadoIdEquals(idEmpleado))
                .and(PedidoSpecification.pagadoEquals(pagado))
                .and(PedidoSpecification.fechaBetween(fechaDesde, fechaHasta));
        return pedidoRepository.findAll(spec, pageable);
    }

    //Buscar el detalle del pedido para Cliente.
    @Override
    public Optional<Pedido> findByIdAndCliente(Long idPedido, Long clienteId) {
        return pedidoRepository.findByIdAndClienteId(idPedido, clienteId);
    }

    @Override
    public void actualizarEstadoPorPago(Long pedidoId, boolean estado) {
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

    //Cambiar pagado del pedido
    @Override
    @Transactional
    public Pedido marcarComoPagado(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con ID: " + id));

        if (!pedido.isPagado()) {
            pedido.setPagado(true);
            return pedidoRepository.save(pedido);
        }
        return pedido; // ya estaba pagado
    }

    @Override
    public boolean verificarStockPedido(Pedido pedido) {
        try {
            // Map< ID del SucursalInsumo, RequerimientoInfo >
            Map<Long, RequerimientoInfo> requerimientos = new HashMap<>();
            Sucursal sucursal = pedido.getSucursal();
            double totalCosto = 0.0;
            for (DetallePedido detPed : pedido.getDetalles()) {
                if (detPed.getPromocion() != null) {
                    for (DetallePromocion deta : detPed.getPromocion().getDetalles()) {
                        int cantidadPed = deta.getCantidad();
                        Articulo art = deta.getArticulo();

                        try {
                            // Intentar como insumo directo
                            ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());

                            if (!insumo.getEsParaElaborar()) {

                                SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                                if (si == null) {
                                    throw new RuntimeException("El articulo no tiene stock");
                                }

                                // Consolidar requerimientos por ID de SucursalInsumo
                                Long siId = si.getId();
                                requerimientos.merge(siId,
                                        new RequerimientoInfo(si, (double) cantidadPed, insumo.getPrecioCompra() * cantidadPed),
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
                                    SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), ai.getId());
                                    if (si == null) {
                                        throw new RuntimeException("El articulo no tiene stock");
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
                                throw new RuntimeException("El articulo no existe");
                            }
                        }
                    }
                }
                if (detPed.getArticulo() != null && detPed.getArticulo().getId() != null) {
                    Articulo art2 = detPed.getArticulo();
                    int cantidadPed = detPed.getCantidad();

                    try {
                        // Intentar como insumo directo
                        ArticuloInsumo insumo = articuloInsumoService.getById(art2.getId());

                        if (!insumo.getEsParaElaborar()) {

                            SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                            if (si == null) {
                                throw new RuntimeException("El articulo no tiene stock");
                            }

                            // Consolidar requerimientos por ID de SucursalInsumo
                            Long siId = si.getId();
                            requerimientos.merge(siId,
                                    new RequerimientoInfo(si, (double) cantidadPed, insumo.getPrecioCompra() * cantidadPed),
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
                            ArticuloManufacturado man = articuloManufacturadoService.getById(art2.getId());

                            for (DetalleArticuloManufacturado dam : man.getDetalles()) {
                                ArticuloInsumo ai = dam.getArticuloInsumo();
                                SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), ai.getId());
                                if (si == null) {
                                    throw new RuntimeException("El articulo no tiene stock");
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
                            throw new RuntimeException("El articulo no existe");
                        }
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
                    throw new RuntimeException("No hay stock del insumo ID: " + si.getId() + " en la sucursal: " + sucursal.getNombre());
                }
            }

            // Si llegamos aquí, hay stock suficiente - proceder con la transacción
            return true;

        } catch (Exception e) {
            logger.error("Error al procesar pedido: ", e);
            throw new RuntimeException("Error al procesar pedido: ", e);
        }
    }

    //Cambiar estado del pedido
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

        // Lógica de envío de email
        try {
            if (nuevoEstado == Estado.CANCELADO) {
                emailService.enviarNotaCredito(pedido);
            } else if (nuevoEstado == Estado.ENTREGADO) {
                emailService.enviarFactura(pedido);
            }
        } catch (Exception e) {
            // Registrar el error y continuar
            System.err.println("Error al enviar el email: " + e.getMessage());
        }
    }

    private boolean puedeCambiarEstado(Rol rol, Estado actual, Estado nuevo) {
        if (rol == Rol.ADMINISTRADOR) return true;
        if (rol == Rol.CAJERO) return nuevo.ordinal() > actual.ordinal();
        return switch (rol) {
            case CLIENTE -> actual == Estado.PENDIENTE && nuevo == Estado.CANCELADO;
            case DELIVERY -> actual == Estado.EN_DELIVERY && nuevo == Estado.ENTREGADO;
            case COCINERO -> actual == Estado.PREPARACION && nuevo == Estado.LISTO;
            default -> false;
        };
    }

    @Override
    public void verificarYDescontarStockPedido(Pedido pedido) throws RuntimeException {
        // Map< ID del SucursalInsumo, RequerimientoInfo >
        Map<Long, RequerimientoInfo> requerimientos = new HashMap<>();
        Sucursal sucursal = pedido.getSucursal();
        double totalCosto = 0.0;
        Articulo art;
        for (DetallePedido detPed : pedido.getDetalles()) {
            if (detPed.getPromocion() != null) {
                for (DetallePromocion deta : detPed.getPromocion().getDetalles()) {
                    art = deta.getArticulo();
                    int cantidadPed = deta.getCantidad();

                    try {
                        // Intentar como insumo directo
                        ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());

                        if (!insumo.getEsParaElaborar()) {

                            SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                            if (si == null) {
                                throw new RuntimeException("El articulo no tiene stock");
                            }

                            // Consolidar requerimientos por ID de SucursalInsumo
                            Long siId = si.getId();
                            requerimientos.merge(siId,
                                    new RequerimientoInfo(si, (double) cantidadPed, insumo.getPrecioCompra() * cantidadPed),
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
                                SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), ai.getId());
                                if (si == null) {
                                    throw new RuntimeException("El articulo no tiene stock");
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
                            throw new RuntimeException("El articulo no existe");
                        }
                    }
                }
            }
            if (detPed.getArticulo() != null && detPed.getArticulo().getId() != null) {
                art = detPed.getArticulo();
                int cantidadPed = detPed.getCantidad();

                try {
                    // Intentar como insumo directo
                    ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());

                    if (!insumo.getEsParaElaborar()) {

                        SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                        if (si == null) {
                            throw new RuntimeException("El articulo no tiene stock");
                        }

                        // Consolidar requerimientos por ID de SucursalInsumo
                        Long siId = si.getId();
                        requerimientos.merge(siId,
                                new RequerimientoInfo(si, (double) cantidadPed, insumo.getPrecioCompra() * cantidadPed),
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
                            SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), ai.getId());
                            if (si == null) {
                                throw new RuntimeException("El articulo no tiene stock");
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
                        throw new RuntimeException("El articulo no existe");
                    }
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
                throw new RuntimeException("No hay stock del insumo ID: " + si.getId() + " en la sucursal: " + sucursal.getNombre());
            }
        }

        // Si llegamos aquí, hay stock suficiente - proceder con la transacción
        try {
            if (!guardarPedidoConTransaccion(pedido, requerimientos)) {
                throw new RuntimeException("Error al guardar el pedido en la transacción");
            }
        } catch (Exception e) {
            logger.error("Error al procesar pedido: ", e);
            throw new RuntimeException("Error al procesar el pedido: " + e.getMessage(), e);
        }
    }


    @Transactional
    protected boolean guardarPedidoConTransaccion(Pedido pedido, Map<Long, RequerimientoInfo> requerimientos) {
        try {
            // Descontar stock
            for (RequerimientoInfo req : requerimientos.values()) {
                SucursalInsumo si = req.getSucursalInsumo();
                si = sucursalInsumoService.getById(si.getId());
                double nuevoStock = si.getStockActual() - req.getCantidadRequerida();
                si.setStockActual(nuevoStock);
                sucursalInsumoService.save(si);
            }

            // 1. Primero guardar el pedido sin detalles
            List<DetallePedido> detallesOriginales = new ArrayList<>(pedido.getDetalles());
            pedido.getDetalles().clear();

            Pedido pedidoGuardado = save(pedido);

            // 2. Luego guardar los detalles uno por uno
            for (DetallePedido detalle : detallesOriginales) {
                detalle.setPedido(pedidoGuardado);
                detalle.setId(null); // Asegurar que es una nueva entidad

                // Solo establecer la referencia por ID, no la entidad completa
                if (detalle.getArticulo() != null && detalle.getArticulo().getId() != null) {
                    // Validar que el artículo existe
                    if (!articuloService.existsById(detalle.getArticulo().getId())) {
                        throw new RuntimeException("Artículo no encontrado: " + detalle.getArticulo().getId());
                    }
                }else{
                    detalle.setArticulo(null);
                }

                if (detalle.getPromocion() != null && detalle.getPromocion().getId() != null) {
                    // Validar que la promoción existe
                    if (!promocionService.existsById(detalle.getPromocion().getId())) {
                        throw new RuntimeException("Promoción no encontrada: " + detalle.getPromocion().getId());
                    }
                }else{
                    detalle.setPromocion(null);
                }
                System.out.println(detalle.getArticulo());
                System.out.println(detalle.getPromocion());
                detallePedidoService.save(detalle);
            }

            return true;

        } catch (Exception e) {
            logger.error("Error al guardar pedido con transacción: ", e);
            throw e;
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

    @Override
    public Pedido findFirstByClienteIdOrderByIdDesc(Long clienteId) {
        return pedidoRepository.findFirstByClienteIdOrderByIdDesc(clienteId);
    }

    @Override
    public Long countPedidosByClienteId(Long clienteId){
        return pedidoRepository.countPedidosByClienteId(clienteId);
    };

    // Generacion de Excel para los pedidos.
    @Override
    public byte[] exportarPedidosAExcel(List<Pedido> pedidos) {
        return excelService.exportarPedidosAExcel(pedidos);
    }

}
