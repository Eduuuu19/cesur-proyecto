package com.konta.backend.service;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.repository.FacturaEmitidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacturaEmitidaService {

    @Autowired
    private FacturaEmitidaRepository facturaEmitidaRepository;

    public List<FacturaEmitida> getFacturasEmitidas() {
        return facturaEmitidaRepository.findAll();
    }

    public FacturaEmitida addFacturaEmitida(FacturaEmitida factura) {
        Double totalFactura = calcularTotalFactura(factura.getBaseImponible(), factura.getIva());
        factura.setTotal(totalFactura);
        return facturaEmitidaRepository.save(factura);
    }

    public FacturaEmitida getFacturaEmitidaById(Long id) {
        return facturaEmitidaRepository.findById(id).orElse(null);
    }

    // D. BORRAR
    public void deleteFacturaEmitida(Long id) {
        facturaEmitidaRepository.deleteById(id);
    }

    public FacturaEmitida updateFacturaEmitida(Long id, FacturaEmitida facturaDetalles) {
        FacturaEmitida facturaExistente = facturaEmitidaRepository.findById(id).orElse(null);

        if (facturaExistente != null) {
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
        return null;
    }

    // Realizo el cálculo del total de la factura a partir de la base imponible y el IVA introducido por el usuario
    public Double calcularTotalFactura(Double baseImponible, Double iva){
        return baseImponible + (baseImponible * (iva / 100));
    }
}