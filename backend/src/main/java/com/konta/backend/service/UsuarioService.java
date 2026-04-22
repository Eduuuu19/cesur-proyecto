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
        Usuario usuario = getPerfilActual();

        usuario.setTelefono(datosNuevos.getTelefono());
        String fotoRecibida = datosNuevos.getFotoPerfil();

        if (fotoRecibida != null && fotoRecibida.trim().isEmpty()) {
            usuario.setFotoPerfil(null);
        } else if (fotoRecibida != null) {
            usuario.setFotoPerfil(fotoRecibida);
        }

        return usuarioRepository.save(usuario);
    }

    public void actualizarPassword(String currentPassword, String newPassword){
        Usuario usuario = getPerfilActual();

        if (!passwordEncoder.matches(currentPassword, usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta.");
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
    }
}