package com.konta.backend.controller;

import com.konta.backend.service.AdminService;
import com.konta.backend.service.SistemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private SistemaService sistemaService;

    @GetMapping("/users")
    public ResponseEntity<?> listarUsuarios() {
        return ResponseEntity.ok(adminService.obtenerTodosLosUsuarios());
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable Long id){
        try{
            String resultado = adminService.cambiarEstadoUsuario(id);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> listarTickets() {
        return ResponseEntity.ok(adminService.obtenerTodosLosTickets());
    }

    @PutMapping("/tickets/{id}/resolve")
    public ResponseEntity<?> resolverTicket(@PathVariable Long id) {
        try {
            String resultado = adminService.resolverTicket(id);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/system/maintenance/status")
    public ResponseEntity<?> verEstadoMantenimiento() {
        return ResponseEntity.ok("Modo Mantenimiento: " + (sistemaService.isModoMantenimiento() ? "ON" : "OFF"));
    }

    @PutMapping("/system/maintenance/toggle")
    public ResponseEntity<?> cambiarModoMantenimiento() {
        String nuevoEstado = sistemaService.toggleMantenimiento();
        return ResponseEntity.ok("El Modo Mantenimiento ahora está: " + nuevoEstado);
    }

    @GetMapping("/stats")
    public ResponseEntity<?> obtenerEstadisticasKpi() {
        return ResponseEntity.ok(adminService.obtenerEstadisticas());
    }
}