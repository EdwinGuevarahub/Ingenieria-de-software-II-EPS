package com.eps.apexeps.configurations;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.core.env.Environment;

import lombok.RequiredArgsConstructor;

/**
  * Clase de configuración para habilitar CORS en la aplicación.
  * @author Danna Villanueva
  */
@Configuration
@RequiredArgsConstructor
public class WebConfigartion {

    /** Permite acceder a las variables de application.properties */
    private final Environment environment;
    
    /**
     * Configuración de CORS para permitir solicitudes desde el frontend.
     * @return CorsConfigurationSource que define las políticas de CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            var configuration = new org.springframework.web.cors.CorsConfiguration();
            configuration.setAllowedOrigins(List.of(environment.getProperty("frontend.url")));
            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            configuration.setAllowedHeaders(List.of("*"));
            configuration.setAllowCredentials(true);

            return configuration;
        };
    }

}
