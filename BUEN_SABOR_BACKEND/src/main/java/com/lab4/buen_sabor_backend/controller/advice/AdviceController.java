package com.lab4.buen_sabor_backend.controller.advice;

import com.lab4.buen_sabor_backend.dto.ErrorDTO;
import com.lab4.buen_sabor_backend.exceptions.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@ControllerAdvice
public class AdviceController {

    private static final Logger logger = LoggerFactory.getLogger(AdviceController.class);

    // Manejo de entidades no encontradas
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorDTO> handleNotFound(EntityNotFoundException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.NOT_FOUND, ex, request);
    }

    // Manejo de errores de validación de @Valid (si lo usás en DTOs)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDTO> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(" | "));
        return buildResponse(HttpStatus.BAD_REQUEST, "Validación fallida", ex.getClass().getSimpleName(), message, request);
    }

    // Manejo de errores de integridad referencial o base de datos
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDTO> handleConstraintViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.CONFLICT, "Error de integridad en base de datos", ex.getClass().getSimpleName(), ex.getMessage(), request);
    }

    // Manejo general (catch-all)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleAll(Exception ex, HttpServletRequest request) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex, request);
    }

    // 🔧 Métodos utilitario para construir respuesta
    private ResponseEntity<ErrorDTO> buildResponse(HttpStatus status, Exception ex, HttpServletRequest request) {
        return buildResponse(status, ex.getMessage(), ex.getClass().getSimpleName(), null, request);
    }

    private ResponseEntity<ErrorDTO> buildResponse(HttpStatus status, String errorMsg, String errorClass, String details, HttpServletRequest request) {
        logger.error("{}: {}", errorClass, errorMsg);
        ErrorDTO error = ErrorDTO.builder()
                .errorClass(errorClass)
                .errorMsg(errorMsg)
                .details(details)
                .path(request.getRequestURI())
                .status(status.value())
                .build();
        return ResponseEntity.status(status).body(error);
    }
}
