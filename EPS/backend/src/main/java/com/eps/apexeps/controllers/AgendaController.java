package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.response.AgendaEntradaLista;
import com.eps.apexeps.services.AgendaService;

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

    /**
     * Endpoint para obtener todas las agendas de la base de datos asociadas a un paciente.
     * @param dniPaciente El DNI del paciente.
     * @param dniNombreMedicoLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha (dd-MM-yyyy) La fecha de la cita (opcional).
     * @param horaDeInicio (HH:mm) Inicio del filtro por hora (opcional).
     * @param horaDeFin (HH:mm) Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de agendas.
     */
    @GetMapping("/paciente/{dniPaciente}")
    public List<AgendaEntradaLista> getAllAgendasPaciente(
        @PathVariable Long dniPaciente,
        @RequestParam(required = false) String dniNombreMedicoLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) String fecha,
        @RequestParam(required = false) String horaDeInicio,
        @RequestParam(required = false) String horaDeFin,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        return agendaService
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
                )
                .stream()
                .map(AgendaEntradaLista::of)
                .toList();
    }

    /**
     * Endpoint para obtener todas las agendas de la base de datos asociadas a un médico.
     * @param dniMedico El DNI del médico.
     * @param dniNombrePacienteLike Cadena que se usará para filtrar los pacientes por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha (dd-MM-yyyy) La fecha de la cita (opcional).
     * @param horaDeInicio (HH:mm) Inicio del filtro por hora (opcional).
     * @param horaDeFin (HH:mm) Fin del filtro por hora (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de agendas.
     */
    @GetMapping("/medico/{dniMedico}")
    public List<AgendaEntradaLista> getAllAgendasMedico(
        @PathVariable Long dniMedico,
        @RequestParam(required = false) String dniNombrePacienteLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) String fecha,
        @RequestParam(required = false) String horaDeInicio,
        @RequestParam(required = false) String horaDeFin,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        return agendaService
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
                )
                .stream()
                .map(AgendaEntradaLista::of)
                .toList();
    }

    /**
     * Endpoint para obtener una agenda por su ID.
     * @param id El ID de la agenda.
     * @return La agenda correspondiente al ID proporcionado o null si no se encuentra.
     */
    @GetMapping("/{id}")
    public Agenda getAgendaById(@PathVariable Integer id) {
        return agendaService.getAgendaById(id);
    }

    /**
     * Método para actualizar la fecha y la relación trabaja de una agenda.
     * @param agenda La agenda a actualizar.
     * @return La agenda actualizada.
     * @throws RuntimeException Si ocurre un error al actualizar la agenda.
     */
    @PutMapping("/update/trabajaFecha")
    public Agenda updateTrabajaFechaAgenda(@RequestParam Agenda agenda) {
        try {
            return agendaService.updateTrabajaFechaAgenda(agenda);
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar la relación trabaja o la fecha de la agenda: " + e.getMessage(), e);
        }
    }
    
}
