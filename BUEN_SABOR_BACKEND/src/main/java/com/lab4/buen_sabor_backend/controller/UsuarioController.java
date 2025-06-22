package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.UsuarioDTO;
import com.lab4.buen_sabor_backend.mapper.UsuarioMapper;
import com.lab4.buen_sabor_backend.model.Usuario;
import com.lab4.buen_sabor_backend.service.FirebaseUserService;
import com.lab4.buen_sabor_backend.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController extends MasterControllerImpl<Usuario, UsuarioDTO, Long> implements MasterController<UsuarioDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(UsuarioController.class);

    private final UsuarioService usuarioService;
    private final UsuarioMapper usuarioMapper;

    @Autowired
    public UsuarioController(UsuarioService usuarioService, UsuarioMapper usuarioMapper) {
        super(usuarioService);
        this.usuarioService = usuarioService;
        this.usuarioMapper = usuarioMapper;
    }


    @GetMapping("/firebase/{firebaseUid}")
    public ResponseEntity<UsuarioDTO> getByFirebaseUid(@PathVariable String firebaseUid) {
        return usuarioService.findByFirebaseUid(firebaseUid)
                .map(usuario -> ResponseEntity.ok(usuarioMapper.toDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> getByEmail(@PathVariable String email) {
        return usuarioService.findByEmail(email)
                .map(usuario -> ResponseEntity.ok(usuarioMapper.toDTO(usuario)))
                .orElse(ResponseEntity.notFound().build());
    }


    @Override
    protected Usuario toEntity(UsuarioDTO dto) {
        return usuarioMapper.toEntity(dto);
    }

    @Override
    protected UsuarioDTO toDTO(Usuario entity) {
        return usuarioMapper.toDTO(entity);
    }

    @Autowired
    private FirebaseUserService firebaseUserService;

    @PutMapping("/{uid}/email")
    public String actualizarEmail(
            @PathVariable String uid,
            @RequestParam String nuevoEmail
    ) {
        try {
            firebaseUserService.actualizarEmail(uid, nuevoEmail);
            return "Email actualizado correctamente en Firebase";
        } catch (Exception e) {
            return "Error al actualizar email: " + e.getMessage();
        }
    }

}
