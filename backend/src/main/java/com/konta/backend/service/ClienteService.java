package com.konta.backend.service;

import com.konta.backend.entity.Cliente;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.ClienteRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado(){
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("El usuario autenticado no existe en el sistema"));
    }

    public List<Cliente> getClientes() {
        Usuario usuario = getUsuarioAutenticado();
        return clienteRepository.findByUsuario(usuario);
    }

    public Cliente addCliente(Cliente cliente) {

        Usuario usuario = getUsuarioAutenticado();

        if (clienteRepository.existsByNifAndUsuario(cliente.getNif(), usuario)){
            throw new IllegalArgumentException("Error: Ya tienes un cliente registrado con el NIF " + cliente.getNif());
        }
        cliente.setUsuario(usuario);
        return clienteRepository.save(cliente);
    }

    public Cliente getClienteById(Long id){
        Usuario usuario = getUsuarioAutenticado();
        return clienteRepository.findByIdClienteAndUsuario(id, usuario)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado o no tienes permisos para verlo"));
    }

    public void deleteCliente(Long id){
        Cliente cliente = getClienteById(id);
        clienteRepository.delete(cliente);
    }

    public Cliente updateCliente(Long id, Cliente clienteDetalles){
        Cliente clienteExistente = getClienteById(id);

        if (clienteExistente != null) {
            clienteExistente.setNombre(clienteDetalles.getNombre());
            clienteExistente.setNif(clienteDetalles.getNif());
            clienteExistente.setDireccion(clienteDetalles.getDireccion());
            clienteExistente.setEmail(clienteDetalles.getEmail());
            clienteExistente.setTelefono(clienteDetalles.getTelefono());
            clienteExistente.setEstado(clienteDetalles.getEstado());

            return clienteRepository.save(clienteExistente);
        }

        return null;
    }

    public List<Cliente> getClienteByState(String estado) {
        Usuario usuario = getUsuarioAutenticado();
        return clienteRepository.findByEstadoAndUsuario(estado, usuario);
    }

    public List<Cliente> getClienteByName(String nombre) {
        Usuario usuario = getUsuarioAutenticado();
        return clienteRepository.findByNombreContainingIgnoreCaseAndUsuario(nombre, usuario);
    }
}
