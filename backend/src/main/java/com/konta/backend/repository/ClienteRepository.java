package com.konta.backend.repository;

import com.konta.backend.entity.Cliente;
import com.konta.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByNifAndUsuario(String nif, Usuario usuario);
    List<Cliente> findByUsuario(Usuario usuario);
    Optional<Cliente> findByIdClienteAndUsuario(Long idCliente, Usuario usuario);
    List<Cliente> findByEstadoAndUsuario(String estado, Usuario usuario);
    List<Cliente> findByNombreContainingIgnoreCaseAndUsuario(String nombre, Usuario usuario);
}