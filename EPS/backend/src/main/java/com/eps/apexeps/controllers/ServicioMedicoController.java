package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.service.ServicioMedicoService;

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
     * @return Una lista de servicios médicos.
     */
    @GetMapping
    public List<ServicioMedico> getAllServiciosMedicos() {
        return servicioMedicoService.getServiciosMedicos();
    }

    /**
     * Endpoint para obtener un servicio médico por su código CUPS.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @return El servicio médico correspondiente al código CUPS o null si no existe.
     */
    @GetMapping("/{cupsServicioMedico}")
    public ServicioMedico getServicioMedico(@PathVariable String cupsServicioMedico) {
        return servicioMedicoService.getServicioMedicoByCups(cupsServicioMedico);
    }

    /**
     * Endpoint para crear un nuevo servicio médico.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @param nombreServicioMedico El nombre del servicio médico.
     * @param descripcionServicioMedico La descripción del servicio médico (opcional).
     * @param tarifaServicioMedico La tarifa del servicio médico.
     * @return El servicio médico creado.
     * @throws RuntimeException Si no se puede crear el servicio médico.
     */
    @PostMapping
    public ServicioMedico createServicioMedico(
        String cupsServicioMedico,
        String nombreServicioMedico,
        @RequestParam(required = false) String descripcionServicioMedico,
        Double tarifaServicioMedico
    ) {
        try {
            return servicioMedicoService.createServicioMedico(
                        cupsServicioMedico,
                        nombreServicioMedico,
                        descripcionServicioMedico,
                        tarifaServicioMedico
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al crear el servicio médico: " + e.getMessage());
        }
    }

    /**
     * Endpoint para actualizar un servicio médico existente.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @param nombreServicioMedico El nuevo nombre del servicio médico.
     * @param descripcionServicioMedico La nueva descripción del servicio médico (opcional).
     * @Param tarifaServicioMedico La nueva tarifa del servicio médico.
     * @return El servicio médico actualizado.
     * @throws RuntimeException Si no se puede actualizar el servicio médico.
     */
    @PutMapping
    public ServicioMedico updateServicioMedico(
        String cupsServicioMedico,
        String nombreServicioMedico,
        @RequestParam(required = false) String descripcionServicioMedico,
        Double tarifaServicioMedico
    ) {
        try {
            return servicioMedicoService.updateServicioMedico(
                        cupsServicioMedico,
                        nombreServicioMedico,
                        descripcionServicioMedico,
                        tarifaServicioMedico
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al actualizar el servicio médico: " + e.getMessage());
        }
    }
    
}
