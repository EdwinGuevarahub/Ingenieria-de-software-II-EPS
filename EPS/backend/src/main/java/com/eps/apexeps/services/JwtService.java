package com.eps.apexeps.services;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Servicio para manejar la generación y validación de tokens JWT.
 * @author Amigoscode
 */
@Service
public class JwtService {

    /** Tiempo de expiración del token en milisegundos. */
    public static final Integer TIEMPO_DE_EXPIRACION_MILISEGUNDOS = 1000 * 60 * 60 * 8; // 8 horas.

    // TODO: Insertar la clave secreta por variables de entorno.
    /** Clave secreta para firmar el token JWT. */
    private static final String secret = "uEnr0D/2cRjNc+JzXtkJgx/kKYlBo8Gz/4fE1RmiLfY=";

    /**
     * Genera un token JWT para el usuario especificado.
     * @param user Detalles del usuario para el que se genera el token.
     * @return El token JWT generado.
     */
    public String getToken(UserDetails user) {
        return getToken(new HashMap<>(), user);
    }

    /**
     * Genera un token JWT para el usuario especificado.
     * @param extraClaims Mapa de reclamos adicionales a incluir en el token.
     * @param user Detalles del usuario para el que se genera el token.
     * @return El token JWT generado.
     */
    private String getToken(Map<String,Object> extraClaims, UserDetails user){
        List<String> roles = user.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList();
            
        extraClaims.put("roles", roles); 
            return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + TIEMPO_DE_EXPIRACION_MILISEGUNDOS))
                .signWith(getKey(),SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Genera la clave secreta a partir de la cadena base64.
     * @return La clave secreta generada.
     */
    private Key getKey() {
        byte[] keyBytes= Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);       
    }

    /**
     * Extrae el email del usuario de la cabecera del token.
     * @param token El token JWT.
     * @return El email del usuario.
     */
    public String getEmailFromToken(String token) {
        return getClaim(token, Claims::getSubject);
    }

    /**
     * Verifica si el token es válido comparando el email y la fecha de expiración.
     * @param token El token JWT.
     * @param userDetails Los detalles del usuario.
     * @return true si el token es válido, false en caso contrario.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        String email = getEmailFromToken(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Extrae todos los reclamos (claims) del token.
     * @param token El token JWT.
     * @return Los reclamos extraídos del token.
     */
    private Claims getAllClaims(String token){
        return Jwts
            .parserBuilder()
            .setSigningKey(getKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
    }

    /**
     * Extrae un reclamo específico del token utilizando una función de resolución.
     * @param <T> El tipo del reclamo a extraer.
     * @param token El token JWT.
     * @param claimsResolver La función de resolución de reclamos.
     * @return El valor del reclamo extraído.
     */
    public <T> T getClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims=getAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrae la fecha de expiración del token.
     * @param token El token JWT.
     * @return La fecha de expiración del token.
     */
    public Date getExpiration(String token){
        return getClaim(token, Claims::getExpiration);
    }

    /**
     * Verifica si el token ha expirado.
     * @param token El token JWT.
     * @return true si el token ha expirado, false en caso contrario.
     */
    public boolean isTokenExpired(String token){
        return getExpiration(token).before(new Date());
    }
}
