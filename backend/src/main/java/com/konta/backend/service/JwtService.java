package com.konta.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

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