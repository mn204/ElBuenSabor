package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Estado;
import com.lab4.buen_sabor_backend.model.enums.FormaPago;
import com.lab4.buen_sabor_backend.model.enums.TipoEnvio;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PedidoDTO extends MasterDTO {

    private LocalTime horaEstimadaFinalizacion;
    private Double total;
    private Double totalCosto;
    private Estado estado;
    private TipoEnvio tipoEnvio;
    private FormaPago formaPago;
    private Date fechaPedido;
    private SucursalDTO sucursal;
    private EmpleadoDTO empleado;
    private ClienteDTO cliente;
    private DomicilioDTO domicilio;
    private FacturaDTO factura;
    private List<DetallePedidoDTO> detalles = new ArrayList<>();
}
