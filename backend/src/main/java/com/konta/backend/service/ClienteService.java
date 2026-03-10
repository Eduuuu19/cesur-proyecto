package com.konta.backend.service;

import com.konta.backend.entity.Cliente;
import com.konta.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired //
    private ClienteRepository clienteRepository;

    // --- MÉTODOS ---

    // Mostrar todos los clientes
    public List<Cliente> getClientes() {
        return clienteRepository.findAll();
    }

    // Crear un cliente nuevo
    public Cliente addCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    // Mostrar un solo cliente
    public Cliente getClienteById(Long id){
        return clienteRepository.findById(id).orElse(null);
    }

    // Eliminar un cliente
    public void deleteCliente(Long id){
        clienteRepository.deleteById(id);
    }

    // Actualizar un cliente
    public Cliente updateCliente(Long id, Cliente clienteDetalles){
        Cliente clienteExistente = clienteRepository.findById(id).orElse(null);

        if (clienteExistente != null) {
            clienteExistente.setNombre(clienteDetalles.getNombre());
            clienteExistente.setNif(clienteDetalles.getNif());
            clienteExistente.setDireccion(clienteDetalles.getDireccion());
            clienteExistente.setEmail(clienteDetalles.getEmail());
            clienteExistente.setTelefono(clienteDetalles.getTelefono());
            clienteExistente.setEstado(clienteDetalles.getEstado());

            return clienteRepository.save(clienteExistente);
        }

        return null; // Si no existía, no hacemos nada
    }
}