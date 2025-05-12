package com.eps.apexeps.controllers;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public List<AgendaEntradaLista> getAllAgendas(
        @PathVariable Long dniPaciente,
        @RequestParam(required = false) String dniNombreMedicoLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) String fecha,
        @RequestParam(required = false) String horaDeInicio,
        @RequestParam(required = false) String horaDeFin,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        if (fecha != null)
            try {
                LocalDate.parse(fecha, DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            } catch (Exception e) {
                throw new IllegalArgumentException("Fecha inválida. Formato esperado: dd-MM-yyyy");
            }

        if (horaDeInicio != null)
            try {
                LocalTime.parse(horaDeInicio, DateTimeFormatter.ofPattern("HH:mm"));
            } catch (Exception e) {
                throw new IllegalArgumentException("Hora de inicio inválida. Formato esperado: HH:mm");
            }

        if (horaDeFin != null)
        try {
            LocalTime.parse(horaDeFin, DateTimeFormatter.ofPattern("HH:mm"));
        } catch (Exception e) {
            throw new IllegalArgumentException("Hora de fin inválida. Formato esperado: HH:mm");
        }

        return agendaService
                .getAgendasPaciente(
                    dniPaciente,
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
    
}
