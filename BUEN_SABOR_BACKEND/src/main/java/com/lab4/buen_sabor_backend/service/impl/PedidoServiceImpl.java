package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.*;
import com.lab4.buen_sabor_backend.service.impl.specification.PedidoSpecification;
import static com.lab4.buen_sabor_backend.service.impl.specification.PedidoSpecification.*;
import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.repository.PedidoRepository;
import com.lab4.buen_sabor_backend.service.PedidoService;
import com.lab4.buen_sabor_backend.service.PdfService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoServiceImpl extends MasterServiceImpl<Pedido, Long> implements PedidoService {

    private static final Logger logger = LoggerFactory.getLogger(PedidoServiceImpl.class);

    private final PedidoRepository pedidoRepository;
    private final PdfService pdfService;



    @Autowired
    public PedidoServiceImpl(PedidoRepository pedidoRepository, PdfService pdfService) {
        super(pedidoRepository);
        this.pedidoRepository = pedidoRepository;
        this.pdfService = pdfService;
    }

    @Override
    @Transactional
    public Pedido save(Pedido entity) {
        // Validaciones antes de guardar
        for(DetallePedido detalle : entity.getDetalles()) {
            detalle.setPedido(entity);
        }
        logger.info("Guardando ArticuloManufacturado: {}", entity.getId());
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
    @Transactional
    public byte[] generarFacturaPDF(Long pedidoId, Long clienteId) {
        Pedido pedido = pedidoRepository.findByIdAndClienteId(pedidoId, clienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Pedido no encontrado o no pertenece al cliente"));

        return pdfService.generarFacturaPedido(pedido);
    }
}