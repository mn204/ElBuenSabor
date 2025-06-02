package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.EmpleadoDTO;
import com.lab4.buen_sabor_backend.mapper.EmpleadoMapper;
import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.service.EmpleadoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/empleado")
@CrossOrigin(origins = "*")
public class EmpleadoController extends MasterControllerImpl<Empleado, EmpleadoDTO, Long> implements MasterController<EmpleadoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(EmpleadoController.class);

    private final EmpleadoService empleadoService;
    private final EmpleadoMapper empleadoMapper;

    @Autowired
    public EmpleadoController(EmpleadoService empleadoService, EmpleadoMapper empleadoMapper) {
        super(empleadoService);
        this.empleadoService = empleadoService;
        this.empleadoMapper = empleadoMapper;
    }

    @Override
    protected Empleado toEntity(EmpleadoDTO dto) {
        return empleadoMapper.toEntity(dto);
    }

    @Override
    protected EmpleadoDTO toDTO(Empleado entity) {
        return empleadoMapper.toDTO(entity);
    }
}
