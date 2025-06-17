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
import org.springframework.data.domain.Pageable;
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

    /**
     * Obtiene ingredientes por categoría/rubro
     */
    /*
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerPorCategoria(@PathVariable Long categoriaId) {
        logger.info("Obteniendo ingredientes de la categoría id: {}", categoriaId);
        Categoria categoria = categoriaService.getById(categoriaId);
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findByCategoria(categoria);
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }
    */

    /**
     * Obtiene ingredientes que son para elaborar
     */
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

    /**
     * Cambia el estado de alta/baja de un ingrediente
     */
    /*
    @PatchMapping("/{id}/estado-alta")
    public ResponseEntity<ArticuloInsumoDTO> cambiarEstadoAlta(@PathVariable Long id,
                                                               @RequestBody Map<String, Boolean> request) {
        logger.info("Cambiando estado de alta para ingrediente id: {}", id);
        Boolean alta = request.get("alta");
        if (alta == null) {
            return ResponseEntity.badRequest().build();
        }

        ArticuloInsumo actualizado = articuloInsumoService.cambiarEstadoAlta(id, alta);
        ArticuloInsumoDTO dto = articuloInsumoMapper.toDTO(actualizado);
        return ResponseEntity.ok(dto);
    }
    */


    /**
     * Obtiene la receta completa de un ingrediente (con sucursales y existencias)
     *//*
    @GetMapping("/{id}/receta-completa")
    public ResponseEntity<ArticuloInsumoDTO> obtenerRecetaCompleta(@PathVariable Long id) {
        logger.info("Obteniendo receta completa para ingrediente id: {}", id);
        Optional<ArticuloInsumo> ingrediente = articuloInsumoService.obtenerRecetaCompleta(id);

        if (ingrediente.isPresent()) {
            ArticuloInsumoDTO dto = articuloInsumoMapper.toDTO(ingrediente.get());
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
*/
    /**
     * Consulta el stock actual de todos los insumos
     */
    /*
    @GetMapping("/stock")
    public ResponseEntity<List<Object[]>> consultarStockInsumos() {
        logger.info("Consultando stock de insumos");
        List<Object[]> stockInfo = articuloInsumoService.consultarStockInsumos();
        return ResponseEntity.ok(stockInfo);
    }
*/
    /**
     * Verifica si existe un ingrediente con la denominación dada
     */
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
