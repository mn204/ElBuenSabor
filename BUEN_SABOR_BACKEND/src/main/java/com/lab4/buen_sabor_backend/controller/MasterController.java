package com.lab4.buen_sabor_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;

public interface MasterController<DTO, ID extends Serializable> {

    @PostMapping
    ResponseEntity<DTO> create(@RequestBody DTO dto);

    @GetMapping("/{id}")
    ResponseEntity<DTO> getById(@PathVariable ID id);

    @GetMapping
    ResponseEntity<List<DTO>> getAll();

    @GetMapping("/page")
    ResponseEntity<Page<DTO>> getAll(Pageable pageable);

    @GetMapping("/noEliminado")
    ResponseEntity<List<DTO>> getAllEliminadoFalse();

    @GetMapping("/page/noEliminado")
    ResponseEntity<Page<DTO>> getAllEliminadoFalse(Pageable pageable);

    @PutMapping("/{id}")
    ResponseEntity<DTO> update(@PathVariable ID id, @RequestBody DTO dto);

    @PutMapping("/darAlta/{id}")
    ResponseEntity<Void> changeEliminado(@PathVariable ID id);

    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable ID id);
}
