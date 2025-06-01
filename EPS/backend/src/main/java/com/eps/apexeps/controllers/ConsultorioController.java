package com.eps.apexeps.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.entity.Consultorio;
import com.eps.apexeps.models.DTOs.response.ConsultorioEntradaLista;
import com.eps.apexeps.models.DTOs.response.ConsultorioLista;
import com.eps.apexeps.services.AdmIpsService;
import com.eps.apexeps.services.ConsultorioService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Controlador REST para manejar las operaciones relacionadas con los
 * consultorios de una IPS.
 * Proporciona endpoints para obtener, crear y actualizar consultorios.
 * 
 * @author Nicolás Sabogal
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/consultorio")
public class ConsultorioController {

    /** Servicio de consultorios para manejar la lógica de negocio. */
    private final ConsultorioService consultorioService;

    /**
     * Servicio de administración de IPS para verificar la pertenencia de un
     * administrador a una IPS.
     */
    private final AdmIpsService admIpsService;

    /**
     * Endpoint para obtener todos los consultorios de la base de datos.
     * 
     * @param cupsServicioMedico El CUPS del servicio médico asociado a los
     *                           consultorios (opcional).
     * @param idConsultorioLike  Número que se usará para filtrar los consultorios
     *                           por su id (opcional).
     * @param qSize              Tamaño de la página (por defecto, 10).
     * @param qPage              Número de la página (por defecto, 0).
     * @return Una lista de todos los consultorios.
     */
    @GetMapping
    public ResponseEntity<ConsultorioLista> getAllConsultorios(
            @RequestParam(required = false) String cupsServicioMedico,
            @RequestParam(required = false) Integer idConsultorioLike,
            @RequestParam(defaultValue = "10") Integer qSize,
            @RequestParam(defaultValue = "0") Integer qPage) {
        Page<Consultorio> entradas = consultorioService
                .getConsultorios(
                        null,
                        idConsultorioLike,
                        cupsServicioMedico,
                        qSize,
                        qPage);

        return ResponseEntity.ok(
                new ConsultorioLista(
                        entradas.getTotalPages(),
                        entradas.stream()
                                .map(ConsultorioEntradaLista::of)
                                .toList()));
    }

    /**
     * Endpoint para obtener todos los consultorios de una IPS por su id.
     * 
     * @param idIps              El id de la IPS.
     * @param cupsServicioMedico El CUPS del servicio médico asociado a los
     *                           consultorios (opcional).
     * @param idConsultorioLike  Número que se usará para filtrar los consultorios
     *                           por su id (opcional).
     * @param qSize              Tamaño de la página (por defecto, 10).
     * @param qPage              Número de la página (por defecto, 0).
     * @return Una lista de consultorios asociados a la IPS.
     */
    @GetMapping("/{idIps}")
    public ResponseEntity<ConsultorioLista> getConsultoriosByIps(
            @PathVariable Integer idIps,
            @RequestParam(required = false) String cupsServicioMedico,
            @RequestParam(required = false) Integer idConsultorioLike,
            @RequestParam(defaultValue = "10") Integer qSize,
            @RequestParam(defaultValue = "0") Integer qPage) {
        Page<Consultorio> entradas = consultorioService
                .getConsultorios(
                        idIps,
                        idConsultorioLike,
                        cupsServicioMedico,
                        qSize,
                        qPage);

        return ResponseEntity.ok(
                new ConsultorioLista(
                        entradas.getTotalPages(),
                        entradas.stream()
                                .map(ConsultorioEntradaLista::of)
                                .toList()));
    }

    /**
     * Endpoint para obtener un consultorio específico de una IPS por su id.
     * 
     * @param idIps         El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return El consultorio asociado a la IPS y al id del consultorio o null si no
     *         existe.
     */
    @GetMapping("/{idIps}/{idConsultorio}")
    public ResponseEntity<Consultorio> getConsultorio(@PathVariable Integer idIps,
            @PathVariable Integer idConsultorio) {
        return ResponseEntity.ok(consultorioService.getConsultorio(idIps, idConsultorio));
    }

    /**
     * Endpoint para crear un nuevo consultorio en una IPS.
     * 
     * @param Consultorio El objeto Consultorio que contiene la información del
     *                    nuevo consultorio.
     * @return El consultorio creado.
     * @throws RuntimeException Si no se pudo crear el consultorio.
     */
    @PostMapping
    public ResponseEntity<?> createConsultorio(
            @RequestBody Consultorio consultorio) {

        if (!isAdmIpsOfIdIps(consultorio.getId().getIps().getId()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("El administrador no pertenece a la IPS del consultorio.");

        try {
            return ResponseEntity.ok(consultorioService.createConsultorio(consultorio));
        } catch (Exception e) {
            throw new RuntimeException("Error al crear el consultorio: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para actualizar un consultorio existente de una IPS.
     * 
     * @param consultorio El objeto Consultorio que contiene la información del
     *                    consultorio a actualizar.
     * @return El consultorio actualizado.
     * @throws RuntimeException Si no se pudo actualizar el consultorio.
     */
    @PutMapping
    public ResponseEntity<?> updateConsultorio(
            @RequestBody Consultorio consultorio) {
        if (!isAdmIpsOfIdIps(consultorio.getId().getIps().getId()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("El administrador no pertenece a la IPS del consultorio.");

        try {
            return ResponseEntity.ok(consultorioService.updateConsultorio(consultorio));
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar el consultorio: " + e.getMessage(), e);
        }
    }

    /**
     * Verifica si el administrador de la sesión actual pertenece a la IPS del
     * consultorio.
     * 
     * @param idIps El id de la IPS del consultorio.
     * @return true si el administrador no pertenece a la IPS, false en caso
     *         contrario.
     */
    private boolean isAdmIpsOfIdIps(Integer idIps) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer idIpsAdm = admIpsService.findIdIpsByEmail(authentication.getName());
        return idIpsAdm.equals(idIps);
    }

}
