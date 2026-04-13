package com.konta.backend.repository;

import com.konta.backend.entity.Presupuesto;
import com.konta.backend.entity.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {
    boolean existsByNumeroPresupuestoAndUsuario(String numeroPresupuesto, Usuario usuario);
    List<Presupuesto> findByUsuario(Usuario usuario, Sort sort);
    Optional<Presupuesto> findByIdPresupuestoAndUsuario(Long id, Usuario usuario);
    List<Presupuesto> findByEstadoAndUsuario(String estado, Usuario usuario, Sort sort);
    List<Presupuesto> findByClienteNombreContainingIgnoreCaseAndUsuario(String nombre, Usuario usuario, Sort sort);
}