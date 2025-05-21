package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Rol;
import lombok.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO extends MasterDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private Set<DomicilioDTO> domicilios = new HashSet<>();
    private Rol rol;
    private ImagenClienteDTO imagenCliente;
    private UsuarioClienteDTO usuarioCliente;
    private Boolean eliminado;
}
