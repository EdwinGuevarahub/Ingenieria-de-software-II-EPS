package com.eps.apexeps.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar la autenticación de usuarios.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    /** Servicio para manejar la autenticación JWT */
    private final JwtService jwtService;
    /** AuthenticationManager para autenticar usuarios */
    private final AuthenticationManager authenticationManager;

    /**
     * Método para autenticar a un usuario y generar un token JWT.
     * @param email Correo electrónico del usuario.
     * @param password Contraseña del usuario.
     * @return Token JWT generado para el usuario autenticado.
     */
    public String login(String email, String password) {
        Authentication autentificacion = authenticationManager
                                            .authenticate(
                                                new UsernamePasswordAuthenticationToken(
                                                    email,
                                                    password
                                                )
                                            );
        
        return jwtService.getToken((UserDetails) autentificacion.getPrincipal());
    }

}
