package com.eps.apexeps.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

import com.eps.apexeps.services.UsuarioService;

import lombok.RequiredArgsConstructor;

/**
 * Clase de configuración para la autenticación y autorización de usuarios.
 * @author Nicolás Sabogal
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfiguration {

    /** Servicio de autenticación */
    private final UsuarioService usuarioService;

    @Bean
    public UserDetailsService userDetailsService() {
        return email -> usuarioService.loadUserByEmail(email);
    }

    /**
     * Bean para el PasswordEncoder, que se utiliza para codificar contraseñas a través de BCrypt.
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // return new BCryptPasswordEncoder();
        // TODO: Cambiar a BCryptPasswordEncoder cuando se codifique la base de datos.
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence rawPassword) {
                return rawPassword.toString();
            }

            @Override
            public boolean matches(CharSequence rawPassword, String encodedPassword) {
                return rawPassword.toString().equals(encodedPassword);
            }
        };
    }

    /**
     * Bean para el AuthenticationManager, que se utiliza para autenticar usuarios.
     * @param configuration Configuración de autenticación
     * @return AuthenticationManager
     * @throws Exception Excepción en caso de error al obtener el AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * Bean para el AuthenticationProvider, que se utiliza para autenticar usuarios.
     * Este bean se encarga de autenticar a los usuarios utilizando UsuarioService
     * para cargar los detalles del usuario y verificar las credenciales.
     * @return AuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider() {
            @Override
            public Authentication authenticate(Authentication authentication) throws AuthenticationException {
                String email = authentication.getName();
                String password = (String) authentication.getCredentials();

                String endcodedPassword = passwordEncoder().encode(password);
                UserDetails userDetails = usuarioService.loadUserByEmailAndPassword(email, endcodedPassword);

                if (userDetails == null)
                    throw new BadCredentialsException("Credenciales inválidas");

                return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
            }
        };
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

}
