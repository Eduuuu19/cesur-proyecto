package com.konta.backend.service;

import com.konta.backend.dto.UsuarioAdminDTO;
import com.konta.backend.entity.TicketSoporte;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.TicketRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public List<UsuarioAdminDTO> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return usuarios.stream().map(usuario -> {
            UsuarioAdminDTO dto = new UsuarioAdminDTO();
            dto.setIdUsuario(usuario.getIdUsuario());
            dto.setNombreUsuario(usuario.getNombreUsuario());
            dto.setEmail(usuario.getEmail());
            dto.setTelefono(usuario.getTelefono());
            dto.setRol(usuario.getRol());
            dto.setEstado(usuario.getEstado());
            return dto;
        }).collect(Collectors.toList());
    }

    public String cambiarEstadoUsuario(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Error: Usuario no encontrado"));

        if (usuario.getRol().equals("ADMIN")) {
            throw new RuntimeException("No puedes bloquear a un administrador del sistema.");
        }

        if ("Activo".equals(usuario.getEstado())) {
            usuario.setEstado("Bloqueado");
        } else {
            usuario.setEstado("Activo");
        }

        usuarioRepository.save(usuario);

        return "El usuario ahora está " + usuario.getEstado();
    }

    public List<TicketSoporte> obtenerTodosLosTickets() {
        return ticketRepository.findAll();
    }

    public String resolverTicket(Long idTicket) {
        TicketSoporte ticket = ticketRepository.findById(idTicket)
                .orElseThrow(() -> new RuntimeException("Error: Ticket no encontrado"));

        ticket.setEstado("RESUELTO");
        ticketRepository.save(ticket);

        return "El ticket ha sido marcado como RESUELTO.";
    }

    // 3. Estadísticas Globales (KPIs)
    public java.util.Map<String, Object> obtenerEstadisticas() {
        java.util.Map<String, Object> statsGlobales = new java.util.HashMap<>();

        // --- KPIs de Usuarios ---
        java.util.Map<String, Long> statsUsuarios = new java.util.HashMap<>();
        statsUsuarios.put("total", usuarioRepository.count());
        statsUsuarios.put("activos", usuarioRepository.countByEstado("Activo"));
        statsUsuarios.put("bloqueados", usuarioRepository.countByEstado("Bloqueado"));

        statsGlobales.put("usuarios", statsUsuarios);

        // --- KPIs de Tickets ---
        java.util.Map<String, Long> statsTickets = new java.util.HashMap<>();
        statsTickets.put("total", ticketRepository.count());
        statsTickets.put("pendientes", ticketRepository.countByEstado("PENDIENTE"));
        statsTickets.put("resueltos", ticketRepository.countByEstado("RESUELTO"));

        statsGlobales.put("tickets", statsTickets);

        return statsGlobales;
    }
}