package com.konta.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    // ==============================================================
    // PRUEBA TU-04: Generación y Validación de Token JWT
    // ==============================================================
    @Test
    @DisplayName("TA-04: Debe generar un token válido y extraer el email correctamente")
    void testGenerarYValidarToken() {
        // 1. Preparar datos (El usuario que va a iniciar sesión)
        String emailPrueba = "seguridad@konta.com";
        String rolPrueba = "ADMIN";
        boolean recordarCredenciales = false;

        // 2. EJECUTAR
        String tokenGenerado = jwtService.generarToken(emailPrueba, rolPrueba, recordarCredenciales);

        // 3. COMPROBAR

        // A) Verificar que el Token es un texto.
        assertNotNull(tokenGenerado, "El token generado no debería ser nulo");
        assertFalse(tokenGenerado.isEmpty(), "El token generado no debería estar vacío");

        // B) Verificar que la firma criptográfica es correcta.
        boolean esValido = jwtService.validarToken(tokenGenerado);
        assertTrue(esValido, "El token generado ha sido rechazado por el propio validador");

        // C) Desencriptar el token y verificar que dentro está escondido el email correcto.
        String emailExtraido = jwtService.extraerEmail(tokenGenerado);
        assertEquals(emailPrueba, emailExtraido, "El email oculto en el token no coincide con el original");
    }
}