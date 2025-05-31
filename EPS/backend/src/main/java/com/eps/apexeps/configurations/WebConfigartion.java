package com.eps.apexeps.configurations;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfigurationSource;

/**
  * Clase de configuración para habilitar CORS en la aplicación.
  * @author Danna Villanueva
  */
@Configuration
public class WebConfigartion {

    /**
     * Configuración de CORS para permitir solicitudes desde el frontend.
     * @return CorsConfigurationSource que define las políticas de CORS.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            var configuration = new org.springframework.web.cors.CorsConfiguration();
            configuration.setAllowedOrigins(List.of("http://localhost:3000"));
            configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            configuration.setAllowedHeaders(List.of("*"));
            configuration.setAllowCredentials(true);

            return configuration;
        };
    }

}
