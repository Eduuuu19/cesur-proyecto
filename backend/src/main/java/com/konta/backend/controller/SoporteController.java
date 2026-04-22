package com.konta.backend.controller;

import com.konta.backend.dto.TicketRequest;
import com.konta.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/soporte")
public class SoporteController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/ticket")
    public ResponseEntity<?> enviarTicket(@RequestBody TicketRequest request) {
        ticketService.crearTicket(request);
        return ResponseEntity.ok().body("Tu mensaje ha sido enviado correctamente. El equipo de soporte lo revisará pronto.");
    }
}