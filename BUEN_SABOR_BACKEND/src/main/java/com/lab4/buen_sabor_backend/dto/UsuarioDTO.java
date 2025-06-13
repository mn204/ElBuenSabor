package com.lab4.buen_sabor_backend.dto;

import com.lab4.buen_sabor_backend.model.enums.Rol;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UsuarioDTO extends MasterDTO{

    private String email;
    private String firebaseUid;
    private String dni;
    private Rol rol;
    private String providerId;
    private String photoUrl;
    private Boolean eliminado;
}
