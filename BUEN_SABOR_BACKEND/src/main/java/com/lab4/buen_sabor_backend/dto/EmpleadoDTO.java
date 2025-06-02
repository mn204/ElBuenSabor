package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Rol;
import lombok.*;

import java.time.LocalDate;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmpleadoDTO extends MasterDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
    private Integer dni;
    private DomicilioDTO domicilio;
    private ImagenUsuarioDTO imagenEmpleado;
    private Rol rolEmpleado;
    private UsuarioDTO usuarioEmpleado;
    private Boolean eliminado;
}

