package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.EmpleadoDTO;
import com.lab4.buen_sabor_backend.mapper.EmpleadoMapper;
import com.lab4.buen_sabor_backend.model.Cliente;
import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import com.lab4.buen_sabor_backend.repository.EmpleadoRepository;
import com.lab4.buen_sabor_backend.service.EmpleadoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

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


    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<EmpleadoDTO> getByUsuarioId(@PathVariable Long usuarioId) {
        return empleadoService.findByUsuarioId(usuarioId)
                .map(empleado -> ResponseEntity.ok(empleadoMapper.toDTO(empleado)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sucursal/{sucursalId}/rol/{rol}")
    public ResponseEntity<List<EmpleadoDTO>> getBySucursalAndRol(@PathVariable Long sucursalId, @PathVariable Rol rol) {
        List<Empleado> empleados = empleadoService.findBySucursalIdAndRol(sucursalId, rol);
        List<EmpleadoDTO> empleadosDTO = empleados.stream()
                .map(empleadoMapper::toDTO)
                .toList();
        return ResponseEntity.ok(empleadosDTO);
    }

    @GetMapping("/filtrados")
    public ResponseEntity<Page<EmpleadoDTO>> obtenerEmpleadosFiltrados(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String rol,
            @RequestParam(required = false) Long idSucursal,
            @RequestParam(required = false) String ordenar, // "asc" o "desc"
            @RequestParam(required = false) Boolean eliminado, // QUITAR defaultValue
            Pageable pageable
    ) {
        // Si se especifica ordenamiento, creamos un Sort personalizado
        Sort sort = Sort.unsorted();
        if (ordenar != null) {
            if ("desc".equalsIgnoreCase(ordenar) || "z-a".equalsIgnoreCase(ordenar)) {
                sort = Sort.by(Sort.Direction.DESC, "nombre");
            } else if ("asc".equalsIgnoreCase(ordenar) || "a-z".equalsIgnoreCase(ordenar)) {
                sort = Sort.by(Sort.Direction.ASC, "nombre");
            }
            // Crear nuevo Pageable con el ordenamiento
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        }

        Page<Empleado> empleados = empleadoService.buscarEmpleadosFiltrados(
                nombre, email, rol, idSucursal, eliminado, pageable
        );
        Page<EmpleadoDTO> result = empleados.map(empleadoMapper::toDTO);

        return ResponseEntity.ok(result);
    }

}
