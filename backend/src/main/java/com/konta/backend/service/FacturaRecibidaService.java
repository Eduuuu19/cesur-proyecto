package com.konta.backend.service;

import com.konta.backend.entity.FacturaRecibida;
import com.konta.backend.repository.FacturaRecibidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacturaRecibidaService {

    @Autowired
    private FacturaRecibidaRepository facturaRecibidaRepository;

    public List<FacturaRecibida> getFacturasRecibidas(Sort sort) {
        return facturaRecibidaRepository.findAll(sort);
    }

    public List<FacturaRecibida> getFacturasRecibidasByState(String estado, Sort sort) {
        return facturaRecibidaRepository.findByEstado(estado, sort);
    }

    public List<FacturaRecibida> getFacturasRecibidasByNif(String nif, Sort sort) {
        return facturaRecibidaRepository.findByProveedorNif(nif, sort);
    }
    public FacturaRecibida getFacturaRecibidaById(Long id) {
        return facturaRecibidaRepository.findById(id).orElse(null);
    }

    public FacturaRecibida addFacturaRecibida(FacturaRecibida factura) {
        Double totalFactura = calcularTotalFactura(factura.getBaseImponible(), factura.getIva());
        factura.setTotal(totalFactura);
        return facturaRecibidaRepository.save(factura);
    }

    public void deleteFacturaRecibida(Long id) {
        facturaRecibidaRepository.deleteById(id);
    }

    public FacturaRecibida updateFacturaRecibida(Long id, FacturaRecibida facturaDetalles) {
        FacturaRecibida facturaExistente = facturaRecibidaRepository.findById(id).orElse(null);

        if (facturaExistente != null) {
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
        return null;
    }

    // Realizo el cálculo del total de la factura a partir de la base imponible y el IVA introducido por el usuario
    public Double calcularTotalFactura(Double baseImponible, Double iva){
        return baseImponible + (baseImponible * (iva / 100));
    }
}