package com.eps.apexeps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition (
	servers = @Server (
	url = "https://potential-space-potato-5g4796r59qg2759v-8080.app.github.dev/",
	description = "5432"                  )
	               )
	
	
@SpringBootApplication
public class ApexepsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApexepsApplication.class, args);
	}

}
