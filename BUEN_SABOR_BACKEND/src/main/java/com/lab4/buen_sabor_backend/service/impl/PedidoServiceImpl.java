package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.dto.PedidoDTO;
import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import com.lab4.buen_sabor_backend.repository.ClienteRepository;
import com.lab4.buen_sabor_backend.repository.EmpleadoRepository;
import com.lab4.buen_sabor_backend.repository.SucursalInsumoRepository;
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
import java.time.OffsetDateTime;
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
    private final ClienteRepository clienteRepository;
    private final SucursalInsumoRepository sucursalInsumoRepository;

    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, PdfService pdfService, ArticuloInsumoService articuloInsumoService,
                             SucursalInsumoService sucursalInsumoService, ArticuloManufacturadoService articuloManufacturadoService,
                             EmpleadoRepository empleadoRepository, ExcelService excelService, EmailService emailService,
                             PromocionService promocionService, DetallePedidoService detallePedidoService, ArticuloService articuloService,
                             ClienteRepository clienteRepository, SucursalInsumoRepository sucursalInsumoRepository) {
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
        this.clienteRepository = clienteRepository;
        this.sucursalInsumoRepository = sucursalInsumoRepository;
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
            OffsetDateTime fechaDesde,
            OffsetDateTime fechaHasta,
            String nombreArticulo,
            Pageable pageable
    ) {
        Specification<Pedido> spec = Specification.where(clienteIdEquals(clienteId))
                .and(sucursalNombreContains(sucursalNombre))
                .and(estadoEquals(estado))
                .and(fechaBetween(fechaDesde, fechaHasta))
                .and(contieneArticulo(nombreArticulo));

        return pedidoRepository.findAll(spec, pageable);
    }

    //Buscar pedidos con filtros
    @Override
    public Page<Pedido> buscarPedidosFiltrados(
            Long idSucursal,
            List<Estado> estados,
            String clienteNombre,
            Long idPedido,
            Long idEmpleado,
            Boolean pagado,
            OffsetDateTime fechaDesde,
            OffsetDateTime fechaHasta,
            TipoEnvio tipoEnvio,
            Pageable pageable
    ) {
        Specification<Pedido> spec = Specification
                .where(PedidoSpecification.sucursalIdEquals(idSucursal))
                .and(PedidoSpecification.estadoIn(estados))
                .and(PedidoSpecification.clienteNombreContains(clienteNombre))
                .and(PedidoSpecification.idEquals(idPedido))
                .and(PedidoSpecification.empleadoIdEquals(idEmpleado))
                .and(PedidoSpecification.pagadoEquals(pagado))
                .and(PedidoSpecification.fechaBetween(fechaDesde, fechaHasta))
                .and(PedidoSpecification.tipoEnvioEquals(tipoEnvio));
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
            Sucursal sucursal = pedido.getSucursal();
            double totalCosto = 0.0;
            // Mapa para llevar el stock simulado de cada insumo en la sucursal
            Map<Long, Double> stockSimulado = new HashMap<>();
            // Mapa para llevar el requerimiento acumulado de cada insumo
            Map<Long, RequerimientoInfo> requerimientos = new HashMap<>();

            for (DetallePedido detPed : pedido.getDetalles()) {
                // Procesar promociones primero
                if (detPed.getPromocion() != null) {
                    for (DetallePromocion deta : detPed.getPromocion().getDetalles()) {
                        Articulo art = deta.getArticulo();
                        int cantidadPed = deta.getCantidad() * detPed.getCantidad();

                        try {
                            ArticuloInsumo insumo = articuloInsumoService.getById(art.getId());
                            if (insumo.isEliminado()) {
                                throw new RuntimeException("El articulo " + insumo.getDenominacion() + " está eliminado");
                            }
                            if (!insumo.getEsParaElaborar()) {
                                SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                                if (si == null) throw new RuntimeException("El artículo no tiene stock");

                                // Simular stock
                                double stockActual = stockSimulado.getOrDefault(si.getId(), si.getStockActual());
                                if (stockActual < cantidadPed) {
                                    double cantidadFaltante = cantidadPed - stockActual;
                                    // Para promociones, calcular cuántas promociones eliminar
                                    int promocionesAEliminar = (int) Math.ceil(cantidadFaltante / deta.getCantidad());
                                    throw new RuntimeException("Para continuar elimine " + promocionesAEliminar + " unidades de la promoción: " + detPed.getPromocion().getDenominacion() + " (falta " + insumo.getDenominacion() + ")");
                                }
                                stockSimulado.put(si.getId(), stockActual - cantidadPed);

                                // Acumular requerimiento
                                requerimientos.merge(si.getId(),
                                        new RequerimientoInfo(si, (double) cantidadPed, insumo.getPrecioCompra() * cantidadPed),
                                        (existing, nuevo) -> new RequerimientoInfo(
                                                existing.getSucursalInsumo(),
                                                existing.getCantidadRequerida() + nuevo.getCantidadRequerida(),
                                                existing.getCostoTotal() + nuevo.getCostoTotal()
                                        )
                                );
                            }
                        } catch (EntityNotFoundException e) {
                            // Es manufacturado
                            try {
                                ArticuloManufacturado man = articuloManufacturadoService.getById(art.getId());
                                if (man.isEliminado()) {
                                    throw new RuntimeException("El articulo " + man.getDenominacion() + " está eliminado");
                                }
                                for (DetalleArticuloManufacturado dam : man.getDetalles()) {
                                    ArticuloInsumo ai = dam.getArticuloInsumo();
                                    SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), ai.getId());
                                    if (si == null) throw new RuntimeException("El artículo no tiene stock");

                                    double cantidadRequerida = dam.getCantidad() * cantidadPed;
                                    double stockActual = stockSimulado.getOrDefault(si.getId(), si.getStockActual());
                                    if (stockActual < cantidadRequerida) {
                                        double cantidadFaltante = cantidadRequerida - stockActual;
                                        // Calcular promociones a eliminar basado en el insumo faltante
                                        double insumosPorPromocion = dam.getCantidad() * deta.getCantidad();
                                        int promocionesAEliminar = (int) Math.ceil(cantidadFaltante / insumosPorPromocion);
                                        throw new RuntimeException("Para continuar elimine " + promocionesAEliminar + " unidades de la promoción: " + detPed.getPromocion().getDenominacion() + " (falta " + ai.getDenominacion() + ")");
                                    }
                                    stockSimulado.put(si.getId(), stockActual - cantidadRequerida);

                                    double costoComponente = ai.getPrecioCompra() * cantidadRequerida;
                                    requerimientos.merge(si.getId(),
                                            new RequerimientoInfo(si, cantidadRequerida, costoComponente),
                                            (existing, nuevo) -> new RequerimientoInfo(
                                                    existing.getSucursalInsumo(),
                                                    existing.getCantidadRequerida() + nuevo.getCantidadRequerida(),
                                                    existing.getCostoTotal() + nuevo.getCostoTotal()
                                            )
                                    );
                                }
                            } catch (EntityNotFoundException ex) {
                                throw new RuntimeException("El artículo no existe");
                            }
                        }
                    }
                }

                // Procesar artículos individuales
                if (detPed.getArticulo() != null && detPed.getArticulo().getId() != null) {
                    Articulo art2 = detPed.getArticulo();
                    int cantidadPed = detPed.getCantidad();

                    try {
                        ArticuloInsumo insumo = articuloInsumoService.getById(art2.getId());
                        if (insumo.isEliminado()) {
                            throw new RuntimeException("El articulo " + insumo.getDenominacion() + " está eliminado");
                        }
                        if (!insumo.getEsParaElaborar()) {
                            SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                            if (si == null) {
                                throw new RuntimeException("El articulo no tiene stock");
                            }

                            double stockActual = stockSimulado.getOrDefault(si.getId(), si.getStockActual());
                            if (stockActual < cantidadPed) {
                                double cantidadFaltante = cantidadPed - stockActual;
                                throw new RuntimeException("Para continuar elimine " + (int)Math.ceil(cantidadFaltante) + " unidades de: " + insumo.getDenominacion());
                            }
                            stockSimulado.put(si.getId(), stockActual - cantidadPed);

                            requerimientos.merge(si.getId(),
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
                            if (man.isEliminado()) {
                                throw new RuntimeException("El articulo " + man.getDenominacion() + " está eliminado");
                            }

                            // Verificar cada insumo del artículo manufacturado
                            for (DetalleArticuloManufacturado dam : man.getDetalles()) {
                                ArticuloInsumo ai = dam.getArticuloInsumo();
                                SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), ai.getId());
                                if (si == null) {
                                    throw new RuntimeException("El articulo no tiene stock");
                                }

                                double cantidadRequerida = dam.getCantidad() * cantidadPed;
                                double stockActual = stockSimulado.getOrDefault(si.getId(), si.getStockActual());
                                if (stockActual < cantidadRequerida) {
                                    double cantidadFaltante = cantidadRequerida - stockActual;
                                    // Calcular cuántas unidades del producto manufacturado hay que eliminar
                                    int unidadesAEliminar = (int) Math.ceil(cantidadFaltante / dam.getCantidad());
                                    throw new RuntimeException("Para continuar elimine " + unidadesAEliminar + " unidades de: " + man.getDenominacion() + " (falta " + ai.getDenominacion() + ")");
                                }
                                stockSimulado.put(si.getId(), stockActual - cantidadRequerida);

                                double costoComponente = ai.getPrecioCompra() * cantidadRequerida;
                                requerimientos.merge(si.getId(),
                                        new RequerimientoInfo(si, cantidadRequerida, costoComponente),
                                        (existing, nuevo) -> new RequerimientoInfo(
                                                existing.getSucursalInsumo(),
                                                existing.getCantidadRequerida() + nuevo.getCantidadRequerida(),
                                                existing.getCostoTotal() + nuevo.getCostoTotal()
                                        )
                                );
                            }
                        } catch (EntityNotFoundException ex) {
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

            // Si llegamos aquí, hay stock suficiente - proceder con la transacción
            return true;

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error inesperado al procesar pedido: ", e);
            throw new RuntimeException("Ocurrió un error inesperado al procesar el pedido.");
        }
    }

    public boolean verificarStockArticulo(Long articuloId, int cantidad, Long sucursalId) {
        try {
            try {
                // Intentar como insumo directo
                ArticuloInsumo insumo = articuloInsumoService.getById(articuloId);
                if (!insumo.getEsParaElaborar()) {
                    SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursalId, insumo.getId());
                    if (si == null || si.getStockActual() < cantidad) {
                        return false;
                    }
                    return true;
                }
            } catch (EntityNotFoundException e) {
                // Es manufacturado
                ArticuloManufacturado man = articuloManufacturadoService.getById(articuloId);
                for (DetalleArticuloManufacturado det : man.getDetalles()) {
                    ArticuloInsumo insumo = det.getArticuloInsumo();
                    double cantidadRequerida = det.getCantidad() * cantidad;

                    SucursalInsumo si = sucursalInsumoService.findBySucursalIdAndArticuloInsumoId(sucursalId, insumo.getId());
                    if (si == null || si.getStockActual() < cantidadRequerida) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    //Cambiar estado del pedido
    @Override
    @Transactional
    public void cambiarEstadoPedido(Pedido pedidoRequest) {
        Pedido pedido = pedidoRepository.findByIdAndSucursalId(pedidoRequest.getId(), pedidoRequest.getSucursal().getId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado para esa sucursal."));

        Estado estadoActual = pedido.getEstado();
        Estado nuevoEstado = pedidoRequest.getEstado();
        Rol rol;

        // Validación: no permitir pasar a EN_DELIVERY si el tipo de envío es TAKEAWAY
        if (nuevoEstado == Estado.EN_DELIVERY && pedido.getTipoEnvio() != null && pedido.getTipoEnvio().name().equals("TAKEAWAY")) {
            throw new RuntimeException("No se puede cambiar a EN_DELIVERY un pedido con tipo de envío TAKEAWAY.");
        }

        // Validación: no permitir pasar a ENTREGADO si el pedido no está pagado
        if (nuevoEstado == Estado.ENTREGADO && !pedido.isPagado()) {
            throw new RuntimeException("No se puede marcar como ENTREGADO un pedido que no está pagado.");
        }

        // Determinar si fue un empleado o cliente quien hizo la solicitud
        Empleado empleado = null;
        if (pedidoRequest.getEmpleado() != null) {
            empleado = empleadoRepository.findById(pedidoRequest.getEmpleado().getId())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado."));
        } else if (pedidoRequest.getCliente() != null) {
            Cliente cliente = clienteRepository.findById(pedidoRequest.getCliente().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado."));
            rol = cliente.getUsuario().getRol();
        } else {
            throw new RuntimeException("Debe enviarse un empleado o cliente para cambiar el estado.");
        }

        // Lógica adicional: si se cambia de LISTO a EN_DELIVERY
        if (estadoActual == Estado.LISTO && nuevoEstado == Estado.EN_DELIVERY) {

            if (empleado == null || empleado.getId() == null) {
                throw new RuntimeException("Debe asignar un empleado de tipo DELIVERY al pasar a EN_DELIVERY.");
            }

            Empleado empleadoDelivery = empleadoRepository.findById(empleado.getId())
                    .orElseThrow(() -> new RuntimeException("Empleado DELIVERY no encontrado."));

            if (empleadoDelivery.getUsuario().getRol() != Rol.DELIVERY) {
                throw new RuntimeException("El empleado asignado no tiene rol DELIVERY.");
            }

            if (!empleadoDelivery.getSucursal().getId().equals(pedido.getSucursal().getId())) {
                throw new RuntimeException("El empleado DELIVERY no pertenece a la misma sucursal que el pedido.");
            }

            // Asignar delivery al pedido
            pedido.setEmpleado(empleadoDelivery);
        }

        // Actualizar estado
        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);

        // Si el pedido fue cancelado, devolver stock
        if (estadoActual != Estado.CANCELADO && nuevoEstado == Estado.CANCELADO) {
            devolverStockPedido(pedido);
        }

        // Envío de emails
        try {
            if (nuevoEstado == Estado.CANCELADO) {
                // Solo enviar nota de crédito si pagado y forma de pago es MERCADOPAGO
                if (pedido.isPagado() && pedido.getFormaPago() != null && pedido.getFormaPago().name().equals("MERCADOPAGO")) {
                    emailService.enviarNotaCredito(pedido);
                } else {
                    emailService.enviarAvisoCancelacionEfectivo(pedido);
                }
            } else if (nuevoEstado == Estado.ENTREGADO) {
                emailService.enviarFactura(pedido);
            }
        } catch (Exception e) {
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
            // Procesar promociones
            if (detPed.getPromocion() != null) {
                for (DetallePromocion deta : detPed.getPromocion().getDetalles()) {
                    art = deta.getArticulo();
                    int cantidadTotalRequerida = deta.getCantidad() * detPed.getCantidad(); // CORREGIDO: usar deta.getCantidad()

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
                            double costoComponente = insumo.getPrecioCompra() * cantidadTotalRequerida; // CORREGIDO
                            requerimientos.merge(siId,
                                    new RequerimientoInfo(si, (double) cantidadTotalRequerida, costoComponente), // CORREGIDO
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

                                double cantidadRequerida = dam.getCantidad() * cantidadTotalRequerida; // CORREGIDO: usar cantidadTotalRequerida
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

            // Procesar artículos individuales
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
                        double costoComponente = insumo.getPrecioCompra() * cantidadPed;
                        requerimientos.merge(siId,
                                new RequerimientoInfo(si, (double) cantidadPed, costoComponente),
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

    @Override
    public byte[] exportarPedidosFiltradosExcel(Long idSucursal, List<Estado> estados, String clienteNombre,
                                                Long idPedido, Long idEmpleado,
                                                OffsetDateTime fechaDesde, OffsetDateTime fechaHasta,
                                                Boolean pagado, TipoEnvio tipoEnvio) {

        List<Pedido> pedidosFiltrados = pedidoRepository.exportarPedidosFiltrados(
                idSucursal, estados, clienteNombre, idPedido, idEmpleado, fechaDesde, fechaHasta, tipoEnvio, pagado
        );

        return excelService.exportarPedidosAExcel(pedidosFiltrados);
    }

    // --- Agregar método para devolución de stock ---
    private void devolverStockPedido(Pedido pedido) {
        if (pedido.getDetalles() == null) return;
        for (DetallePedido detalle : pedido.getDetalles()) {
            // Si es artículo simple
            if (detalle.getArticulo() != null) {
                devolverStockArticulo(detalle.getArticulo(), detalle.getCantidad(), pedido.getSucursal());
            }
            // Si es promoción, devolver stock de cada artículo de la promo
            if (detalle.getPromocion() != null && detalle.getPromocion().getDetalles() != null) {
                for (DetallePromocion detPromo : detalle.getPromocion().getDetalles()) {
                    devolverStockArticulo(detPromo.getArticulo(), detPromo.getCantidad() * detalle.getCantidad(), pedido.getSucursal());
                }
            }
        }
    }

    private void devolverStockArticulo(Articulo articulo, int cantidad, Sucursal sucursal) {
        // Si es insumo, sumar stock en SucursalInsumo
        if (articulo instanceof ArticuloInsumo) {
            ArticuloInsumo insumo = (ArticuloInsumo) articulo;
            SucursalInsumo sucInsumo = sucursalInsumoRepository.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
            if (sucInsumo != null) {
                sucInsumo.setStockActual(sucInsumo.getStockActual() + cantidad);
                sucursalInsumoRepository.save(sucInsumo);
            }
        } else if (articulo instanceof ArticuloManufacturado) {
            // Si es manufacturado, devolver stock de insumos según receta
            ArticuloManufacturado man = (ArticuloManufacturado) articulo;
            for (DetalleArticuloManufacturado det : man.getDetalles()) {
                ArticuloInsumo insumo = det.getArticuloInsumo();
                double cantidadTotal = det.getCantidad() * cantidad;
                SucursalInsumo sucInsumo = sucursalInsumoRepository.findBySucursalIdAndArticuloInsumoId(sucursal.getId(), insumo.getId());
                if (sucInsumo != null) {
                    sucInsumo.setStockActual(sucInsumo.getStockActual() + cantidadTotal);
                    sucursalInsumoRepository.save(sucInsumo);
                }
            }
        }
    }
}