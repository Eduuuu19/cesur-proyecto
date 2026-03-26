package com.konta.backend.service;

import com.konta.backend.entity.Cliente;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.ClienteRepository;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private ClienteService clienteService; // Probamos el servicio real

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        // Inicializo un usuario ficticio antes de la prueba
        usuarioMock = new Usuario();
        usuarioMock.setIdUsuario(1L);
        usuarioMock.setEmail("eduardo@konta.com");
    }

    // ==============================================================
    // PRUEBA TA-05: Aislamiento de datos usando Mockito
    // ==============================================================
    @Test
    @DisplayName("TA-05: Debe solicitar al repositorio solo los clientes del usuario autenticado")
    void testGetClientesGarantizaAislamiento() {
        // 1. Simular que "eduardo@konta.com" está logueado en el sistema
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("eduardo@konta.com");
        SecurityContextHolder.setContext(securityContext);

        when(usuarioRepository.findByEmail("eduardo@konta.com")).thenReturn(Optional.of(usuarioMock));

        // 2. Preparamos los clientes falsos que pertenecen SÓLO a Eduardo
        Cliente cliente1 = new Cliente();
        cliente1.setNombre("Cliente de Eduardo 1");
        cliente1.setUsuario(usuarioMock);

        Cliente cliente2 = new Cliente();
        cliente2.setNombre("Cliente de Eduardo 2");
        cliente2.setUsuario(usuarioMock);

        when(clienteRepository.findByUsuario(usuarioMock)).thenReturn(Arrays.asList(cliente1, cliente2));

        // 3. EJECUTAR la llamada al servicio
        List<Cliente> clientesObtenidos = clienteService.getClientes();

        // 4. COMPROBAR

        assertEquals(2, clientesObtenidos.size(), "El servicio no devolvió la cantidad esperada");
        verify(clienteRepository, times(1)).findByUsuario(usuarioMock);
    }
}