package com.eps.apexeps.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.request.AuthenticationRequest;
import com.eps.apexeps.response.AuthenticationResponse;
import com.eps.apexeps.services.AuthenticationService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador para manejar la autenticación de usuarios.
 * Este controlador expone un endpoint para autenticar a los usuarios
 * @author Nicolás Sabogal
 */
@RestController
@RequestMapping("api/auth")
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

    /**
     * Enpoint para probar la autenticación de un administrador de la EPS.
     * @return Cadena con el nombre de usuario y sus autoridades.
     */
    @GetMapping("/test/admeps")
    public ResponseEntity<String> testPathAdmeps() {
        return ResponseEntity.ok(testUserDetails());
    }

    /**
     * Enpoint para probar la autenticación de un administrador de una IPS.
     * @return Cadena con el nombre de usuario y sus autoridades.
     */
    @GetMapping("/test/admips")
    public ResponseEntity<String> testPathAdmips() {
        return ResponseEntity.ok(testUserDetails());
    }

    /**
     * Enpoint para probar la autenticación de un médico.
     * @return Cadena con el nombre de usuario y sus autoridades.
     */
    @GetMapping("/test/medico")
    public ResponseEntity<String> testPathMedico() {
        return ResponseEntity.ok(testUserDetails());
    }

    /**
     * Enpoint para probar la autenticación de un paciente.
     * @return Cadena con el nombre de usuario y sus autoridades.
     */
    @GetMapping("/test/paciente")
    public ResponseEntity<String> testPathPaciente() {
        return ResponseEntity.ok(testUserDetails());
    }

    /**
     * Enpoint para obtener los detalles del usuario autenticado.
     * @return
     */
    private String testUserDetails() {
        SecurityContext context = SecurityContextHolder.getContext();
        Authentication authentication = context.getAuthentication();

        String username = authentication.getName();
        String password = String.valueOf(authentication.getCredentials());
        String authorities = String.valueOf(authentication.getAuthorities());

        return String.format("Username: %s, Password: %s, Authorities: %s", username, password, authorities);
    }
    
}
