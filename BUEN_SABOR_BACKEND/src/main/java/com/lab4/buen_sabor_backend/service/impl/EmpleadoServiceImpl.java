package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Empleado;
import com.lab4.buen_sabor_backend.model.enums.Rol;
import com.lab4.buen_sabor_backend.repository.EmpleadoRepository;
import com.lab4.buen_sabor_backend.service.EmpleadoService;
import com.lab4.buen_sabor_backend.service.impl.specification.EmpleadoSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoServiceImpl extends MasterServiceImpl<Empleado, Long> implements EmpleadoService {
    private final EmpleadoRepository empleadoRepository;

    @Autowired
    public EmpleadoServiceImpl(EmpleadoRepository empleadoRepository) {
        super(empleadoRepository);
        this.empleadoRepository = empleadoRepository;
    }

    @Override
    public Optional<Empleado> findByUsuarioId(Long usuarioId) {
        return empleadoRepository.findByUsuarioId(usuarioId);
    }

    @Override
    public Page<Empleado> buscarEmpleadosFiltrados(
            String nombre, // Ahora este parámetro funciona como búsqueda general
            String email,  // Puedes mantenerlo para compatibilidad pero no se usará
            String rol,
            Long idSucursal,
            Boolean eliminado,
            Pageable pageable
    ) {
        Specification<Empleado> spec = Specification
                .where(EmpleadoSpecification.nombreContains(nombre)) // Busca en nombre, apellido y email
                // .and(EmpleadoSpecification.emailContains(email)) // Comentar esta línea
                .and(EmpleadoSpecification.rolEquals(rol))
                .and(EmpleadoSpecification.sucursalIdEquals(idSucursal))
                .and(EmpleadoSpecification.eliminadoEquals(eliminado));

        return empleadoRepository.findAll(spec, pageable);
    }

    @Override
    public List<Empleado> findBySucursalIdAndRol(Long sucursalId, Rol rol) {
        return empleadoRepository.findBySucursalIdAndRol(sucursalId, rol);
    }

}