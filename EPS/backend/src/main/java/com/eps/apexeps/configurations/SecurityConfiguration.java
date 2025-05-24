package com.eps.apexeps.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.eps.apexeps.models.auth.ERol;

import lombok.RequiredArgsConstructor;

/**
 * Clase de configuración de seguridad para la aplicación.
 * Esta clase configura la seguridad de la aplicación, incluyendo el filtro de autenticación JWT
 * y el proveedor de autenticación.
 * @author Nicolás Sabogal
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    /** Filtro de autenticación JWT */
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /** Proveedor de autenticación */
    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    // Permitir todas las peticiones a la ruta de autenticación.
                    .requestMatchers("/auth/**").permitAll()

                    // Rutas de prueba de rol.
                    .requestMatchers("/auth/test/admeps").hasAuthority(ERol.ADM_EPS.name())
                    .requestMatchers("/auth/test/admips").hasAuthority(ERol.ADM_IPS.name())
                    .requestMatchers("/auth/test/medico").hasAuthority(ERol.MEDICO.name())
                    .requestMatchers("/auth/test/paciente").hasAuthority(ERol.PACIENTE.name())

                    // Rutas de Gestión de IPS.
                    .requestMatchers(HttpMethod.GET, "api/ips/**").permitAll()
                    .requestMatchers("api/ips/**").hasAuthority(ERol.ADM_EPS.name())

                    // Rutas de Gestión de Consultorios.
                    .requestMatchers(HttpMethod.GET, "api/consultorio/**").permitAll()
                    .requestMatchers("api/consultorio/**").hasAuthority(ERol.ADM_IPS.name())

                    // Rutas de Gestión de Médicos.
                    .requestMatchers(HttpMethod.GET, "api/medico/**").permitAll()
                    .requestMatchers("api/medico/**").hasAuthority(ERol.ADM_IPS.name())

                    // Rutas de Gestión de Agendas.
                    .requestMatchers(HttpMethod.GET, "api/agenda/**").hasAnyAuthority(ERol.MEDICO.name(), ERol.PACIENTE.name())
                    .requestMatchers("api/agenda/**").hasAuthority(ERol.PACIENTE.name())

                    // TODO: Cuando se haya adaptado el login en todas las rutas, quitar el permitAll.
                    .anyRequest().permitAll()
                )
                .sessionManagement(sessionManager ->
                    sessionManager
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                        .authenticationProvider(authProvider)
                        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}
