package com.konta.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginUsuarioDTO {

    @NotBlank(message = "El email no puede estar vacío")
    @Email(message = "Formato de email incorrecto")
    private String email;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String password;

    private boolean recordarCredenciales;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isRecordarCredenciales() {
        return recordarCredenciales;
    }

    public void setRecordarCredenciales(boolean recordarCredenciales) {
        this.recordarCredenciales = recordarCredenciales;
    }
}