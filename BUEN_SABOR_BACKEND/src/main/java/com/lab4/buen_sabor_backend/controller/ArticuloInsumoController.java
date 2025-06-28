package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloInsumoDTO;
import com.lab4.buen_sabor_backend.mapper.ArticuloInsumoMapper;
import com.lab4.buen_sabor_backend.model.ArticuloInsumo;
import com.lab4.buen_sabor_backend.service.ArticuloInsumoService;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulo")
@CrossOrigin(origins = "*")
@Tag(name = "Artículos Insumo", description = "Gestión de artículos insumo y operaciones relacionadas")
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

    @Operation(summary = "Realizar baja lógica de un artículo insumo por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Baja lógica realizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Artículo insumo no encontrado")
    })
    @DeleteMapping("/baja-logica/{id}")
    public ResponseEntity<Void> bajaLogica(
            @Parameter(description = "ID del artículo insumo a dar de baja lógicamente") @PathVariable Long id) {
        articuloInsumoService.bajaLogica(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Realizar alta lógica de un artículo insumo por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Alta lógica realizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Artículo insumo no encontrado")
    })
    @PutMapping("/alta-logica/{id}")
    public ResponseEntity<Void> altaLogica(
            @Parameter(description = "ID del artículo insumo a dar de alta lógicamente") @PathVariable Long id) {
        articuloInsumoService.altaLogica(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Filtrar artículos insumo con múltiples parámetros y paginación")
    @GetMapping("/filtrados")
    public ResponseEntity<Page<ArticuloInsumoDTO>> filtrarArticuloInsumos(
            @Parameter(description = "Denominación para filtrar") @RequestParam(required = false) String denominacion,
            @Parameter(description = "ID de categoría para filtrar") @RequestParam(required = false) Long categoriaId,
            @Parameter(description = "ID de unidad de medida para filtrar") @RequestParam(required = false) Long unidadMedidaId,
            @Parameter(description = "Filtrar por estado eliminado") @RequestParam(required = false) Boolean eliminado,
            @Parameter(description = "Precio mínimo de compra") @RequestParam(required = false) Double precioCompraMin,
            @Parameter(description = "Precio máximo de compra") @RequestParam(required = false) Double precioCompraMax,
            @Parameter(description = "Precio mínimo de venta") @RequestParam(required = false) Double precioVentaMin,
            @Parameter(description = "Precio máximo de venta") @RequestParam(required = false) Double precioVentaMax,
            @PageableDefault(sort = "denominacion", direction = Sort.Direction.ASC) Pageable pageable) {

        Page<ArticuloInsumo> insumos = articuloInsumoService.filtrar(denominacion, categoriaId, unidadMedidaId, eliminado,
                precioCompraMin, precioCompraMax, precioVentaMin, precioVentaMax, pageable);
        return ResponseEntity.ok(insumos.map(articuloInsumoMapper::toDTO));
    }

    @Operation(summary = "Obtener todos los ingredientes con información completa para la grilla")
    @GetMapping("/grilla")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerGrillaIngredientes() {
        logger.info("Obteniendo grilla de ingredientes");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.getAll();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Obtener todos los artículos no eliminados")
    @GetMapping("/noEliminados")
    public ResponseEntity<List<ArticuloInsumoDTO>> getAllElimanodFalse() {
        logger.info("Obteniendo artículos no eliminados");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.getAll();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Obtener ingredientes activos ordenados por denominación")
    @GetMapping("/activos")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerIngredientesActivos() {
        logger.info("Obteniendo ingredientes activos");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllActivosOrdenados();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Buscar ingredientes por denominación")
    @GetMapping("/buscar")
    public ResponseEntity<List<ArticuloInsumoDTO>> buscarPorDenominacion(
            @Parameter(description = "Texto para buscar en denominación") @RequestParam String denominacion) {
        logger.info("Buscando ingredientes que contengan: {}", denominacion);
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findByDenominacionContaining(denominacion);
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Obtener ingredientes para elaborar")
    @GetMapping("/para-elaborar")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerParaElaborar() {
        logger.info("Obteniendo ingredientes para elaborar");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllEsParaElaborar();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Obtener ingredientes no para elaborar")
    @GetMapping("/no-para-elaborar")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerNoParaElaborar() {
        logger.info("Obteniendo ingredientes no para elaborar");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllNoEsParaElaborar();
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Obtener ingredientes no para elaborar filtrados por denominación")
    @GetMapping("/no-para-elaborar/denominacion")
    public ResponseEntity<List<ArticuloInsumoDTO>> obtenerNoParaElaborarDenominacion(
            @Parameter(description = "Denominación para filtrar") @RequestParam String denominacion) {
        logger.info("Obteniendo ingredientes no para elaborar por denominación");
        List<ArticuloInsumo> ingredientes = articuloInsumoService.findAllNoEsParaElaborarByDenominacion(denominacion);
        List<ArticuloInsumoDTO> ingredientesDTO = articuloInsumoMapper.toDTOsList(ingredientes);
        return ResponseEntity.ok(ingredientesDTO);
    }

    @Operation(summary = "Verificar si existe un ingrediente con una denominación dada")
    @GetMapping("/existe-denominacion")
    public ResponseEntity<Boolean> existeDenominacion(
            @Parameter(description = "Denominación a verificar") @RequestParam String denominacion) {
        logger.info("Verificando existencia de ingrediente con denominación: {}", denominacion);
        boolean existe = articuloInsumoService.existsByDenominacion(denominacion);
        return ResponseEntity.ok(existe);
    }

    @Override
    @Operation(summary = "Crear un nuevo artículo insumo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Artículo insumo creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Denominación ya existe o solicitud inválida")
    })
    public ResponseEntity<ArticuloInsumoDTO> create(
            @Parameter(description = "Datos del artículo insumo a crear") @RequestBody ArticuloInsumoDTO dto) {
        logger.info("Creando nuevo ingrediente: {}", dto.getDenominacion());

        if (articuloInsumoService.existsByDenominacion(dto.getDenominacion())) {
            logger.warn("Intento de crear ingrediente duplicado: {}", dto.getDenominacion());
            return ResponseEntity.badRequest().build();
        }

        return super.create(dto);
    }

    @Override
    @Operation(summary = "Actualizar un artículo insumo existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Artículo insumo actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Artículo insumo no encontrado")
    })
    public ResponseEntity<ArticuloInsumoDTO> update(
            @Parameter(description = "ID del artículo insumo a actualizar") @PathVariable Long id,
            @Parameter(description = "Datos actualizados del artículo insumo") @RequestBody ArticuloInsumoDTO dto) {
        logger.info("Actualizando ingrediente id: {} con denominación: {}", id, dto.getDenominacion());
        return super.update(id, dto);
    }
}
