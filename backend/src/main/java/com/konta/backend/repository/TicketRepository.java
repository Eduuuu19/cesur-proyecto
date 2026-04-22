package com.konta.backend.repository;

import com.konta.backend.entity.TicketSoporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends JpaRepository<TicketSoporte, Long> {
}