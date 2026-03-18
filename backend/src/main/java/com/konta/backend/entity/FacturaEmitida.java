package com.konta.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@Entity
@Table(name = "facturas_emitidas", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"numero_factura", "id_usuario"})
})
public class FacturaEmitida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_factura_emitida")
    private Long idFacturaEmitida;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @NotBlank(message = "El número de factura no puede estar vacío")
    @Column(name = "numero_factura")
    private String numeroFactura;

    @NotNull(message = "La fecha no puede estar vacía")
    private LocalDate fecha;

    @NotNull(message = "La base imponible no puede estar vacía")
    @Positive(message = "La base imponible debe ser mayor que cero")
    @Column(name = "base_imponible")
    private Double baseImponible;

    @NotNull(message = "El IVA no puede estar vacío")
    @Positive(message = "El IVA debe ser mayor que cero")
    private Double iva;

    private Double total;

    @NotBlank(message = "El estado de la factura es obligatorio")
    @Pattern(regexp = "^(Pagada|Pendiente|Vencida)$", message = "El estado solo puede ser: Pagada, Pendiente o Vencida")
    private String estado;

    public FacturaEmitida() {
    }

    public Long getIdFacturaEmitida() {
        return idFacturaEmitida;
    }

    public void setIdFacturaEmitida(Long idFacturaEmitida) {
        this.idFacturaEmitida = idFacturaEmitida;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Usuario getUsuario() {return usuario;}

    public void setUsuario(Usuario usuario) {this.usuario = usuario;}

    public String getNumeroFactura() {
        return numeroFactura;
    }

    public void setNumeroFactura(String numeroFactura) {
        this.numeroFactura = numeroFactura;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Double getBaseImponible() {
        return baseImponible;
    }

    public void setBaseImponible(Double baseImponible) {
        this.baseImponible = baseImponible;
    }

    public Double getIva() {
        return iva;
    }

    public void setIva(Double iva) {
        this.iva = iva;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
