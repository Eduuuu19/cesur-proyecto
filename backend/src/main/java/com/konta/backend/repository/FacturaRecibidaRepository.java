package com.konta.backend.repository;

import com.konta.backend.entity.FacturaRecibida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturaRecibidaRepository extends JpaRepository<FacturaRecibida, Long> {
}