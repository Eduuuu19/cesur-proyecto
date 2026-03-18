package com.konta.backend.controller;

import com.konta.backend.entity.Presupuesto;
import com.konta.backend.service.PresupuestoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    // --- Endpoints ---

    @GetMapping
    public List<Presupuesto> getPresupuestos(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String nif,
            Sort sort) {

        if (estado != null) {
            return presupuestoService.getPresupuestosByState(estado, sort);
        }

        if (nif != null) {
            return presupuestoService.getPresupuestosByNif(nif, sort);
        }

        return presupuestoService.getPresupuestos(sort);
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