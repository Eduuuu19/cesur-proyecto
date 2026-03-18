package com.konta.backend.service;

import com.konta.backend.entity.Presupuesto;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.PresupuestoRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PresupuestoService {

    @Autowired
    private PresupuestoRepository presupuestoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("El usuario autenticado no existe"));
    }

    public List<Presupuesto> getPresupuestos(Sort sort) {
        return presupuestoRepository.findByUsuario(getUsuarioAutenticado(), sort);
    }

    public Presupuesto getPresupuestoById(Long id) {
        return presupuestoRepository.findByIdPresupuestoAndUsuario(id, getUsuarioAutenticado())
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado o sin permisos"));
    }


    public Presupuesto addPresupuesto(Presupuesto presupuesto) {
        Usuario usuario = getUsuarioAutenticado();

        if (presupuestoRepository.existsByNumeroPresupuestoAndUsuario(presupuesto.getNumeroPresupuesto(), usuario)) {
            throw new IllegalArgumentException("Error: Ya tienes un presupuesto con el número " + presupuesto.getNumeroPresupuesto());
        }

        presupuesto.setUsuario(usuario);

        Double totalPresupuesto = calcularTotalPresupuesto(presupuesto.getBaseImponible(), presupuesto.getIva());
        presupuesto.setTotal(totalPresupuesto);

        return presupuestoRepository.save(presupuesto);
    }

    public void deletePresupuesto(Long id) {
        presupuestoRepository.deleteById(id);
    }

    public Presupuesto updatePresupuesto(Long id, Presupuesto presupuestoDetalles) {
        Presupuesto presupuestoExistente = getPresupuestoById(id);

        if (presupuestoExistente != null) {
            presupuestoExistente.setNumeroPresupuesto(presupuestoDetalles.getNumeroPresupuesto());
            presupuestoExistente.setFecha(presupuestoDetalles.getFecha());
            presupuestoExistente.setBaseImponible(presupuestoDetalles.getBaseImponible());
            presupuestoExistente.setIva(presupuestoDetalles.getIva());

            Double totalPresupuesto = calcularTotalPresupuesto(presupuestoDetalles.getBaseImponible(), presupuestoDetalles.getIva());
            presupuestoExistente.setTotal(totalPresupuesto);

            presupuestoExistente.setEstado(presupuestoDetalles.getEstado());
            presupuestoExistente.setCliente(presupuestoDetalles.getCliente());
            return presupuestoRepository.save(presupuestoExistente);
        }
        return null;
    }

    // Realizo el cálculo del total del presupuesto a partir de la base imponible y el IVA introducido por el usuario
    public Double calcularTotalPresupuesto(Double baseImponible, Double iva){
        return baseImponible + (baseImponible * (iva / 100));
    }

    public List<Presupuesto> getPresupuestosByState(String estado, Sort sort) {
        return presupuestoRepository.findByEstadoAndUsuario(estado, getUsuarioAutenticado(), sort);
    }

    public List<Presupuesto> getPresupuestosByNif(String nif, Sort sort) {
        return presupuestoRepository.findByClienteNifAndUsuario(nif, getUsuarioAutenticado(), sort);
    }
}