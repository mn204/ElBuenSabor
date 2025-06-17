package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.ArticuloDTO;
import com.lab4.buen_sabor_backend.mapper.ArticuloMapper;
import com.lab4.buen_sabor_backend.model.Articulo;
import com.lab4.buen_sabor_backend.model.Categoria;
import com.lab4.buen_sabor_backend.service.ArticuloService;
import com.lab4.buen_sabor_backend.service.CategoriaService;
import com.mercadopago.net.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articulo-insumos")
@CrossOrigin(origins = "*")
public class ArticuloController extends MasterControllerImpl<Articulo, ArticuloDTO, Long> implements MasterController<ArticuloDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(ArticuloController.class);

    private final ArticuloService articuloService;
    private final CategoriaService categoriaService;
    private final ArticuloMapper articuloMapper;

    @Autowired
    protected ArticuloController(ArticuloService articuloService, CategoriaService categoriaService, ArticuloMapper articuloMapper) {
        super(articuloService);
        this.articuloService = articuloService;
        this.categoriaService = categoriaService;
        this.articuloMapper = articuloMapper;
    }

    @Override
    protected Articulo toEntity(ArticuloDTO dto) {
        return null;
    }

    @Override
    protected ArticuloDTO toDTO(Articulo entity) {
        return null;
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ArticuloDTO>> buscarPorDenominacion(@RequestParam String denominacion) {
        logger.info("Buscando articulos que contengan: {}", denominacion);
        List<Articulo> articulos = articuloService.findByDenominacionAndEliminadoFalse(denominacion);
        List<ArticuloDTO> articulosDTO = articuloMapper.toDTOsList(articulos);
        return ResponseEntity.ok(articulosDTO);
    }

    @PostMapping("/verificar-stock/{id}")
    public ResponseEntity<?> verificarStockPedido(@RequestBody Articulo articulo,@PathVariable Long id) {
        try {
            boolean resultado = articuloService.verificarStockArticulo(articulo, id);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.error("Error en controlador: ", e);
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<ArticuloDTO>> buscarPorCategoria(@PathVariable Long id) {
        try {
            Categoria categoria = categoriaService.getById(id);
            List<Articulo> articulos = articuloService.findArticuloByCategoriaId(id);
            List<ArticuloDTO> articulosDTO = articuloMapper.toDTOsList(articulos);
            return ResponseEntity.ok(articulosDTO);
        } catch (Exception e) {
            logger.error("Error en controlador: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
