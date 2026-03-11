package com.konta.backend.service;

import com.konta.backend.entity.Presupuesto;
import com.konta.backend.repository.PresupuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PresupuestoService {

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    public List<Presupuesto> getPresupuestos() {
        return presupuestoRepository.findAll();
    }

    public Presupuesto addPresupuesto(Presupuesto presupuesto) {
        return presupuestoRepository.save(presupuesto);
    }

    public Presupuesto getPresupuestoById(Long id) {
        return presupuestoRepository.findById(id).orElse(null);
    }

    public void deletePresupuesto(Long id) {
        presupuestoRepository.deleteById(id);
    }

    public Presupuesto updatePresupuesto(Long id, Presupuesto presupuestoDetalles) {
        Presupuesto presupuestoExistente = presupuestoRepository.findById(id).orElse(null);

        if (presupuestoExistente != null) {
            presupuestoExistente.setNumeroPresupuesto(presupuestoDetalles.getNumeroPresupuesto());
            presupuestoExistente.setFecha(presupuestoDetalles.getFecha());
            presupuestoExistente.setBaseImponible(presupuestoDetalles.getBaseImponible());
            presupuestoExistente.setIva(presupuestoDetalles.getIva());
            presupuestoExistente.setTotal(presupuestoDetalles.getTotal());
            presupuestoExistente.setEstado(presupuestoDetalles.getEstado());

            presupuestoExistente.setCliente(presupuestoDetalles.getCliente());

            return presupuestoRepository.save(presupuestoExistente);
        }
        return null;
    }
}