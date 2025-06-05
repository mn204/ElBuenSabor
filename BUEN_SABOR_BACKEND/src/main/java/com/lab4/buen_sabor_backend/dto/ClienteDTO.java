package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Rol;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDTO extends MasterDTO {
    private String nombre;
    private String apellido;
    private String telefono;
    private LocalDate fechaNacimiento;
    private ImagenUsuarioDTO imagenUsuario;
    private Set<DomicilioDTO> domicilios = new HashSet<>();
    private UsuarioDTO usuario;
    private Boolean eliminado;
}
