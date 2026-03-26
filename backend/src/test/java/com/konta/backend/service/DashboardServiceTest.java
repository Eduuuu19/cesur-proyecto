package com.konta.backend.service;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.entity.FacturaRecibida;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.FacturaEmitidaRepository;
import com.konta.backend.repository.FacturaRecibidaRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private FacturaEmitidaRepository facturaEmitidaRepository;

    @Mock
    private FacturaRecibidaRepository facturaRecibidaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private DashboardService dashboardService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        usuarioMock = new Usuario();
        usuarioMock.setIdUsuario(1L);
        usuarioMock.setEmail("admin@konta.com");

        // Simular que el usuario está logueado en todas las pruebas de esta clase
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("admin@konta.com");
        SecurityContextHolder.setContext(securityContext);

        when(usuarioRepository.findByEmail("admin@konta.com")).thenReturn(Optional.of(usuarioMock));
    }

    // ==============================================================
    // PRUEBA TU-02: Cálculo de KPIs en el Dashboard
    // ==============================================================
    @Test
    @DisplayName("TA-02: Debe calcular correctamente los beneficios de un mes específico")
    void testGetDatosMensualesCalculaKpisCorrectamente() {
        // Crear dos facturas de INGRESO para Marzo de 2026 (Total: 1500)
        FacturaEmitida ingreso1 = new FacturaEmitida();
        ingreso1.setTotal(1000.0);
        ingreso1.setFecha(LocalDate.of(2026, 3, 10));

        FacturaEmitida ingreso2 = new FacturaEmitida();
        ingreso2.setTotal(500.0);
        ingreso2.setFecha(LocalDate.of(2026, 3, 15));

        // Crear un INGRESO trampa de Febrero para ver si el filtro del mes funciona
        FacturaEmitida ingresoTrampa = new FacturaEmitida();
        ingresoTrampa.setTotal(5000.0);
        ingresoTrampa.setFecha(LocalDate.of(2026, 2, 5));

        // Crear una factura de GASTO para Marzo de 2026 (Total: 300)
        FacturaRecibida gasto1 = new FacturaRecibida();
        gasto1.setTotal(300.0);
        gasto1.setFecha(LocalDate.of(2026, 3, 20));

        when(facturaEmitidaRepository.findByUsuario(eq(usuarioMock), any(Sort.class)))
                .thenReturn(Arrays.asList(ingreso1, ingreso2, ingresoTrampa));

        when(facturaRecibidaRepository.findByUsuario(eq(usuarioMock), any(Sort.class)))
                .thenReturn(Arrays.asList(gasto1));

        // 2. EJECUTAR (Pedir los datos específicamente de Marzo de 2026)
        Map<String, Object> resultado = dashboardService.getDatosMensuales(2026, 3);

        // 3. COMPROBAR
        // Verificar que no ha sumado la factura de febrero
        assertEquals(1500.0, (Double) resultado.get("ingresosTotales"), "Los ingresos no cuadran. Revisa el filtro de fechas.");
        // Verificar que los gastos son correctos
        assertEquals(300.0, (Double) resultado.get("gastosTotales"), "Los gastos no cuadran.");
        // Verificar que la resta (1500 - 300) es exacta
        assertEquals(1200.0, (Double) resultado.get("beneficios"), "El beneficio calculado no es correcto.");
    }
}