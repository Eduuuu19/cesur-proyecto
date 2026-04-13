package com.konta.backend.service;

import com.konta.backend.entity.FacturaRecibida;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.FacturaRecibidaRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacturaRecibidaService {

    @Autowired
    private FacturaRecibidaRepository facturaRecibidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("El usuario autenticado no existe"));
    }

    public List<FacturaRecibida> getFacturasRecibidas(Sort sort) {
        return facturaRecibidaRepository.findByUsuario(getUsuarioAutenticado(), sort);
    }

    public List<FacturaRecibida> getFacturasRecibidasByState(String estado, Sort sort) {
        return facturaRecibidaRepository.findByEstadoAndUsuario(estado, getUsuarioAutenticado(), sort);
    }

    public List<FacturaRecibida> getFacturasRecibidasByProveedorNombre(String nombre, Sort sort) {
        return facturaRecibidaRepository.findByProveedorNombreContainingIgnoreCaseAndUsuario(nombre, getUsuarioAutenticado(), sort);
    }

    public FacturaRecibida getFacturaRecibidaById(Long id) {
        return facturaRecibidaRepository.findByIdFacturaRecibidaAndUsuario(id, getUsuarioAutenticado())
                .orElseThrow(() -> new IllegalArgumentException("Factura no encontrada o sin permisos"));
    }

    public FacturaRecibida addFacturaRecibida(FacturaRecibida factura) {
        Usuario usuario = getUsuarioAutenticado();

        if (facturaRecibidaRepository.existsByNumeroFacturaAndProveedorAndUsuario(factura.getNumeroFactura(), factura.getProveedor(), usuario)) {
            throw new IllegalArgumentException("Error: Ya tienes una factura registrada con el número \"" + factura.getNumeroFactura() + "\" para este proveedor.");
        }

        factura.setUsuario(usuario);

        Double totalFactura = calcularTotalFactura(factura.getBaseImponible(), factura.getIva());
        factura.setTotal(totalFactura);

        return facturaRecibidaRepository.save(factura);
    }

    public FacturaRecibida updateFacturaRecibida(Long id, FacturaRecibida facturaDetalles) {
        FacturaRecibida facturaExistente = getFacturaRecibidaById(id);

        facturaExistente.setNumeroFactura(facturaDetalles.getNumeroFactura());
        facturaExistente.setFecha(facturaDetalles.getFecha());
        facturaExistente.setBaseImponible(facturaDetalles.getBaseImponible());
        facturaExistente.setIva(facturaDetalles.getIva());

        Double totalFactura = calcularTotalFactura(facturaDetalles.getBaseImponible(), facturaDetalles.getIva());
        facturaExistente.setTotal(totalFactura);

        facturaExistente.setEstado(facturaDetalles.getEstado());
        facturaExistente.setProveedor(facturaDetalles.getProveedor());

        return facturaRecibidaRepository.save(facturaExistente);
    }

    public void deleteFacturaRecibida(Long id) {
        FacturaRecibida factura = getFacturaRecibidaById(id);
        facturaRecibidaRepository.delete(factura);
    }

    // Realizo el cálculo del total de la factura a partir de la base imponible y el IVA introducido por el usuario
    public Double calcularTotalFactura(Double baseImponible, Double iva){
        return baseImponible + (baseImponible * (iva / 100));
    }
}