package com.eps.apexeps.request;

import lombok.Data;

/**
 * Contiene los datos de autenticación del usuario para el inicio de sesión.
 * @author Nicolás Sabogal
 */
@Data
public class AuthenticationRequest {

    /** Email del usuario */
    private String email;
    /** Password del usuario */
    private String password;

}
