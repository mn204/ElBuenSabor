package com.lab4.buen_sabor_backend.controller;

import com.lab4.buen_sabor_backend.dto.PromocionDTO;
import com.lab4.buen_sabor_backend.dto.SucursalDTO;
import com.lab4.buen_sabor_backend.mapper.PromocionMapper;
import com.lab4.buen_sabor_backend.mapper.SucursalMapper;
import com.lab4.buen_sabor_backend.model.Promocion;
import com.lab4.buen_sabor_backend.model.Sucursal;
import com.lab4.buen_sabor_backend.service.PromocionService;
import com.lab4.buen_sabor_backend.service.SucursalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sucursal")
@CrossOrigin(origins = "*")
@Tag(name = "Sucursal", description = "Gestión de sucursales")
public class SucursalController extends MasterControllerImpl<Sucursal, SucursalDTO, Long> implements MasterController<SucursalDTO, Long> {

    private static final Logger logger = LoggerFactory.getLogger(SucursalController.class);

    private final SucursalService sucursalService;
    private final SucursalMapper sucursalMapper;
    private final PromocionMapper promocionMapper;
    private final PromocionService promocionService;

    @Autowired
    public SucursalController(SucursalService sucursalService, SucursalMapper sucursalMapper, PromocionService promocionService, PromocionMapper promocionMapper, PromocionService promocionService1) {
        super(sucursalService);
        this.sucursalService = sucursalService;
        this.sucursalMapper = sucursalMapper;
        this.promocionMapper = promocionMapper;
        this.promocionService = promocionService1;
    }

    @Override
    protected Sucursal toEntity(SucursalDTO dto) {
        return sucursalMapper.toEntity(dto);
    }

    @Override
    protected SucursalDTO toDTO(Sucursal entity) {
        return sucursalMapper.toDTO(entity);
    }

    @Operation(summary = "Obtener promociones por sucursal")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Promociones obtenidas correctamente"),
            @ApiResponse(responseCode = "404", description = "Sucursal no encontrada")
    })
    @GetMapping("/promociones/{sucursalId}")
    public ResponseEntity<List<PromocionDTO>> findPromocionsBySucursal(@PathVariable Long sucursalId) {
        logger.info("Obteniendo promociones de la sucursal id: {}", sucursalId);
        Sucursal sucursal = sucursalService.getById(sucursalId);
        List<Promocion> promociones = promocionService.findPromocionsBySucursal(sucursal);
        List<PromocionDTO> promocionesDTO = promocionMapper.toDTOsList(promociones);
        return ResponseEntity.ok(promocionesDTO);
    }

}
