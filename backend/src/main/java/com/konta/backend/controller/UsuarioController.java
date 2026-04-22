package com.konta.backend.controller;

import com.konta.backend.dto.UpdatePasswordDTO;
import com.konta.backend.entity.Usuario;
import com.konta.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/me")
    public Usuario getMiPerfil() {
        return usuarioService.getPerfilActual();
    }

    @PutMapping("/me")
    public Usuario updateMiPerfil(@RequestBody Usuario usuario) {
        return usuarioService.actualizarPerfil(usuario);
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> updateMiContraseña(@RequestBody UpdatePasswordDTO request){
        try {
            usuarioService.actualizarPassword(request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok().body("Contraseña actualizada con éxito.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
}