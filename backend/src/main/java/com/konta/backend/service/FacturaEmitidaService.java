package com.konta.backend.service;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.FacturaEmitidaRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacturaEmitidaService {

    @Autowired
    private FacturaEmitidaRepository facturaEmitidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("El usuario autenticado no existe"));
    }

    public List<FacturaEmitida> getFacturasEmitidas(Sort sort) {
        return facturaEmitidaRepository.findByUsuario(getUsuarioAutenticado(), sort);
    }

    public FacturaEmitida getFacturaEmitidaById(Long id) {
        return facturaEmitidaRepository.findByIdFacturaEmitidaAndUsuario(id, getUsuarioAutenticado())
                .orElseThrow(() -> new IllegalArgumentException("Factura no encontrada o sin permisos"));
    }

    public List<FacturaEmitida> getFacturasEmitidasByState(String estado, Sort sort) {
        return facturaEmitidaRepository.findByEstadoAndUsuario(estado, getUsuarioAutenticado(), sort);
    }

    public List<FacturaEmitida> getFacturasEmitidasByClienteNombre(String nombre, Sort sort) {
        return facturaEmitidaRepository.findByClienteNombreContainingIgnoreCaseAndUsuario(nombre, getUsuarioAutenticado(), sort);
    }

    public FacturaEmitida addFacturaEmitida(FacturaEmitida factura) {
        Usuario usuario = getUsuarioAutenticado();

        if (facturaEmitidaRepository.existsByNumeroFacturaAndUsuario(factura.getNumeroFactura(), usuario)) {
            throw new IllegalArgumentException("Error: Ya tienes una factura emitida con el número " + factura.getNumeroFactura());
        }

        factura.setUsuario(usuario);

        Double totalFactura = calcularTotalFactura(factura.getBaseImponible(), factura.getIva());
        factura.setTotal(totalFactura);
        return facturaEmitidaRepository.save(factura);
    }

    public FacturaEmitida updateFacturaEmitida(Long id, FacturaEmitida facturaDetalles) {
        FacturaEmitida facturaExistente = getFacturaEmitidaById(id);

        facturaExistente.setNumeroFactura(facturaDetalles.getNumeroFactura());
        facturaExistente.setFecha(facturaDetalles.getFecha());
        facturaExistente.setBaseImponible(facturaDetalles.getBaseImponible());
        facturaExistente.setIva(facturaDetalles.getIva());

        Double totalFactura = calcularTotalFactura(facturaDetalles.getBaseImponible(), facturaDetalles.getIva());
        facturaExistente.setTotal(totalFactura);

        facturaExistente.setEstado(facturaDetalles.getEstado());
        facturaExistente.setCliente(facturaDetalles.getCliente());

        return facturaEmitidaRepository.save(facturaExistente);
    }

    public void deleteFacturaEmitida(Long id) {
        // Comprobamos la propiedad antes de borrar
        FacturaEmitida factura = getFacturaEmitidaById(id);
        facturaEmitidaRepository.delete(factura);
    }

    // Realizo el cálculo del total de la factura a partir de la base imponible y el IVA introducido por el usuario
    public Double calcularTotalFactura(Double baseImponible, Double iva){
        return baseImponible + (baseImponible * (iva / 100));
    }
}