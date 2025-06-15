package com.lab4.buen_sabor_backend.repository;

import com.lab4.buen_sabor_backend.dto.UnidadMedidaDTO;
import com.lab4.buen_sabor_backend.model.UnidadMedida;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface UnidadMedidaRepository extends MasterRepository<UnidadMedida, Long> {

}