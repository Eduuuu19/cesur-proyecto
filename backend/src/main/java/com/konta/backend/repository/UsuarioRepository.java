package com.konta.backend.repository;

import com.konta.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método para el Login: buscar al usuario por su correo electrónico
    Optional<Usuario> findByEmail(String email);

    // Método para comprobar si un correo ya está registrado antes de crear uno nuevo
    boolean existsByEmail(String email);
}