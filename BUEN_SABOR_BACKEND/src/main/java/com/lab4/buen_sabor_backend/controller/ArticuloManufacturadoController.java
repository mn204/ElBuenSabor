package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.mapper.ArticuloManufacturadoMapper;
import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
@Tag(name = "Artículos Manufacturados", description = "Operaciones relacionadas con productos manufacturados")
public class ArticuloManufacturadoController extends MasterControllerImpl<ArticuloManufacturado, ArticuloManufacturadoDTO, Long> implements MasterController<ArticuloManufacturadoDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ArticuloManufacturadoController.class);

    private final ArticuloManufacturadoService articuloManufacturadoService;
    private final ArticuloManufacturadoMapper articuloManufacturadoMapper;

    @Autowired
    public ArticuloManufacturadoController(ArticuloManufacturadoService articuloManufacturadoService,
                                           ArticuloManufacturadoMapper articuloManufacturadoMapper) {
        super(articuloManufacturadoService);
        this.articuloManufacturadoService = articuloManufacturadoService;
        this.articuloManufacturadoMapper = articuloManufacturadoMapper;
    }

    @Override
    protected ArticuloManufacturado toEntity(ArticuloManufacturadoDTO dto) {
        return articuloManufacturadoMapper.toEntity(dto);
    }

    @Override
    protected ArticuloManufacturadoDTO toDTO(ArticuloManufacturado entity) {
        return articuloManufacturadoMapper.toDTO(entity);
    }

    @Operation(summary = "Filtrar productos manufacturados con varios parámetros y paginación")
    @GetMapping("/filtrados")
    public ResponseEntity<Page<ArticuloManufacturadoDTO>> filtrarArticulos(
            @Parameter(description = "Denominación para filtrar") @RequestParam(required = false) String denominacion,
            @Parameter(description = "ID de categoría para filtrar") @RequestParam(required = false) Long categoriaId,
            @Parameter(description = "Filtrar por estado eliminado") @RequestParam(required = false) Boolean eliminado,
            @Parameter(description = "Precio mínimo") @RequestParam(required = false) Double precioMin,
            @Parameter(description = "Precio máximo") @RequestParam(required = false) Double precioMax,
            @PageableDefault(sort = "denominacion", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<ArticuloManufacturado> articulos = articuloManufacturadoService.filtrarArticulosManufacturados(denominacion, categoriaId, eliminado, precioMin, precioMax, pageable);
        Page<ArticuloManufacturadoDTO> dtoPage = articulos.map(articuloManufacturadoMapper::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @Operation(summary = "Buscar productos por denominación")
    @GetMapping("/buscar/denominacion")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorDenominacion(
            @Parameter(description = "Denominación para búsqueda") @RequestParam String denominacion) {
        logger.info("Buscando productos por denominación: {}", denominacion);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByDenominacion(denominacion)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Buscar productos por categoría")
    @GetMapping("/buscar/categoria/{categoriaId}")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorCategoria(
            @Parameter(description = "ID de categoría para búsqueda") @PathVariable Long categoriaId) {
        logger.info("Buscando productos por categoría ID: {}", categoriaId);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByCategoria(categoriaId)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Buscar productos por rango de precio")
    @GetMapping("/buscar/precio")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorRangoPrecio(
            @Parameter(description = "Precio mínimo") @RequestParam Double precioMin,
            @Parameter(description = "Precio máximo") @RequestParam Double precioMax) {
        logger.info("Buscando productos por rango de precio: {} - {}", precioMin, precioMax);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByRangoPrecio(precioMin, precioMax)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Buscar productos por tiempo máximo de elaboración")
    @GetMapping("/buscar/tiempo/{tiempoMaximo}")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorTiempoMaximo(
            @Parameter(description = "Tiempo máximo en minutos") @PathVariable Integer tiempoMaximo) {
        logger.info("Buscando productos por tiempo máximo: {} minutos", tiempoMaximo);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByTiempoMaximo(tiempoMaximo)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Obtener todos los productos con sus ingredientes")
    @GetMapping("/con-ingredientes")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> obtenerConIngredientes() {
        logger.info("Obteniendo productos con ingredientes");
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findAllWithIngredientes()
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Obtener productos por categoría con sus ingredientes")
    @GetMapping("/categoria/{categoriaId}/con-ingredientes")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> obtenerPorCategoriaConIngredientes(
            @Parameter(description = "ID de categoría") @PathVariable Long categoriaId) {
        logger.info("Obteniendo productos por categoría {} con ingredientes", categoriaId);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByCategoriaWithIngredientes(categoriaId)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Calcular el costo total de un producto manufacturado")
    @PostMapping("/calcular-costo")
    public ResponseEntity<Double> calcularCostoTotal(
            @Parameter(description = "Datos del producto manufacturado") @RequestBody ArticuloManufacturadoDTO productoDTO) {
        logger.info("Calculando costo total para producto: {}", productoDTO.getDenominacion());
        ArticuloManufacturado producto = articuloManufacturadoMapper.toEntity(productoDTO);
        Double costoTotal = articuloManufacturadoService.calcularCostoTotal(producto);
        return ResponseEntity.ok(costoTotal);
    }

    @Operation(summary = "Obtener productos activos ordenados con paginación")
    @GetMapping("/activos-ordenados")
    public ResponseEntity<Page<ArticuloManufacturadoDTO>> obtenerActivosOrdenados(
            Pageable pageable) {
        logger.info("Obteniendo productos activos ordenados con paginación");
        Page<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findActivosOrdenados(pageable)
                .map(articuloManufacturadoMapper::toDTO);
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Verificar existencia de un producto por denominación")
    @GetMapping("/existe/{denominacion}")
    public ResponseEntity<Boolean> existePorDenominacion(
            @Parameter(description = "Denominación del producto a verificar") @PathVariable String denominacion) {
        boolean existe = articuloManufacturadoService.existeByDenominacion(denominacion);
        return ResponseEntity.ok(existe);
    }
}
