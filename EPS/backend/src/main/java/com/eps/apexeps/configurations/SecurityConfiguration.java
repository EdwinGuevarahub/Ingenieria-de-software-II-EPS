package com.eps.apexeps.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
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
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    // Rutas de prueba de rol.
                    .requestMatchers("api/auth/test/admeps").hasAuthority(ERol.ADM_EPS.name())
                    .requestMatchers("api/auth/test/admips").hasAuthority(ERol.ADM_IPS.name())
                    .requestMatchers("api/auth/test/medico").hasAuthority(ERol.MEDICO.name())
                    .requestMatchers("api/auth/test/paciente").hasAuthority(ERol.PACIENTE.name())

                    // Permitir todas las peticiones a la ruta de autenticación.
                    .requestMatchers("api/auth/**").permitAll()

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
                    .requestMatchers(HttpMethod.GET, "api/agenda/paciente").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.PACIENTE.name())
                    .requestMatchers(HttpMethod.GET, "api/agenda/medico").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.MEDICO.name())
                    .requestMatchers("api/agenda/update/**").hasAnyAuthority(ERol.PACIENTE.name())
                    .requestMatchers("api/agenda/**").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.MEDICO.name(), ERol.PACIENTE.name())

                    // Rutas de Gestión de Historia Clinica.
                    .requestMatchers(HttpMethod.GET, "api/ips/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "api/historia-clinica").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.MEDICO.name())

                    // Rutas de Gestión de estado de cuenta
                    .requestMatchers(HttpMethod.GET, "api/estado-cuenta/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "api/estado-cuenta").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.PACIENTE.name())
                    .requestMatchers(HttpMethod.GET, "api/estado-cuenta/facturas/**").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.PACIENTE.name())

                    // Rutas de Gestión de Pago(agenda)
                    .requestMatchers(HttpMethod.GET, "api/pagos").permitAll()
                    .requestMatchers(HttpMethod.GET, "api/pagos").hasAnyAuthority(ERol.ADM_EPS.name(), ERol.PACIENTE.name())

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
