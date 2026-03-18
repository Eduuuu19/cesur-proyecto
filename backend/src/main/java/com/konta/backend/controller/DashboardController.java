package com.konta.backend.controller;

import com.konta.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // 1. Ruta para las 3 Tarjetas Superiores
    @GetMapping("/mensual")
    public Map<String, Object> getDashboardMensual(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        // Si el frontend no envía fecha, pongo el mes y año actual por defecto
        int añoConsulta = (year != null) ? year : LocalDate.now().getYear();
        int mesConsulta = (month != null) ? month : LocalDate.now().getMonthValue();

        return dashboardService.getDatosMensuales(añoConsulta, mesConsulta);
    }

    // 2. Ruta para el Gráfico Inferior
    @GetMapping("/anual")
    public Map<String, Object> getDashboardAnual(@RequestParam(required = false) Integer year) {

        int añoConsulta = (year != null) ? year : LocalDate.now().getYear();

        return dashboardService.getDatosAnuales(añoConsulta);
    }

    // 3. Ruta para los calendarios (Años y Meses bloqueados/desbloqueados)
    @GetMapping("/fechas-disponibles")
    public Map<Integer, Set<Integer>> getFechasDisponibles() {
        return dashboardService.getFechasDisponibles();
    }
}