package com.eps.apexeps.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contiene el token de autenticación tras un inicio de sesión exitoso.
 * @author Nicolás Sabogal
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {

    /** Token de autenticación */
    String token;
    
}
