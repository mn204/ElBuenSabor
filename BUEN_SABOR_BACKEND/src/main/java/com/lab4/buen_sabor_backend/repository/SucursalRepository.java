package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.SucursalDTO;
import com.lab4.buen_sabor_backend.model.Sucursal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface SucursalRepository extends MasterRepository<Sucursal, Long> {
}