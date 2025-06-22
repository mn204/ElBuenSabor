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
    private String telefono;
    private String dni;
    private LocalDate fechaNacimiento;
    private DomicilioDTO domicilio;
    private UsuarioDTO usuario;
    private SucursalDTO sucursal;
    private Boolean eliminado;
}

