package com.lab4.buen_sabor_backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;

public interface MasterController<DTO, ID extends Serializable> {

    @Operation(summary = "Crear una nueva entidad")
    @ApiResponse(responseCode = "201", description = "Entidad creada exitosamente")
    @PostMapping
    ResponseEntity<DTO> create(@RequestBody DTO dto);

    @Operation(summary = "Obtener entidad por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Entidad encontrada"),
            @ApiResponse(responseCode = "404", description = "Entidad no encontrada")
    })
    @GetMapping("/{id:[0-9]+}")
    ResponseEntity<DTO> getById(@PathVariable ID id);

    @Operation(summary = "Obtener todas las entidades")
    @ApiResponse(responseCode = "200", description = "Listado de entidades obtenido exitosamente")
    @GetMapping
    ResponseEntity<List<DTO>> getAll();

    @Operation(summary = "Obtener entidades paginadas")
    @ApiResponse(responseCode = "200", description = "Página de entidades obtenida exitosamente")
    @GetMapping("/page")
    ResponseEntity<Page<DTO>> getAll(Pageable pageable);

    @Operation(summary = "Obtener entidades no eliminadas")
    @ApiResponse(responseCode = "200", description = "Listado de entidades no eliminadas obtenido exitosamente")
    @GetMapping("/noEliminado")
    ResponseEntity<List<DTO>> getAllEliminadoFalse();

    @Operation(summary = "Obtener entidades no eliminadas (paginado)")
    @ApiResponse(responseCode = "200", description = "Página de entidades no eliminadas obtenida exitosamente")
    @GetMapping("/page/noEliminado")
    ResponseEntity<Page<DTO>> getAllEliminadoFalse(Pageable pageable);

    @Operation(summary = "Actualizar entidad por ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Entidad actualizada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Entidad no encontrada")
    })
    @PutMapping("/{id}")
    ResponseEntity<DTO> update(@PathVariable ID id, @RequestBody DTO dto);

    @Operation(summary = "Reactivar entidad lógica (dar de alta)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Entidad reactivada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Entidad no encontrada")
    })
    @PutMapping("/darAlta/{id}")
    ResponseEntity<Void> changeEliminado(@PathVariable ID id);

    @Operation(summary = "Eliminar entidad por ID (borrado lógico o físico)")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Entidad eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Entidad no encontrada")
    })
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable ID id);
}
