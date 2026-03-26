package com.konta.backend.service;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.FacturaEmitidaRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FacturaEmitidaServiceTest {

    @Mock
    private FacturaEmitidaRepository facturaEmitidaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private FacturaEmitidaService facturaEmitidaService;

    // Mocks necesarios para simular el usuario logueado
    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        // Inicializo un usuario ficticio antes de cada prueba
        usuarioMock = new Usuario();
        usuarioMock.setIdUsuario(1L);
        usuarioMock.setEmail("eduardo@konta.com");
    }

    // ==============================================================
    // PRUEBA TU-01: Cálculo de la Factura
    // ==============================================================
    @Test
    @DisplayName("TA-01: Debe calcular correctamente el total con IVA")
    void testCalcularTotalFactura() {
        // 1. Preparar datos (Entrada)
        Double baseImponible = 1000.0;
        Double iva = 21.0;

        // 2. Ejecutar la lógica de negocio
        Double totalCalculado = facturaEmitidaService.calcularTotalFactura(baseImponible, iva);

        // 3. Comprobar resultado esperado
        assertEquals(1210.0, totalCalculado, "El cálculo del total con el 21% de IVA no es exacto.");
    }

    // ==============================================================
    // PRUEBA TU-03: Control de Excepciones (Factura Duplicada)
    // ==============================================================
    @Test
    @DisplayName("TA-03: Debe lanzar IllegalArgumentException si la factura ya existe")
    void testAddFacturaEmitidaLanzaExcepcionPorDuplicado() {
        // 1. Simular que hay un usuario logueado en Spring Security
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("eduardo@konta.com");
        SecurityContextHolder.setContext(securityContext);

        // 2. Simular que la base de datos encuentra a ese usuario
        when(usuarioRepository.findByEmail("eduardo@konta.com")).thenReturn(Optional.of(usuarioMock));

        // 3. Crear una factura de prueba
        FacturaEmitida facturaNueva = new FacturaEmitida();
        facturaNueva.setNumeroFactura("F-2026-001");

        // 4. Simular el error
        when(facturaEmitidaRepository.existsByNumeroFacturaAndUsuario("F-2026-001", usuarioMock))
                .thenReturn(true);

        // 5. Ejecutar y Verificar que salta la excepción exacta
        IllegalArgumentException excepcion = assertThrows(
                IllegalArgumentException.class,
                () -> facturaEmitidaService.addFacturaEmitida(facturaNueva)
        );

        // 6. Validar el mensaje
        assertTrue(excepcion.getMessage().contains("Ya tienes una factura emitida con el número F-2026-001"));
    }
}