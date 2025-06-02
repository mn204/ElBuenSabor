package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.UsuarioDTO;
import com.lab4.buen_sabor_backend.mapper.UsuarioMapper;
import com.lab4.buen_sabor_backend.model.Usuario;
import com.lab4.buen_sabor_backend.service.UsuarioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @Override
    protected Usuario toEntity(UsuarioDTO dto) {
        return usuarioMapper.toEntity(dto);
    }

    @Override
    protected UsuarioDTO toDTO(Usuario entity) {
        return usuarioMapper.toDTO(entity);
    }
}
