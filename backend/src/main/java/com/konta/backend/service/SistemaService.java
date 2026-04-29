package com.konta.backend.service;

import org.springframework.stereotype.Service;

@Service
public class SistemaService {

    private boolean modoMantenimiento = false;

    public boolean isModoMantenimiento() {
        return modoMantenimiento;
    }

    public String toggleMantenimiento() {
        this.modoMantenimiento = !this.modoMantenimiento;
        return this.modoMantenimiento ? "Activado" : "Desactivado";
    }
}