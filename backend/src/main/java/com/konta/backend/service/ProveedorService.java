package com.konta.backend.service;

import com.konta.backend.entity.Proveedor;
import com.konta.backend.repository.ProveedorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    // --- MÉTODOS ---

    // LEER TODOS
    public List<Proveedor> getProveedores() {
        return proveedorRepository.findAll();
    }

    // CREAR
    public Proveedor addProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    // LEER UNO
    public Proveedor getProveedorById(Long id) {
        return proveedorRepository.findById(id).orElse(null);
    }

    // BORRAR
    public void deleteProveedor(Long id) {
        proveedorRepository.deleteById(id);
    }

    // ACTUALIZAR
    public Proveedor updateProveedor(Long id, Proveedor proveedorDetalles) {
        Proveedor proveedorExistente = proveedorRepository.findById(id).orElse(null);

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
}