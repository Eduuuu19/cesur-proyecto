package com.konta.backend.repository;

import com.konta.backend.entity.Presupuesto;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PresupuestoRepository extends JpaRepository<Presupuesto, Long> {

    List<Presupuesto> findByEstado(String estado, Sort sort);

    // Como el presupuesto es para un cliente, buscamos por ClienteNif
    List<Presupuesto> findByClienteNif(String nif, Sort sort);
}