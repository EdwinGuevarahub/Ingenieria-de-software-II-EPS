package com.eps.apexeps.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.request.AuthenticationRequest;
import com.eps.apexeps.response.AuthenticationResponse;
import com.eps.apexeps.services.AuthenticationService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador para manejar la autenticación de usuarios.
 * Este controlador expone un endpoint para autenticar a los usuarios
 * @author Nicolás Sabogal
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    /** Servicio para manejar la autenticación de usuarios */
    private final AuthenticationService authService;

    /**
     * Endpoint para autenticar a un usuario.
     * @param request Contiene el email y la contraseña del usuario.
     * @return Token de autenticación en un objeto AuthenticationResponse.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> autenticar(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(
                    new AuthenticationResponse(
                        authService.login(
                            request.getEmail(),
                            request.getPassword()
                        )
                    )
                );
    }
    
}
