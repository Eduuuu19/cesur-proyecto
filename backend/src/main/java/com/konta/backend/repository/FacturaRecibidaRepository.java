package com.konta.backend.repository;

import com.konta.backend.entity.FacturaRecibida;
import com.konta.backend.entity.Usuario;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRecibidaRepository extends JpaRepository<FacturaRecibida, Long> {

    boolean existsByNumeroFacturaAndUsuario(String numeroFactura, Usuario usuario);

    List<FacturaRecibida> findByUsuario(Usuario usuario, Sort sort);
    Optional<FacturaRecibida> findByIdFacturaRecibidaAndUsuario(Long id, Usuario usuario);

    List<FacturaRecibida> findByEstadoAndUsuario(String estado, Usuario usuario, Sort sort);
    List<FacturaRecibida> findByProveedorNifAndUsuario(String nif, Usuario usuario, Sort sort);
}