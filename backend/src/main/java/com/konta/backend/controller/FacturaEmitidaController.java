package com.konta.backend.controller;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.service.FacturaEmitidaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices/issued")
public class FacturaEmitidaController {

    @Autowired
    private FacturaEmitidaService facturaEmitidaService;

    @GetMapping
    public List<FacturaEmitida> getFacturasEmitidas() {
        return facturaEmitidaService.getFacturasEmitidas();
    }

    @PostMapping
    public FacturaEmitida addFacturaEmitida(@Valid @RequestBody FacturaEmitida factura) {
        return facturaEmitidaService.addFacturaEmitida(factura);
    }

    @GetMapping("/{id}")
    public FacturaEmitida getFacturaEmitidaById(@PathVariable Long id) {
        return facturaEmitidaService.getFacturaEmitidaById(id);
    }

    @PutMapping("/{id}")
    public FacturaEmitida updateFacturaEmitida(@PathVariable Long id, @Valid @RequestBody FacturaEmitida factura) {
        return facturaEmitidaService.updateFacturaEmitida(id, factura);
    }

    @DeleteMapping("/{id}")
    public void deleteFacturaEmitida(@PathVariable Long id) {
        facturaEmitidaService.deleteFacturaEmitida(id);
    }
}