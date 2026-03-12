package com.konta.backend.controller;

import com.konta.backend.entity.Presupuesto;
import com.konta.backend.service.PresupuestoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    @GetMapping
    public List<Presupuesto> getPresupuestos() {
        return presupuestoService.getPresupuestos();
    }

    @PostMapping
    public Presupuesto addPresupuesto(@Valid @RequestBody Presupuesto presupuesto) {
        return presupuestoService.addPresupuesto(presupuesto);
    }

    @GetMapping("/{id}")
    public Presupuesto getPresupuestoById(@PathVariable Long id) {
        return presupuestoService.getPresupuestoById(id);
    }

    @PutMapping("/{id}")
    public Presupuesto updatePresupuesto(@PathVariable Long id, @Valid @RequestBody Presupuesto presupuesto) {
        return presupuestoService.updatePresupuesto(id, presupuesto);
    }

    @DeleteMapping("/{id}")
    public void deletePresupuesto(@PathVariable Long id) {
        presupuestoService.deletePresupuesto(id);
    }
}