package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloInsumoDTO;
import com.lab4.buen_sabor_backend.dto.SucursalInsumoDTO;
import com.lab4.buen_sabor_backend.mapper.ArticuloInsumoMapper;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/articulo")
@CrossOrigin(origins = "*")
public class ArticuloInsumoController extends MasterControllerImpl<ArticuloInsumo, ArticuloInsumoDTO, Long> implements MasterController<ArticuloInsumoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ArticuloInsumoController.class);

    private final ArticuloInsumoService articuloInsumoService;
    private final ArticuloInsumoMapper articuloInsumoMapper;
    private final CategoriaService categoriaService;

    @Autowired
    public ArticuloInsumoController(ArticuloInsumoService articuloInsumoService, ArticuloInsumoMapper articuloInsumoMapper, CategoriaService categoriaService) {
        super(articuloInsumoService);
        this.articuloInsumoService = articuloInsumoService;
        this.articuloInsumoMapper = articuloInsumoMapper;
        this.categoriaService = categoriaService;
    }

    @Override
    protected ArticuloInsumo toEntity(ArticuloInsumoDTO dto) {
        return articuloInsumoMapper.toEntity(dto);
    }

    @Override
    protected ArticuloInsumoDTO toDTO(ArticuloInsumo entity) {
        return articuloInsumoMapper.toDTO(entity);
    }

    @DeleteMapping("/baja-logica/{id}")
    public ResponseEntity<Void> bajaLogica(@PathVariable Long id) {
        articuloInsumoService.bajaLogica(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/alta-logica/{id}")
    public ResponseEntity<Void> altaLogica(@PathVariable Long id) {
        articuloInsumoService.altaLogica(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filtrados")
    public ResponseEntity<Page<ArticuloInsumoDTO>> filtrarArticuloInsumos(
            @RequestParam(required = false) String denominacion,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Long unidadMedidaId,
            @RequestParam(required = false) Boolean eliminado,
            @RequestParam(required = false) Double precioCompraMin,
            @RequestParam(required = false) Double precioCompraMax,
            @RequestParam(required = false) Double precioVentaMin,
            @RequestParam(required = false) Double precioVentaMax,
            @PageableDefault(sort = "denominacion", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<ArticuloInsumo> insumos = articuloInsumoService.filtrar(denominacion, categoriaId, unidadMedidaId, eliminado,
                precioCompraMin, precioCompraMax, precioVentaMin, precioVentaMax, pageable);
        return ResponseEntity.ok(insumos.map(articuloInsumoMapper::toDTO));
    }

    /**
     * Obtiene todos los ingredientes con información completa para la grilla
     */
    @GetMapping("/grilla")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerGrillaIngredientes() {
        logger.info("Obteniendo grilla de ingredientes");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.getAll();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @GetMapping("/noEliminados")
    public ResponseEntity<List<ArticuloInsumoDTO>> getAllElimanodFalse() {
        logger.info("Obteniendo grilla de ingredientes");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.getAll();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    /**
     * Obtiene ingredientes activos ordenados por denominación
     */
    @GetMapping("/activos")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerIngredientesActivos() {
        logger.info("Obteniendo ingredientes activos");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllActivosOrdenados();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    /**
     * Busca ingredientes por denominación (para filtros)
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<ArticuloInsumoDTO>> buscarPorDenominacion(@RequestParam String denominacion) {
        logger.info("Buscando ingredientes que contengan: {}", denominacion);
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findByDenominacionContaining(denominacion);
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

     // Obtiene ingredientes que son para elaborar
    @GetMapping("/para-elaborar")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerParaElaborar() {
        logger.info("Obteniendo ingredientes para elaborar");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllEsParaElaborar();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @GetMapping("/no-para-elaborar")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerNoParaElaborar() {
        logger.info("Obteniendo ingredientes para elaborar");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllNoEsParaElaborar();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @GetMapping("/no-para-elaborar/denominacion")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerNoParaElaborarDenominacion(@RequestParam String denominacion) {
        logger.info("Obteniendo ingredientes para elaborar");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllNoEsParaElaborarByDenominacion(denominacion);
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

     // Verifica si existe un ingrediente con la denominación dada
    @GetMapping("/existe-denominacion")
    public ResponseEntity<Boolean> existeDenominacion(@RequestParam String denominacion) {
        logger.info("Verificando si existe ingrediente con denominación: {}", denominacion);
        boolean existe = articuloInsumoService.existsByDenominacion(denominacion);
        return ResponseEntity.ok(existe);
    }

    // ============ OVERRIDE DE MÉTODOS HEREDADOS CON VALIDACIONES ============

    @Override
    public ResponseEntity<ArticuloInsumoDTO> create(@RequestBody ArticuloInsumoDTO dto) {
        logger.info("Creando nuevo ingrediente: {}", dto.getDenominacion());

        // Validación adicional antes de crear
        if (articuloInsumoService.existsByDenominacion(dto.getDenominacion())) {
            logger.warn("Intento de crear ingrediente duplicado: {}", dto.getDenominacion());
            return ResponseEntity.badRequest().build();
        }

        return super.create(dto);
    }

    @Override
    public ResponseEntity<ArticuloInsumoDTO> update(@PathVariable Long id, @RequestBody ArticuloInsumoDTO dto) {
        logger.info("Actualizando ingrediente id: {} con denominación: {}", id, dto.getDenominacion());
        return super.update(id, dto);
    }
}
