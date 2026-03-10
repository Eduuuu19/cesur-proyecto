package com.konta.backend.controller;

import com.konta.backend.entity.Proveedor;
import com.konta.backend.service.ProveedorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class ProveedorController {

    @Autowired
    private ProveedorService proveedorService;

    // --- (ENDPOINTS) ---

    @GetMapping
    public List<Proveedor> getProveedores() {
        return proveedorService.getProveedores();
    }

    @PostMapping
    public Proveedor addProveedor(@RequestBody Proveedor proveedor) {
        return proveedorService.addProveedor(proveedor);
    }

    @GetMapping("/{id}")
    public Proveedor getProveedorById(@PathVariable Long id) {
        return proveedorService.getProveedorById(id);
    }

    @PutMapping("/{id}")
    public Proveedor updateProveedor(@PathVariable Long id, @RequestBody Proveedor proveedor) {
        return proveedorService.updateProveedor(id, proveedor);
    }

    @DeleteMapping("/{id}")
    public void deleteProveedor(@PathVariable Long id) {
        proveedorService.deleteProveedor(id);
    }
}