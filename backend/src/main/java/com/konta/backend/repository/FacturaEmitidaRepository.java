package com.konta.backend.repository;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.entity.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaEmitidaRepository extends JpaRepository<FacturaEmitida, Long> {
    boolean existsByNumeroFacturaAndUsuario(String numeroFactura, Usuario usuario);
    List<FacturaEmitida> findByUsuario(Usuario usuario, Sort sort);
    Optional<FacturaEmitida> findByIdFacturaEmitidaAndUsuario(Long id, Usuario usuario);
    List<FacturaEmitida> findByEstadoAndUsuario(String estado, Usuario usuario, Sort sort);
    List<FacturaEmitida> findByClienteNifAndUsuario(String nif, Usuario usuario, Sort sort);
}
