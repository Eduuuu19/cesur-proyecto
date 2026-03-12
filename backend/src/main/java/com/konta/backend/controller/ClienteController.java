package com.konta.backend.controller;
import com.konta.backend.entity.Cliente;
import com.konta.backend.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    // --- Endpoints ---

    @GetMapping
    public List<Cliente> getClientes() {
        return clienteService.getClientes();
    }

    @PostMapping
    public Cliente addCliente(@Valid @RequestBody Cliente cliente) {
        return clienteService.addCliente(cliente);
    }

    @GetMapping("/{id}")
    public Cliente getClienteById(@PathVariable Long id) {
        return clienteService.getClienteById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable Long id) {
        clienteService.deleteCliente(id);
    }

    @PutMapping("/{id}")
    public Cliente updateCliente(@PathVariable Long id, @Valid @RequestBody Cliente cliente) {
        return clienteService.updateCliente(id, cliente);
    }
}