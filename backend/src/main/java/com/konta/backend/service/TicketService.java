package com.konta.backend.service;

import com.konta.backend.dto.TicketRequest;
import com.konta.backend.entity.TicketSoporte;
import com.konta.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    public void crearTicket(TicketRequest request) {
        String emailActual = SecurityContextHolder.getContext().getAuthentication().getName();

        TicketSoporte nuevoTicket = new TicketSoporte();
        nuevoTicket.setEmailUsuario(emailActual);
        nuevoTicket.setTipoConsulta(request.getTipoConsulta());
        nuevoTicket.setAsunto(request.getAsunto());
        nuevoTicket.setMensaje(request.getMensaje());

        ticketRepository.save(nuevoTicket);
    }
}