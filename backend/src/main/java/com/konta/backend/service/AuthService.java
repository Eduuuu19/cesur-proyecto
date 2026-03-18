package com.konta.backend.service;

import com.konta.backend.dto.LoginUsuarioDTO;
import com.konta.backend.dto.RegistroUsuarioDTO;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(RegistroUsuarioDTO dto) {

        // Compruebo si el email ya existe en la base de datos
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado en el sistema");
        }

        Usuario nuevoUsuario = new Usuario();

        // Paso los datos del formulario (DTO) al usuario real
        nuevoUsuario.setNombreUsuario(dto.getNombreUsuario());
        nuevoUsuario.setEmail(dto.getEmail());
        nuevoUsuario.setTelefono(dto.getTelefono());

        // Encripto la contraseña antes de guardarla
        String contrasenaEncriptada = passwordEncoder.encode(dto.getPassword());
        nuevoUsuario.setPassword(contrasenaEncriptada);

        // Asigno los valores por defecto por seguridad
        nuevoUsuario.setRol("USER"); // Nadie puede registrarse como ADMIN desde la web
        nuevoUsuario.setAvatar(""); // Al principio no tiene foto

        // Guardo en la base de datos
        return usuarioRepository.save(nuevoUsuario);
    }

    public String autenticarUsuario(LoginUsuarioDTO dto) {

        Usuario usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Email o contraseña incorrectos"));

        boolean contrasenaCorrecta = passwordEncoder.matches(dto.getPassword(), usuario.getPassword());

        if (!contrasenaCorrecta) {
            throw new IllegalArgumentException("Email o contraseña incorrectos");
        }

        return jwtService.generarToken(
                usuario.getEmail(),
                usuario.getRol(),
                dto.isRecordarCredenciales()
        );
    }
}