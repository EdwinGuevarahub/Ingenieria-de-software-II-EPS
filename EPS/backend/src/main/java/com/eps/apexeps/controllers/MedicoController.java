package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.entity.relations.Trabaja;
import com.eps.apexeps.models.entity.users.Medico;
import com.eps.apexeps.models.DTOs.response.MedicoEntradaLista;
import com.eps.apexeps.models.DTOs.response.MedicoLista;
import com.eps.apexeps.models.DTOs.response.ServicioMedicoEntradaLista;
import com.eps.apexeps.services.AdmIpsService;
import com.eps.apexeps.services.MedicoService;
import com.eps.apexeps.services.TrabajaService;

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

    /** Servicio de administradores de IPS para verificar permisos. */
    private final AdmIpsService admIpsService;

    /** Servicio de relaciones de trabajo para manejar las relaciones entre médicos y consultorios. */
    private final TrabajaService trabajaService;

    /**
     * Endpoint para obtener todos los médicos de la base de datos.
     * @param idIps El id de la IPS (opcional).
     * @param dniNombreLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS de un servicio médico asociado al médico (opcional).
     * @param diaSemanaIngles Día de la semana para filtrar médicos en inglés y mayúsuclas (opcional).
     * @param horaDeInicio La hora de inicio de la jornada laboral del médico (opcional, 0 a 23).
     * @param horaDeFin La hora de fin de la jornada laboral del médico (opcional, 0 a 23).
     * @param estaActivo Indica si el médico está activo o no (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de médicos.
     * @throws RuntimeException Si ocurre un error al obtener los médicos.
     * @see {@link java.time.DayOfWeek} Enumerador para los días de la semana usado.
     */
    @GetMapping
    public ResponseEntity<MedicoLista> getAllMedicos(
        @RequestParam(required = false) Integer idIps,
        @RequestParam(required = false) String dniNombreLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) String diaSemanaIngles,
        @RequestParam(required = false) Integer horaDeInicio,
        @RequestParam(required = false) Integer horaDeFin,
        @RequestParam(required = false) Boolean estaActivo,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        try{
            Page<Medico> entradas = medicoService
                                        .getMedicos(
                                            idIps,
                                            dniNombreLike,
                                            cupsServicioMedico,
                                            diaSemanaIngles,
                                            horaDeInicio,
                                            horaDeFin,
                                            estaActivo,
                                            qSize,
                                            qPage
                                        );

            return ResponseEntity.ok(
                        new MedicoLista(
                                entradas.getTotalPages(),
                                entradas.stream()
                                        .map(MedicoEntradaLista::of)
                                        .toList()
                            )
                    );
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
    public ResponseEntity<Medico> getMedico(@PathVariable Long dniMedico) {
        return ResponseEntity.ok(medicoService.getMedico(Long.valueOf(dniMedico)));
    }

    /**
     * Endpoint para crear un nuevo médico dado un horario inicial.
     * @param trabaja objeto que contiene el médico a crear y un consultorio y horario de trabajo.
     * @return El objeto Trabaja que representa la relación entre el médico y el consultorio.
     * @throws RuntimeException Si ocurre un error al crear el médico.
     */
    @PostMapping
    public ResponseEntity<?> createMedico(@RequestBody Trabaja trabaja) {
        Authentication authentification = SecurityContextHolder.getContext().getAuthentication();
        Integer idIpsAdm = admIpsService.findIdIpsByEmail(authentification.getName());
        if (trabaja.getConsultorio().getId().getIps().getId() != idIpsAdm)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tienes permiso para crear este médico en este consultorio.");

        try {
            return ResponseEntity.ok(medicoService.createMedico(trabaja));
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
    public ResponseEntity<?> updateMedico(@RequestBody Medico medico) {
        if (!isAdmIpsOfDniMedico(medico.getDni()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No tienes permiso para actualizar este médico.");

        try {
            return ResponseEntity.ok(medicoService.updateMedico(medico));
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
    public ResponseEntity<List<ServicioMedicoEntradaLista>> getAllDominiosMedico(@PathVariable Long dniMedico) {
        try {
            return ResponseEntity.ok(
                        medicoService.getAllDominiosMedico(Long.valueOf(dniMedico))
                            .stream()
                            .map(ServicioMedicoEntradaLista::of)
                            .toList()
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al obtener los dominios: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para agregar un nuevo dominio de servicio médico a un médico.
     * @param dniMedico El DNI del médico.
     * @param cupsServicioMedico El código CUPS del servicio médico a agregar.
     * @return Una lista de servicios médicos asociados al médico.
     * @throws RuntimeException Si ocurre un error al agregar el servicio médico al médico.
     */
    @PostMapping("/{dniMedico}/dominio")
    public ResponseEntity<List<ServicioMedicoEntradaLista>> addDominioMedico(
        @PathVariable Long dniMedico,
        @RequestParam String cupsServicioMedico
    ) {
        if (!isAdmIpsOfDniMedico(dniMedico))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(
                        medicoService.addDominioMedico(dniMedico, cupsServicioMedico)
                            .stream()
                            .map(ServicioMedicoEntradaLista::of)
                            .toList()
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al agregar el dominio: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para cambiar el estado de un médico (activo/inactivo).
     * @param dniMedico El DNI del médico. 
     * @return El médico actualizado.
     * @throws RuntimeException Si ocurre un error al cambiar el estado del médico.
     */
    @PutMapping("/{dniMedico}/activo")
    public ResponseEntity<?> cambiarEstadoIps(
            @PathVariable Long dniMedico) {
        try {
            Medico medicoActualizado = medicoService.actualizarActivo(dniMedico);
            return ResponseEntity.ok(medicoActualizado);
        } catch (Exception e) {
            throw new RuntimeException("Error al cambiar el estado de la IPS: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para eliminar un dominio de servicio médico de un médico.
     * @param dniMedico El DNI del médico.
     * @param cupsServicioMedico El código CUPS del servicio médico a eliminar.
     * @return Una lista de servicios médicos restantes asociados al médico.
     * @throws RuntimeException Si ocurre un error al eliminar el servicio médico del médico.
     */
    @DeleteMapping("/{dniMedico}/dominio")
    public ResponseEntity<List<ServicioMedicoEntradaLista>> deleteDominioMedico(
        @PathVariable Long dniMedico,
        @RequestParam String cupsServicioMedico
    ) {
        if (!isAdmIpsOfDniMedico(dniMedico))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(
                        medicoService.deleteDominioMedico(dniMedico, cupsServicioMedico)
                            .stream()
                            .map(ServicioMedicoEntradaLista::of)
                            .toList()
                    );
        }
        catch (Exception e) {
            throw new RuntimeException("Error al eliminar el dominio: " + e.getMessage(), e);
        }
    }

    /**
     * Endpoint para determinar si el médico pertenece a la IPS del administrador actual.
     * @param dniMedico El DNI del médico a verificar.
     * @return true si el médico pertenece a la IPS del administrador, false en caso contrario.
     * @throws RuntimeException Si ocurre un error al verificar la pertenencia del médico a la IPS.
     */
    private boolean isAdmIpsOfDniMedico(Long dniMedico) {
        Authentication authentification = SecurityContextHolder.getContext().getAuthentication();
        Integer idIpsAdm = admIpsService.findIdIpsByEmail(authentification.getName());
        List<Integer> idIpsList = trabajaService.findAllIdIpsByDniMedico(dniMedico);
        return idIpsList.contains(idIpsAdm);
    }

}
