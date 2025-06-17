package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloDTO;
import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.dto.CategoriaDTO;
import com.lab4.buen_sabor_backend.mapper.CategoriaMapper;
import com.lab4.buen_sabor_backend.model.Articulo;
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
    private final CategoriaMapper categoriaMapper;
    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService CategoriaService, CategoriaMapper categoriaMapper, CategoriaService categoriaService) {
        super(CategoriaService);
        this.CategoriaService = CategoriaService;
        this.categoriaMapper = categoriaMapper;
        this.categoriaService = categoriaService;
    }
    @Override
    protected Categoria toEntity(CategoriaDTO dto) {
        return categoriaMapper.toEntity(dto);
    }

    @Override
    protected CategoriaDTO toDTO(Categoria entity) {
        return categoriaMapper.toDTO(entity);
    }

    @GetMapping("/hijas")
    public ResponseEntity<List<CategoriaDTO>> buscarHijas() {
        logger.info("Buscando categorias hijas");
        List<CategoriaDTO> categorias = categoriaService.findAllByCategoriaPadreNotNull()
                .stream()
                .map(categoriaMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<CategoriaDTO>> buscarPorDenominacion(@RequestParam String denominacion) {
        logger.info("Buscando articulos que contengan: {}", denominacion);
        List<Categoria> categorias = categoriaService.findByDenominacionAndEliminadoFalse(denominacion);
        List<CategoriaDTO> categoriasDTO = categoriaMapper.toDTOsList(categorias);
        return ResponseEntity.ok(categoriasDTO);
    }
}