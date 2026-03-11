package com.konta.backend.repository;

import com.konta.backend.entity.FacturaEmitida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturaEmitidaRepository extends JpaRepository<FacturaEmitida, Long> {
}
