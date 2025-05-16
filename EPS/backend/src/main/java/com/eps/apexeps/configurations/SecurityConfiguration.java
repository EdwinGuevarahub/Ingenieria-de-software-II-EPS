package com.eps.apexeps.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
                                .requestMatchers("/auth/**").permitAll()
                                // TODO: Cuando se haya adaptado el login en todas las rutas, quitar el permitAll.
                                // .anyRequest().hasAuthority(ERol.ADM_EPS.name())
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
