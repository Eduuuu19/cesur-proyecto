package com.konta.backend.controller;

import com.konta.backend.entity.FacturaRecibida;
import com.konta.backend.service.FacturaRecibidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices/received")
public class FacturaRecibidaController {

    @Autowired
    private FacturaRecibidaService facturaRecibidaService;

    @GetMapping
    public List<FacturaRecibida> getFacturasRecibidas() {
        return facturaRecibidaService.getFacturasRecibidas();
    }

    @PostMapping
    public FacturaRecibida addFacturaRecibida(@RequestBody FacturaRecibida factura) {
        return facturaRecibidaService.addFacturaRecibida(factura);
    }

    @GetMapping("/{id}")
    public FacturaRecibida getFacturaRecibidaById(@PathVariable Long id) {
        return facturaRecibidaService.getFacturaRecibidaById(id);
    }

    @PutMapping("/{id}")
    public FacturaRecibida updateFacturaRecibida(@PathVariable Long id, @RequestBody FacturaRecibida factura) {
        return facturaRecibidaService.updateFacturaRecibida(id, factura);
    }

    @DeleteMapping("/{id}")
    public void deleteFacturaRecibida(@PathVariable Long id) {
        facturaRecibidaService.deleteFacturaRecibida(id);
    }
}