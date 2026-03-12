package com.konta.backend.repository;

import com.konta.backend.entity.FacturaRecibida;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaRecibidaRepository extends JpaRepository<FacturaRecibida, Long> {
    List<FacturaRecibida> findByEstado(String estado, Sort sort);
    List<FacturaRecibida> findByProveedorNif(String nif, Sort sort);
}