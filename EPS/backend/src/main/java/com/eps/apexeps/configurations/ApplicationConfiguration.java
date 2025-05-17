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

import com.eps.apexeps.models.auth.ERol;
import com.eps.apexeps.models.auth.Usuario;
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
        /** Instancia de PasswordEncoder que no realiza ninguna encripción. */
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
     * Este bean se encarga de autenticar a los usuarios utilizando específicamente Usuario
     * y sus múltiples contraseñas.
     * @return AuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider() {
            /** 
             * Método que se encarga de autenticar al usuario usando Usuario. Carga las credenciales
             * del usuario y verifica si la contraseña coincide con alguna de las almacenadas en el sistema.
             * @param authentication Objeto de autenticación que contiene las credenciales del usuario.
             * @return Authentication Objeto de autenticación con los detalles del usuario autenticado.
             * @throws AuthenticationException Excepción en caso de error durante la autenticación.
             */
            @Override
            public Authentication authenticate(Authentication authentication) throws AuthenticationException {
                String email = authentication.getName();
                String password = (String) authentication.getCredentials();

                // Cargar el usuario por email con sus contraseñas sin una contraseña en uso.
                Usuario usuario = (Usuario) userDetailsService().loadUserByUsername(email);
                if (usuario == null)
                    throw new BadCredentialsException("Credenciales inválidas");

                // Para cada rol, se verifica si la contraseña coincide con la almacenada.
                for (ERol rol : ERol.values()) {
                    String iterPassword = usuario.getPasswordMap().get(rol);
                    // Si la contraseña coincide, se asigna la contraseña codificada al usuario y se añade el rol.
                    if (iterPassword != null && passwordEncoder().matches(password, iterPassword)) {
                        usuario.setPassword(passwordEncoder().encode(password));
                        usuario.getRoles().add(rol);
                    }
                }

                // Si no se ha asignado ningún rol, la contraseña no coincide con ninguna de las almacenadas.
                if (usuario.getRoles().isEmpty())
                    throw new BadCredentialsException("Credenciales inválidas");

                return new UsernamePasswordAuthenticationToken(usuario, password, usuario.getAuthorities());
            }
        };
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

}
