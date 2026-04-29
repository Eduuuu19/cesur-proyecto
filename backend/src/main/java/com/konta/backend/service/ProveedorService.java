package com.konta.backend.service;

import com.konta.backend.entity.Proveedor;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.ProveedorRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado(){
        String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(emailAutenticado)
                .orElseThrow(() -> new IllegalArgumentException("El usuario autenticado no existe en el sistema"));
    }

    public List<Proveedor> getProveedores() {
        Usuario usuario = getUsuarioAutenticado();
        return proveedorRepository.findByUsuario(usuario);
    }

    public Proveedor addProveedor(Proveedor proveedor) {

        Usuario usuario = getUsuarioAutenticado();

        if (proveedorRepository.existsByNifAndUsuario(proveedor.getNif(), usuario)) {
            throw new IllegalArgumentException("Error: Ya tienes un proveedor registrado con el NIF " + proveedor.getNif());
        }

        proveedor.setUsuario(usuario);

        return proveedorRepository.save(proveedor);
    }

    public Proveedor getProveedorById(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        return proveedorRepository.findByIdProveedorAndUsuario(id, usuario)
                .orElseThrow(() -> new IllegalArgumentException("Proveedor no encontrado o no tienes permisos para verlo"));
    }

    public void deleteProveedor(Long id) {
        Proveedor proveedor = getProveedorById(id);
        proveedorRepository.deleteById(id);
    }

    public Proveedor updateProveedor(Long id, Proveedor proveedorDetalles) {
        Proveedor proveedorExistente = getProveedorById(id);

        if (proveedorExistente != null) {
            proveedorExistente.setNombre(proveedorDetalles.getNombre());
            proveedorExistente.setNif(proveedorDetalles.getNif());
            proveedorExistente.setDireccion(proveedorDetalles.getDireccion());
            proveedorExistente.setEmail(proveedorDetalles.getEmail());
            proveedorExistente.setTelefono(proveedorDetalles.getTelefono());
            proveedorExistente.setEstado(proveedorDetalles.getEstado());

            return proveedorRepository.save(proveedorExistente);
        }

        return null;
    }

    public List<Proveedor> getProveedorByState(String estado) {
        Usuario usuario = getUsuarioAutenticado();
        return proveedorRepository.findByEstadoAndUsuario(estado, usuario);
    }

    public List<Proveedor> getProveedorByName(String nombre) {
        Usuario usuario = getUsuarioAutenticado();
        return proveedorRepository.findByNombreContainingIgnoreCaseAndUsuario(nombre, usuario);
    }
}