package com.konta.backend.controller;

import com.konta.backend.entity.Usuario;
import com.konta.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- GESTIÓN DE USUARIOS ---

    @GetMapping("/users")
    public List<Usuario> getAllUsers() {
        return adminService.obtenerTodosLosUsuarios();
    }

    @PutMapping("/users/{idUsuario}/estado")
    public Usuario updateEstadoUsuario(@PathVariable Long idUsuario, @RequestParam String estado) {
        return adminService.cambiarEstadoUsuario(idUsuario, estado);
    }

    @DeleteMapping("/users/{idUsuario}")
    public void deleteUser(@PathVariable Long idUsuario) {
        adminService.eliminarUsuario(idUsuario);
    }

    // --- PARÁMETROS GLOBALES Y MANTENIMIENTO ---

    @GetMapping("/mantenimiento")
    public boolean getEstadoMantenimiento() {
        return adminService.isModoMantenimiento();
    }

    @PostMapping("/mantenimiento/toggle")
    public String toggleMantenimiento() {
        return adminService.toggleModoMantenimiento();
    }
}