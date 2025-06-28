package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PromocionDTO;
import com.lab4.buen_sabor_backend.mapper.PromocionMapper;
import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.enums.TipoPromocion;
import com.lab4.buen_sabor_backend.service.PromocionService;
import com.lab4.buen_sabor_backend.service.SucursalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;


@RestController
@RequestMapping("/api/promocion")
@CrossOrigin(origins = "*")
@Tag(name = "Promoción", description = "Gestión de promociones")
public class PromocionController extends MasterControllerImpl<Promocion, PromocionDTO, Long> implements MasterController<PromocionDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(PromocionController.class);

    private final PromocionService promocionService;
    private final PromocionMapper promocionMapper;

    @Autowired
    public PromocionController(PromocionService promocionService, SucursalService sucrusalService, PromocionMapper promocionMapper) {
        super(promocionService);
        this.promocionService = promocionService;
        this.promocionMapper = promocionMapper;
    }

    @Override
    protected Promocion toEntity(PromocionDTO dto) {
        return promocionMapper.toEntity(dto);
    }

    @Override
    protected PromocionDTO toDTO(Promocion entity) {
        return promocionMapper.toDTO(entity);
    }

    @Operation(summary = "Filtrar promociones por múltiples criterios")
    @ApiResponse(responseCode = "200", description = "Promociones filtradas correctamente")
    @GetMapping("/filtradas")
    public ResponseEntity<Page<PromocionDTO>> obtenerPromocionesFiltradas(
            @RequestParam(required = false) String denominacion,
            @RequestParam(required = false) TipoPromocion tipoPromocion,
            @RequestParam(required = false) Boolean activa,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaHoraDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime fechaHoraHasta,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @PageableDefault(sort = "denominacion", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        Page<Promocion> promociones = promocionService.buscarPromocionesFiltradas(
                denominacion, tipoPromocion, activa, fechaHoraDesde, fechaHoraHasta, precioMin, precioMax, pageable
        );

        Page<PromocionDTO> result = promociones.map(promocionMapper::toDTO);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Verificar si hay stock suficiente para la promoción")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock verificado exitosamente"),
            @ApiResponse(responseCode = "500", description = "Error al verificar stock")
    })
    @PostMapping("/verificar-stock/{cantidad}/{sucursalId}")
    public ResponseEntity<?> verificarStockPromocion(@RequestBody Promocion promocion,@PathVariable int cantidad, @PathVariable Long sucursalId) {
        try {
            boolean resultado = promocionService.verificarStockPromocion(promocion,cantidad, sucursalId);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            logger.error("Error en controlador: ", e);
            return ResponseEntity.ok(false); // Devuelve false en caso de error
        }
    }
}
