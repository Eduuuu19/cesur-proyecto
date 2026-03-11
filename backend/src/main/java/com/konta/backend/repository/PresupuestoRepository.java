package com.konta.backend.repository;

import com.konta.backend.entity.Presupuesto;
import com.konta.backend.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {
}
