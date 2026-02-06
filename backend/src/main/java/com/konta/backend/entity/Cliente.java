package com.konta.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id // se define clava primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // se define como autoincremental
    private Long id_cliente; //

    private Long id_usuario; //

    private String nombre;

    private String nif;

    private String direccion;

    private String email;

    private String telefono;

    private String estado;
}