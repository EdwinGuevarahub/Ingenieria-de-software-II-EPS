package com.eps.apexeps.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.response.ServicioMedicoEntradaLista;
import com.eps.apexeps.response.ServicioMedicoLista;
import com.eps.apexeps.services.ServicioMedicoService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para manejar las operaciones relacionadas con los servicios médicos de una IPS.
 * Proporciona endpoints para obtener, crear y actualizar servicios médicos.
 * @author Nicolás Sabogal
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/servicioMedico")
public class ServicioMedicoController {

    /** Servicio para manejar la lógica de negocio relacionada con los servicios médicos. */
    private final ServicioMedicoService servicioMedicoService;

    /**
     * Endpoint para obtener todos los servicios médicos de la base de datos.
     * @param cupsNombreLike Parte del nombre o código CUPS del servicio médico a buscar (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de servicios médicos.
     */
    @GetMapping
    public ResponseEntity<ServicioMedicoLista> getAllServiciosMedicos(
        @RequestParam(required = false) String cupsNombreLike,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) { 
        Page<ServicioMedico> entradas = servicioMedicoService
                                        .getServiciosMedicos(
                                            cupsNombreLike,
                                            qSize,
                                            qPage
                                        );

        return ResponseEntity.ok(
                    new ServicioMedicoLista(
                                entradas.getTotalPages(),
                                entradas.stream()
                                        .map(ServicioMedicoEntradaLista::of)
                                        .toList()
                            )
                );
    }

    /**
     * Endpoint para obtener un servicio médico por su código CUPS.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @return El servicio médico correspondiente al código CUPS o null si no existe.
     */
    @GetMapping("/{cupsServicioMedico}")
    public ResponseEntity<ServicioMedico> getServicioMedico(@PathVariable String cupsServicioMedico) {
        return ResponseEntity.ok(servicioMedicoService.getServicioMedicoByCups(cupsServicioMedico));
    }

    /**
     * Endpoint para crear un nuevo servicio médico.
     * @param servicioMedico El objeto ServicioMedico que contiene los datos del nuevo servicio médico.
     * @return El servicio médico creado.
     * @throws RuntimeException Si no se puede crear el servicio médico.
     */
    @PostMapping
    public ResponseEntity<ServicioMedico> createServicioMedico(@RequestBody ServicioMedico servicioMedico) {
        try {
            return ResponseEntity.ok(servicioMedicoService.createServicioMedico(servicioMedico));
        }
        catch (Exception e) {
            throw new RuntimeException("Error al crear el servicio médico: " + e.getMessage());
        }
    }

    /**
     * Endpoint para actualizar un servicio médico existente.
     * @param servicioMedico El objeto ServicioMedico que contiene los datos actualizados del servicio médico.
     * @throws RuntimeException Si no se puede actualizar el servicio médico.
     */
    @PutMapping
    public ResponseEntity<ServicioMedico> updateServicioMedico(@RequestBody ServicioMedico servicioMedico) {
        try {
            return ResponseEntity.ok(servicioMedicoService.updateServicioMedico(servicioMedico));
        }
        catch (Exception e) {
            throw new RuntimeException("Error al actualizar el servicio médico: " + e.getMessage());
        }
    }
    
}
