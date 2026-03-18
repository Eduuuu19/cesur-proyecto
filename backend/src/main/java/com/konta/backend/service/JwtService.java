package com.konta.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY = "4f6c49e7b8a1c3f9d2e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7";

    public String generarToken(String email, String rol, boolean recordarCredenciales) {

        // Calculo el tiempo de vida del token en ms
        long tiempoCaducidad;
        if (recordarCredenciales) {
            tiempoCaducidad = 1000L * 60 * 60 * 24 * 30; // 30 días (en caso de marcar casilla de recordar credenciales)
        } else {
            tiempoCaducidad = 1000L * 60 * 60 * 2;       // 2 horas (por defecto)
        }

        // Contruccion y firma del Token
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + tiempoCaducidad))
                .signWith(obtenerFirma(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key obtenerFirma() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(obtenerFirma())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extraerEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(obtenerFirma())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}