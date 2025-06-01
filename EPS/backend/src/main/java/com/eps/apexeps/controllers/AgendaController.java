package com.eps.apexeps.controllers;

import com.eps.apexeps.models.DTOs.SolicitudCitaDTO;
import com.eps.apexeps.models.DTOs.SolicitudExamenDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.entity.relations.Agenda;
import com.eps.apexeps.models.DTOs.response.AgendaEntradaListaMedico;
import com.eps.apexeps.models.DTOs.response.AgendaEntradaListaPaciente;
import com.eps.apexeps.models.DTOs.response.AgendaListaMedico;
import com.eps.apexeps.models.DTOs.response.AgendaListaPaciente;
import com.eps.apexeps.models.auth.ERol;
import com.eps.apexeps.services.AgendaService;
import com.eps.apexeps.services.MedicoService;
import com.eps.apexeps.services.PacienteService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para manejar las operaciones relacionadas con la agenda de una IPS.
 * Proporciona endpoints para obtener y actualizar la agenda.
 * @author Nicolás Sabogal
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/agenda")
public class AgendaController {

    /** Servicio de agenda para manejar la lógica de negocio. */
    private final AgendaService agendaService;

    /** Servicio de paciente para manejar la lógica relacionada con los pacientes. */
    private final PacienteService pacienteService;

    /** Servicio de médico para manejar la lógica relacionada con los médicos. */
    private final MedicoService medicoService;

    /**
     * Endpoint para obtener todas las agendas de la base de datos asociadas a un paciente.
     * @param dniPaciente El DNI del paciente (ilegal si el usuario es un paciente, ya que se obtiene de la sesión).
     * @param dniNombreMedicoLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha (dd-MM-yyyy) La fecha de la cita (opcional).
     * @param horaDeInicio (HH:mm) Inicio del filtro por hora (opcional).
     * @param horaDeFin (HH:mm) Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de agendas.
     */
    @GetMapping("/paciente")
    public ResponseEntity<AgendaListaPaciente> getAllAgendasPaciente(
        @RequestParam(required = false) Long dniPaciente,
        @RequestParam(required = false) String dniNombreMedicoLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) String fecha,
        @RequestParam(required = false) String horaDeInicio,
        @RequestParam(required = false) String horaDeFin,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(ERol.PACIENTE.name()))
           ) {
            // El paciente no debe proporcionar un DNI, ya que se obtiene de la sesión y no está autorizado a modificarlo.
            if (dniPaciente != null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

            dniPaciente = pacienteService.findDniByEmail(authentication.getName());
        }

        Page<Agenda> entradas = agendaService
                                .getAgendas(
                                    dniPaciente,
                                    null,
                                    null,
                                    dniNombreMedicoLike,
                                    cupsServicioMedico,
                                    fecha,
                                    horaDeInicio,
                                    horaDeFin,
                                    qSize,
                                    qPage
                                );

        return ResponseEntity.ok(
                        new AgendaListaPaciente(
                            entradas.getTotalPages(),
                            entradas.stream()
                                    .map(AgendaEntradaListaPaciente::of)
                                    .toList()
                        )
                    );
    }

    /**
     * Endpoint para obtener todas las agendas de la base de datos asociadas a un médico.
     * @param dniMedico El DNI del médico (ilegal si el usuario es un médico, ya que se obtiene de la sesión).
     * @param dniNombrePacienteLike Cadena que se usará para filtrar los pacientes por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha (dd-MM-yyyy) La fecha de la cita (opcional).
     * @param horaDeInicio (HH:mm) Inicio del filtro por hora (opcional).
     * @param horaDeFin (HH:mm) Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de agendas.
     */
    @GetMapping("/medico")
    public ResponseEntity<AgendaListaMedico> getAllAgendasMedico(
        @RequestParam(required = false) Long dniMedico,
        @RequestParam(required = false) String dniNombrePacienteLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) String fecha,
        @RequestParam(required = false) String horaDeInicio,
        @RequestParam(required = false) String horaDeFin,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication
                .getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(ERol.MEDICO.name()))
           ) {
            // El paciente no debe proporcionar un DNI, ya que se obtiene de la sesión y no está autorizado a modificarlo.
            if (dniMedico != null)
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

            dniMedico = medicoService.findDniByEmail(authentication.getName());
        }

        Page<Agenda> entradas = agendaService
                                .getAgendas(
                                    null,
                                    dniMedico,
                                    dniNombrePacienteLike,
                                    null,
                                    cupsServicioMedico,
                                    fecha,
                                    horaDeInicio,
                                    horaDeFin,
                                    qSize,
                                    qPage
                                );

        return ResponseEntity.ok(
                    new AgendaListaMedico(
                        entradas.getTotalPages(),
                        entradas.stream()
                                .map(AgendaEntradaListaMedico::of)
                                .toList()
                    )
                );
    }

    /**
     * Endpoint para obtener una agenda por su ID.
     * @param id El ID de la agenda.
     * @return La agenda correspondiente al ID proporcionado o null si no se encuentra.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Agenda> getAgendaById(@PathVariable Integer id) {
        return ResponseEntity.ok(agendaService.getAgendaById(id));
    }

    /**
     * Método para actualizar la fecha y la relación trabaja de una agenda.
     * @param agenda La agenda a actualizar.
     * @return La agenda actualizada.
     * @throws RuntimeException Si ocurre un error al actualizar la agenda.
     */
    @PutMapping("/update/trabajaFecha")
    public ResponseEntity<Agenda> updateTrabajaFechaAgenda(@RequestParam Agenda agenda) {
        try {
            return ResponseEntity.ok(agendaService.updateTrabajaFechaAgenda(agenda));
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar la relación trabaja o la fecha de la agenda: " + e.getMessage(), e);
        }
    }

    /**
     * Método para cancelar la cita de una agenda por su ID.
     * @param id El ID de la agenda.
     * @return la agenda actualizada.
     * @throws RuntimeException Si ocurre un error al actualizar la agenda.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Agenda> cancelarAgenda(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(agendaService.cancelarAgendaById(id));
        } catch (Exception e) {
            throw new RuntimeException("Error al cancelar la cita de la agenda: " + e.getMessage(), e);
        }
    }

    @PostMapping("/citas")
    public Agenda solicitarCita(@RequestBody SolicitudCitaDTO dto) {
        try{
            return agendaService.registrarCita(dto);
        } catch (IllegalStateException e) {
            throw new RuntimeException("El paciente no tiene afiliación activa, no puede solicitar citas: " + e.getMessage(), e);
        } catch (IllegalArgumentException e){
            throw new RuntimeException("Error al solicitar la cita, el paciente no existe: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error al solicitar la cita, verifique los datos: " + e.getMessage(), e);
        }
    }

    @PostMapping("/examenes")
    public Agenda solicitarExamen(@RequestBody SolicitudExamenDTO dto) {
        try{
            return agendaService.registrarExamen(dto);
        } catch (IllegalStateException e) {
            throw new RuntimeException("El paciente no tiene afiliación activa, no puede solicitar citas: " + e.getMessage(), e);
        } catch (IllegalArgumentException e){
            throw new RuntimeException("Error al solicitar la cita, el paciente no existe: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Error al solicitar la cita, verifique los datos: " + e.getMessage(), e);
        }
    }

}
