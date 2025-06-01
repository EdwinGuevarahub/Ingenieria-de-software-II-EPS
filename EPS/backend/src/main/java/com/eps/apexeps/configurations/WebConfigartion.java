package com.eps.apexeps.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
     * @return WebMvcConfigurer
     */
	@Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(environment.getProperty("frontend.url"))
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }

}
