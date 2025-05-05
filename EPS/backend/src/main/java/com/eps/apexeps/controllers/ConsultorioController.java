package com.eps.apexeps.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.response.ConsultorioEntradaLista;
import com.eps.apexeps.service.ConsultorioService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controlador REST para manejar las operaciones relacionadas con los consultorios de una IPS.
 * Proporciona endpoints para obtener, crear y actualizar consultorios.
 * @author Nicolás Sabogal
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consultorio")
public class ConsultorioController {
    
    /** Servicio de consultorios para manejar la lógica de negocio. */
    private final ConsultorioService consultorioService;

    /**
     * Endpoint para obtener todos los consultorios de la base de datos.
     * @param cupsServicioMedico El CUPS del servicio médico asociado a los consultorios (opcional).
     * @return Una lista de todos los consultorios.
     */
    @GetMapping
    public List<ConsultorioEntradaLista> getAllConsultorios(
        @RequestParam(required = false) String cupsServicioMedico
    ) {
        return consultorioService
                .getConsultorios(null, cupsServicioMedico)
                .stream()
                .map(ConsultorioEntradaLista::of)
                .toList();
    }

    /**
     * Endpoint para obtener todos los consultorios de una IPS por su id.
     * @param idIps El id de la IPS.
     * @param cupsServicioMedico El CUPS del servicio médico asociado a los consultorios (opcional).
     * @return Una lista de consultorios asociados a la IPS.
     */
    @GetMapping("/{idIps}")
    public List<ConsultorioEntradaLista> getConsultoriosByIps(
        @PathVariable Integer idIps,
        @RequestParam(required = false) String cupsServicioMedico
    ) {
        return consultorioService
                .getConsultorios(idIps, cupsServicioMedico)
                .stream()
                .map(ConsultorioEntradaLista::of)
                .toList();
    }
    
    /**
     * Endpoint para obtener un consultorio específico de una IPS por su id.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return El consultorio asociado a la IPS y al id del consultorio o null si no existe.
     */ 
    @GetMapping("/{idIps}/{idConsultorio}")
    public Consultorio getConsultorio(@PathVariable Integer idIps, @PathVariable Integer idConsultorio) {
        return consultorioService.getConsultorio(idIps, idConsultorio);
    }

    /**
     * Endpoint para crear un nuevo consultorio en una IPS.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @param cupsServicioMedico El CUPS del servicio médico asociado al consultorio.
     * @return El consultorio creado.
     * @throws RuntimeException Si no se pudo crear el consultorio.
     */
    @PostMapping
    public Consultorio createConsultorio(
        @RequestParam Integer idIps,
        @RequestParam Integer idConsultorio,
        @RequestParam String cupsServicioMedico
    ) {
        try {
            return consultorioService.createConsultorio(
                        idIps, idConsultorio, cupsServicioMedico
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al crear el consultorio: " + e.getMessage());
        }
    }

    /**
     * Endpoint para actualizar un consultorio existente de una IPS.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @param cupsServicioMedico El CUPS del servicio médico asociado al consultorio.
     * @return El consultorio actualizado.
     * @throws RuntimeException Si no se pudo actualizar el consultorio.
     */
    @PutMapping
    public Consultorio updateConsultorio(
        @RequestParam Integer idIps,
        @RequestParam Integer idConsultorio,
        @RequestParam String cupsServicioMedico
    ) {
        try {
            return consultorioService.updateConsultorio(
                        idIps, idConsultorio, cupsServicioMedico
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al actualizar el consultorio: " + e.getMessage());
        }
    }   
    
}
