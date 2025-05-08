package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.request.MedicoListaSolicitud;
import com.eps.apexeps.response.MedicoEntradaLista;
import com.eps.apexeps.services.MedicoService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para manejar las operaciones relacionadas con los médicos de una IPS.
 * Proporciona endpoints para obtener, crear y actualizar médicos.
 * @author Nicolás Sabogal
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/medico")
public class MedicoController {

    /** Servicio de médicos para manejar la lógica de negocio. */
    private final MedicoService medicoService;

    /**
     * Endpoint para obtener todos los médicos de la base de datos.
     * @param idIps 
     * @param dniNombreLike 
     * @param cupsServicioMedico 
     * @param codDiaSemana 
     * @param horaDeInicio 
     * @param horaDeFin 
     * @param estaActivo 
     * @param qSize 
     * @param qPage 
     * @return Una lista de médicos.
     * @throws RuntimeException Si ocurre un error al obtener los médicos.
     */
    @GetMapping
    public List<MedicoEntradaLista> getAllMedicos(
        @RequestBody MedicoListaSolicitud medicoListaSolicitud
    ) {
        try{
            return medicoService
                    .getMedicos(
                        medicoListaSolicitud.getIdIps(),
                        medicoListaSolicitud.getDniNombreLike(),
                        medicoListaSolicitud.getCupsServicioMedico(),
                        medicoListaSolicitud.getCodDiaSemana(),
                        medicoListaSolicitud.getHoraDeInicio(),
                        medicoListaSolicitud.getHoraDeFin(),
                        medicoListaSolicitud.getEstaActivo(),
                        medicoListaSolicitud.getQSize(),
                        medicoListaSolicitud.getQPage()
                    )
                    .stream()
                    .map(MedicoEntradaLista::of)
                    .toList();
        }
        catch (Exception e) {
            throw new RuntimeException("Error al obtener los médicos: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para obtener un médico por su DNI.
     * @param dniMedico El DNI del médico.
     * @return El médico correspondiente al DNI o null si no existe.
     */
    @GetMapping("/{dniMedico}")
    public Medico getMedico(@PathVariable Long dniMedico) {
        return medicoService.getMedico(Long.valueOf(dniMedico));
    }

    /**
     * Endpoint para crear un nuevo médico.
     * @param trabaja objeto que contiene el médico a crear y un consultorio y horario de trabajo.
     * @return El objeto Trabaja que representa la relación entre el médico y el consultorio.
     * @throws RuntimeException Si ocurre un error al crear el médico.
     */
    @PostMapping
    public Trabaja createMedico(@RequestBody Trabaja trabaja) {
        try {
            return medicoService.createMedico(trabaja);
        }
        catch (Exception e) {
            throw new RuntimeException("Error al obtener el médico: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para actualizar un médico existente.
     * @param medico El médico a actualizar.
     * @return El médico actualizado.
     * @throws RuntimeException Si ocurre un error al actualizar el médico.
     */
    @PutMapping
    public Medico updateMedico(@RequestBody Medico medico) {
        try {
            return medicoService.updateMedico(medico);
        }
        catch (Exception e) {
            throw new RuntimeException("Error al actualizar el médico: " + e.getMessage(), e);
        }
    }
    
    /**
     * Endpoint para obtener los servicios médicos dominados por un médico.
     * @param dniMedico El DNI del médico.
     * @return Una lista de servicios médicos asociados al médico.
     * @throws RuntimeException Si ocurre un error al obtener los servicios médicos del médico.
     */
    @GetMapping("/{dniMedico}/dominio")
    public List<ServicioMedico> getAllDominiosMedico(@PathVariable Long dniMedico) {
        try {
            return medicoService.getAllDominiosMedico(Long.valueOf(dniMedico));
        }
        catch (Exception e) {
            throw new RuntimeException("Error al obtener los dominios: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para agregar un nuevo dominio de servicio médico a un médico.
     * @param dniMedico El DNI del médico.
     * @param servicioMedico El servicio médico a agregar.
     * @return Una lista de servicios médicos asociados al médico.
     * @throws RuntimeException Si ocurre un error al agregar el servicio médico al médico.
     */
    @PutMapping("/{dniMedico}/dominio")
    public List<ServicioMedico> addDominioMedico(
        @PathVariable Long dniMedico,
        @RequestBody ServicioMedico servicioMedico
    ) {
        try {
            return medicoService.addDominioMedico(dniMedico, servicioMedico);
        }
        catch (Exception e) {
            throw new RuntimeException("Error al agregar el dominio: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para eliminar un dominio de servicio médico de un médico.
     * @param dniMedico El DNI del médico.
     * @param servicioMedico El servicio médico a eliminar.
     * @return Una lista de servicios médicos restantes asociados al médico.
     * @throws RuntimeException Si ocurre un error al eliminar el servicio médico del médico.
     */
    @DeleteMapping("/{dniMedico}/dominio")
    public List<ServicioMedico> deleteDominioMedico(
        @PathVariable Long dniMedico,
        @RequestBody ServicioMedico servicioMedico
    ) {
        try {
            return medicoService.deleteDominioMedico(dniMedico, servicioMedico);
        }
        catch (Exception e) {
            throw new RuntimeException("Error al eliminar el dominio: " + e.getMessage(), e);
        }
    }

}
