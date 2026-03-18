package com.konta.backend.controller;

import com.konta.backend.dto.LoginUsuarioDTO;
import com.konta.backend.dto.RegistroUsuarioDTO;
import com.konta.backend.entity.Usuario;
import com.konta.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Usuario> registrarUsuario(@Valid @RequestBody RegistroUsuarioDTO dto) {

        Usuario usuarioCreado = authService.registrarUsuario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> iniciarSesion(@Valid @RequestBody LoginUsuarioDTO dto) {

        String token = authService.autenticarUsuario(dto);

        java.util.Map<String, String> respuesta = new java.util.HashMap<>();
        respuesta.put("token", token);

        return ResponseEntity.ok(respuesta);
    }
}