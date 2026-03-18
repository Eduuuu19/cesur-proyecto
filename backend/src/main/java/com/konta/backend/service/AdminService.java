package com.konta.backend.service;

import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Variable en memoria para el Modo Mantenimiento
    private boolean modoMantenimiento = false;

    // ==========================================
    // GESTIÓN DE USUARIOS
    // ==========================================

    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario cambiarEstadoUsuario(Long idUsuario, String nuevoEstado) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        usuario.setEstado(nuevoEstado);
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long idUsuario) {
        usuarioRepository.deleteById(idUsuario);
    }

    // ==========================================
    // PARÁMETROS GLOBALES
    // ==========================================

    public boolean isModoMantenimiento() {
        return modoMantenimiento;
    }

    public String toggleModoMantenimiento() {
        this.modoMantenimiento = !this.modoMantenimiento;
        return this.modoMantenimiento ? "Modo mantenimiento ACTIVADO" : "Modo mantenimiento DESACTIVADO";
    }
}