package com.konta.backend.service;

import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener el usuario que tiene la sesión iniciada
    public Usuario getPerfilActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    public Usuario actualizarPerfil(Usuario datosNuevos) {
        Usuario usuarioActual = getPerfilActual();

        usuarioActual.setNombreUsuario(datosNuevos.getNombreUsuario());
        usuarioActual.setTelefono(datosNuevos.getTelefono());

        if (datosNuevos.getPassword() != null && !datosNuevos.getPassword().trim().isEmpty()) {
            usuarioActual.setPassword(passwordEncoder.encode(datosNuevos.getPassword()));
        }

        return usuarioRepository.save(usuarioActual);
    }
}