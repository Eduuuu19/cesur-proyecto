package com.konta.backend.repository;

import com.konta.backend.entity.Proveedor;
import com.konta.backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {
    boolean existsByNifAndUsuario(String nif, Usuario usuario);
    List<Proveedor> findByUsuario(Usuario usuario);
    Optional<Proveedor> findByIdProveedorAndUsuario(Long idCliente, Usuario usuario);
    List<Proveedor> findByEstadoAndUsuario(String estado, Usuario usuario);
    List<Proveedor> findByNombreContainingIgnoreCaseAndUsuario(String nombre, Usuario usuario);
}