package com.konta.backend.service;

import com.konta.backend.entity.FacturaEmitida;
import com.konta.backend.entity.FacturaRecibida;
import com.konta.backend.entity.Usuario;
import com.konta.backend.repository.FacturaEmitidaRepository;
import com.konta.backend.repository.FacturaRecibidaRepository;
import com.konta.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private FacturaEmitidaRepository facturaEmitidaRepository;

    @Autowired
    private FacturaRecibidaRepository facturaRecibidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email).orElseThrow();
    }

    // ========================================================================
    // 1. DATOS PARA LAS 3 TARJETAS SUPERIORES (Mensual y Gráficos Diarios)
    // ========================================================================
    public Map<String, Object> getDatosMensuales(int year, int month) {
        Usuario usuario = getUsuarioAutenticado();

        List<FacturaEmitida> ingresosTotales = facturaEmitidaRepository.findByUsuario(usuario, Sort.unsorted());
        List<FacturaRecibida> gastosTotales = facturaRecibidaRepository.findByUsuario(usuario, Sort.unsorted());

        // Filtro solo las del mes y año seleccionados en el desplegable
        List<FacturaEmitida> ingresosDelMes = ingresosTotales.stream()
                .filter(f -> f.getFecha().getYear() == year && f.getFecha().getMonthValue() == month)
                .collect(Collectors.toList());

        List<FacturaRecibida> gastosDelMes = gastosTotales.stream()
                .filter(f -> f.getFecha().getYear() == year && f.getFecha().getMonthValue() == month)
                .collect(Collectors.toList());

        // Calculo los KPIs
        double totalIngresos = ingresosDelMes.stream().mapToDouble(FacturaEmitida::getTotal).sum();
        double totalGastos = gastosDelMes.stream().mapToDouble(FacturaRecibida::getTotal).sum();
        double beneficios = totalIngresos - totalGastos;

        // Preparo los arrays para los gráficos de evolución diaria
        int diasDelMes = YearMonth.of(year, month).lengthOfMonth();
        double[] graficoIngresosDiarios = new double[diasDelMes];
        double[] graficoGastosDiarios = new double[diasDelMes];

        // Rellenamos los arrays día a día
        for (FacturaEmitida f : ingresosDelMes) {
            int dia = f.getFecha().getDayOfMonth() - 1;
            graficoIngresosDiarios[dia] += f.getTotal();
        }
        for (FacturaRecibida f : gastosDelMes) {
            int dia = f.getFecha().getDayOfMonth() - 1;
            graficoGastosDiarios[dia] += f.getTotal();
        }

        // Empaquetado al frontend
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("ingresosTotales", totalIngresos);
        respuesta.put("gastosTotales", totalGastos);
        respuesta.put("beneficios", beneficios);
        respuesta.put("graficoIngresos", graficoIngresosDiarios);
        respuesta.put("graficoGastos", graficoGastosDiarios);

        return respuesta;
    }

    // ========================================================================
    // 2. DATOS PARA LA TARJETA INFERIOR (Gráfico Anual de Barras)
    // ========================================================================
    public Map<String, Object> getDatosAnuales(int year) {
        Usuario usuario = getUsuarioAutenticado();

        List<FacturaEmitida> ingresos = facturaEmitidaRepository.findByUsuario(usuario, Sort.unsorted());
        List<FacturaRecibida> gastos = facturaRecibidaRepository.findByUsuario(usuario, Sort.unsorted());

        double[] graficoIngresosMensuales = new double[12];
        double[] graficoGastosMensuales = new double[12];

        // Filtro por año y acumulo en el mes correspondiente
        ingresos.stream().filter(f -> f.getFecha().getYear() == year).forEach(f -> {
            int mes = f.getFecha().getMonthValue() - 1; // Enero es 0
            graficoIngresosMensuales[mes] += f.getTotal();
        });

        gastos.stream().filter(f -> f.getFecha().getYear() == year).forEach(f -> {
            int mes = f.getFecha().getMonthValue() - 1;
            graficoGastosMensuales[mes] += f.getTotal();
        });

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("graficoIngresosAnual", graficoIngresosMensuales);
        respuesta.put("graficoGastosAnual", graficoGastosMensuales);

        return respuesta;
    }

    // ========================================================================
    // 3. FECHAS CON DATOS (Para bloquear/desbloquear los calendarios)
    // ========================================================================
    public Map<Integer, Set<Integer>> getFechasDisponibles() {
        Usuario usuario = getUsuarioAutenticado();

        // Usao TreeMap con orden inverso para que los años más recientes salgan primero
        // Y dentro de cada año, un TreeSet para que los meses salgan ordenados (1, 2, 3...)
        Map<Integer, Set<Integer>> fechasDisponibles = new TreeMap<>(Collections.reverseOrder());

        // Escaneo las facturas emitidas y guardo su año y mes
        facturaEmitidaRepository.findByUsuario(usuario, Sort.unsorted()).forEach(f -> {
            int year = f.getFecha().getYear();
            int month = f.getFecha().getMonthValue();
            fechasDisponibles.computeIfAbsent(year, k -> new TreeSet<>()).add(month);
        });

        // Escaneo las facturas recibidas y guardo su año y mes
        facturaRecibidaRepository.findByUsuario(usuario, Sort.unsorted()).forEach(f -> {
            int year = f.getFecha().getYear();
            int month = f.getFecha().getMonthValue();
            fechasDisponibles.computeIfAbsent(year, k -> new TreeSet<>()).add(month);
        });

        // Si el usuario es nuevo y no tiene facturas, desbloqueo al menos el mes actual
        if (fechasDisponibles.isEmpty()) {
            LocalDate now = LocalDate.now();
            fechasDisponibles.computeIfAbsent(now.getYear(), k -> new TreeSet<>()).add(now.getMonthValue());
        }

        return fechasDisponibles;
    }
}