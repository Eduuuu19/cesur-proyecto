package com.konta.backend.controller;
import com.konta.backend.entity.Cliente;
import com.konta.backend.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //
@RequestMapping("/api/customers") //
public class ClienteController {

    @Autowired
    private ClienteService clienteService; //

    // --- Endpoints ---

    // Mostrar todos los clientes
    @GetMapping
    public List<Cliente> getClientes() {
        return clienteService.getClientes();
    }

    // Crear un cliente nuevo
    @PostMapping
    public Cliente addCliente(@RequestBody Cliente cliente) {
        return clienteService.addCliente(cliente);
    }

    // Mostrar un solo cliente
    @GetMapping("/{id}")
    public Cliente getClienteById(@PathVariable Long id) {
        return clienteService.getClienteById(id);
    }

    // Eliminar un cliente
    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable Long id) {
        clienteService.deleteCliente(id);
    }

    // Actualizar un cliente
    @PutMapping("/{id}")
    public Cliente updateCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        return clienteService.updateCliente(id, cliente);
    }
}