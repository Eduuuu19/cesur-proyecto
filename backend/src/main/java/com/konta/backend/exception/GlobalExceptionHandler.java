package com.konta.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Atrapa los errores de validación (Textos vacíos, emails falsos, etc.)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String nombreCampo = ((FieldError) error).getField();
            String mensaje = error.getDefaultMessage();
            errores.put(nombreCampo, mensaje);
        });

        return errores;
    }

    // 2. Atrapa los errores de la Base de Datos (Clones y Borrados ilegales)
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public Map<String, String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();

        String mensajeMySQL = ex.getMostSpecificCause().getMessage();

        if (mensajeMySQL != null && mensajeMySQL.contains("Duplicate entry")) {
            error.put("error", "El registro ya existe en la base de datos. Verifica que el número de documento no esté duplicado.");
        }
        else if (mensajeMySQL != null && mensajeMySQL.contains("foreign key constraint")) {
            error.put("error", "Operación denegada. No puedes eliminar este registro porque tiene otros documentos (facturas, presupuestos, etc.) asociados a él.");
        }
        else {
            error.put("error", "Error de integridad en la base de datos.");
        }

        return error;
    }

    // 3. Atrapa los errores de lógica de negocio (Lanzados manualmente con IllegalArgumentException)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public Map<String, String> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return error;
    }
}