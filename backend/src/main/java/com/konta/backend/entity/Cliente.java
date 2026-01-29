package com.konta.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id // Esto le dice a Java: "Esta es la Clave Primaria"
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Esto dice: "Es autoincremental (1, 2, 3...)"
    private Long id_cliente; // ¡Exactamente igual que en DBeaver!

    private Long id_usuario; // ¡Exactamente igual que en DBeaver!

    private String nombre;

    private String nif;

    private String direccion;

    private String email;

    private String telefono;

    private String estado;
}