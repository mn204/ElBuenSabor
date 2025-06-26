package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloManufacturadoDTO;
import com.lab4.buen_sabor_backend.mapper.ArticuloManufacturadoMapper;
import com.lab4.buen_sabor_backend.model.ArticuloManufacturado;
import com.lab4.buen_sabor_backend.service.ArticuloManufacturadoService;
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

    @GetMapping("/filtrados")
    public ResponseEntity<Page<ArticuloManufacturadoDTO>> filtrarArticulos(
            @RequestParam(required = false) String denominacion,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean eliminado,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @PageableDefault(sort = "denominacion", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<ArticuloManufacturado> articulos = articuloManufacturadoService.filtrarArticulosManufacturados(denominacion, categoriaId, eliminado, precioMin, precioMax, pageable);
        Page<ArticuloManufacturadoDTO> dtoPage = articulos.map(articuloManufacturadoMapper::toDTO);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/buscar/denominacion")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorDenominacion(@RequestParam String denominacion) {
        logger.info("Buscando productos por denominación: {}", denominacion);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByDenominacion(denominacion)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar/categoria/{categoriaId}")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorCategoria(@PathVariable Long categoriaId) {
        logger.info("Buscando productos por categoría ID: {}", categoriaId);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByCategoria(categoriaId)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar/precio")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorRangoPrecio(
            @RequestParam Double precioMin,
            @RequestParam Double precioMax) {
        logger.info("Buscando productos por rango de precio: {} - {}", precioMin, precioMax);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByRangoPrecio(precioMin, precioMax)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar/tiempo/{tiempoMaximo}")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> buscarPorTiempoMaximo(@PathVariable Integer tiempoMaximo) {
        logger.info("Buscando productos por tiempo máximo: {} minutos", tiempoMaximo);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByTiempoMaximo(tiempoMaximo)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/con-ingredientes")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> obtenerConIngredientes() {
        logger.info("Obteniendo productos con ingredientes");
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findAllWithIngredientes()
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/categoria/{categoriaId}/con-ingredientes")
    public ResponseEntity<List<ArticuloManufacturadoDTO>> obtenerPorCategoriaConIngredientes(@PathVariable Long categoriaId) {
        logger.info("Obteniendo productos por categoría {} con ingredientes", categoriaId);
        List<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findByCategoriaWithIngredientes(categoriaId)
                .stream()
                .map(articuloManufacturadoMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(productos);
    }

    @PostMapping("/calcular-costo")
    public ResponseEntity<Double> calcularCostoTotal(@RequestBody ArticuloManufacturadoDTO productoDTO) {
        logger.info("Calculando costo total para producto: {}", productoDTO.getDenominacion());
        ArticuloManufacturado producto = articuloManufacturadoMapper.toEntity(productoDTO);
        Double costoTotal = articuloManufacturadoService.calcularCostoTotal(producto);
        return ResponseEntity.ok(costoTotal);
    }

    @GetMapping("/activos-ordenados")
    public ResponseEntity<Page<ArticuloManufacturadoDTO>> obtenerActivosOrdenados(Pageable pageable) {
        logger.info("Obteniendo productos activos ordenados con paginación");
        Page<ArticuloManufacturadoDTO> productos = articuloManufacturadoService.findActivosOrdenados(pageable)
                .map(articuloManufacturadoMapper::toDTO);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/existe/{denominacion}")
    public ResponseEntity<Boolean> existePorDenominacion(@PathVariable String denominacion) {
        boolean existe = articuloManufacturadoService.existeByDenominacion(denominacion);
        return ResponseEntity.ok(existe);
    }
}
