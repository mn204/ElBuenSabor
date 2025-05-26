package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.Empresa;
import com.lab4.buen_sabor_backend.repository.EmpresaRepository;
import com.lab4.buen_sabor_backend.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpresaServiceImpl extends MasterServiceImpl<Empresa, Long> implements EmpresaService {

    @Autowired
    public EmpresaServiceImpl(EmpresaRepository empresaRepository) {
        super(empresaRepository);
    }

}