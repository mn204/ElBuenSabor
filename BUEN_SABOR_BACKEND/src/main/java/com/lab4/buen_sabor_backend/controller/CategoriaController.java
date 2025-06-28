package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.CategoriaDTO;
import com.lab4.buen_sabor_backend.mapper.CategoriaMapper;
import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Categorías", description = "Operaciones relacionadas con categorías")
public class CategoriaController extends MasterControllerImpl<Categoria, CategoriaDTO, Long> implements MasterController<CategoriaDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(CategoriaController.class);

    private final CategoriaService categoriaService;
    private final CategoriaMapper categoriaMapper;

    @Autowired
    public CategoriaController(CategoriaService categoriaService, CategoriaMapper categoriaMapper) {
        super(categoriaService);
        this.categoriaService = categoriaService;
        this.categoriaMapper = categoriaMapper;
    }

    @Override
    protected Categoria toEntity(CategoriaDTO dto) {
        return categoriaMapper.toEntity(dto);
    }

    @Override
    protected CategoriaDTO toDTO(Categoria entity) {
        return categoriaMapper.toDTO(entity);
    }

    @Operation(summary = "Obtener categorías hijas (categorías con padre)")
    @GetMapping("/hijas")
    public ResponseEntity<List<CategoriaDTO>> buscarHijas() {
        logger.info("Buscando categorias hijas");
        List<CategoriaDTO> categorias = categoriaService.findAllByCategoriaPadreNotNull()
                .stream()
                .map(categoriaMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categorias);
    }

    @Operation(summary = "Buscar categorías por denominación no eliminadas")
    @GetMapping("/buscar")
    public ResponseEntity<List<CategoriaDTO>> buscarPorDenominacion(
            @Parameter(description = "Denominación para búsqueda") @RequestParam String denominacion) {
        logger.info("Buscando categorías que contengan: {}", denominacion);
        List<Categoria> categorias = categoriaService.findByDenominacionAndEliminadoFalse(denominacion);
        List<CategoriaDTO> categoriasDTO = categoriaMapper.toDTOsList(categorias);
        return ResponseEntity.ok(categoriasDTO);
    }
}
