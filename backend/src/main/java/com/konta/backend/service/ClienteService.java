package com.konta.backend.service;

import com.konta.backend.entity.Cliente;
import com.konta.backend.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Esto significa que es el servicio
public class ClienteService {

    @Autowired // crea instancia en memoria y la devuelve a este servicio
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
        // Primero buscamos si existe el cliente
        Cliente clienteExistente = clienteRepository.findById(id).orElse(null);

        // Si existe, le actualizamos los datos
        if (clienteExistente != null) {
            clienteExistente.setNombre(clienteDetalles.getNombre());
            clienteExistente.setNif(clienteDetalles.getNif());
            clienteExistente.setDireccion(clienteDetalles.getDireccion());
            clienteExistente.setEmail(clienteDetalles.getEmail());
            clienteExistente.setTelefono(clienteDetalles.getTelefono());
            clienteExistente.setEstado(clienteDetalles.getEstado());

            // Guardamos los cambios en la base de datos
            return clienteRepository.save(clienteExistente);
        }

        return null; // Si no existía, no hacemos nada
    }
}