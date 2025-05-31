package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.dto.CategoriaDTO;
import com.lab4.buen_sabor_backend.mapper.CategoriaMapper;
import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categoria")
@CrossOrigin(origins = "*")
public class CategoriaController extends MasterControllerImpl<Categoria, CategoriaDTO, Long> implements MasterController<CategoriaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(CategoriaController.class);

    private final CategoriaService CategoriaService;
    private final CategoriaMapper CategoriaMapper;
    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService CategoriaService, CategoriaMapper CategoriaMapper, CategoriaService categoriaService) {
        super(CategoriaService);
        this.CategoriaService = CategoriaService;
        this.CategoriaMapper = CategoriaMapper;
        this.categoriaService = categoriaService;
    }
    @Override
    protected Categoria toEntity(CategoriaDTO dto) {
        return CategoriaMapper.toEntity(dto);
    }

    @Override
    protected CategoriaDTO toDTO(Categoria entity) {
        return CategoriaMapper.toDTO(entity);
    }

    @GetMapping("/hijas")
    public ResponseEntity<List<CategoriaDTO>> buscarHijas() {
        logger.info("Buscando categorias hijas");
        List<CategoriaDTO> categorias = categoriaService.findAllByCategoriaPadreNotNull()
                .stream()
                .map(CategoriaMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }
}