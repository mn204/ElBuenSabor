package com.lab4.buen_sabor_backend.service.impl;

import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.repository.ArticuloInsumoRepository;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArticuloInsumoServiceImpl extends MasterServiceImpl<ArticuloInsumo, Long> implements ArticuloInsumoService {

    @Autowired
    public ArticuloInsumoServiceImpl(ArticuloInsumoRepository articuloInsumoRespository) {
        super(articuloInsumoRespository);
    }


}