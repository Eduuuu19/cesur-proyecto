package com.konta.backend.repository;

import com.konta.backend.entity.FacturaEmitida;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacturaEmitidaRepository extends JpaRepository<FacturaEmitida, Long> {
    List<FacturaEmitida> findByEstado(String estado, Sort sort);
    List<FacturaEmitida> findByClienteNif(String nif, Sort sort);
}
