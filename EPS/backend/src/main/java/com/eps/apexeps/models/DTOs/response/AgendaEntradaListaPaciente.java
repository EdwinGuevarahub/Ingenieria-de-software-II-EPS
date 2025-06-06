package com.eps.apexeps.models.DTOs.response;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import com.eps.apexeps.models.entity.relations.Agenda;

import lombok.Builder;
import lombok.Data;

/**
 * Clase de respuesta que representa una entrada de la lista de agendas.
 * Se utiliza para enviar información sobre una cita médica.
 * @author Nicolás Sabogal
 */
@Data
@Builder
public class AgendaEntradaListaPaciente {

    /** Identificador único de la agenda. */
    private Integer idAgenda;

    /** Fecha de la cita. */
    private String fecha;
    /** Hora de inicio de la cita. */
    private LocalTime horaInicio;
    /** Nombre de la IPS asociada a la cita. */
    private String nombreIps;
    /** Nombre del consultorio asociado a la cita. */
    private String nombreServicioMedico;
    /** Nombre del médico asignado a la cita. */
    private String nombreMedico;

    /**
     * Método estático para crear una instancia de AgendaEntradaLista a partir de una entidad Agenda.
     * @param agenda La entidad Agenda de la que se creará la instancia.
     * @return Una nueva instancia de AgendaEntradaLista.
     */
    public static AgendaEntradaListaPaciente of(Agenda agenda) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        return AgendaEntradaListaPaciente.builder()
                .idAgenda(agenda.getId())
                // TODO: Revisar cómo determinar la zona horaria. Hotfix: Quemar UTC-5
                .fecha(agenda.getFecha().atZone(ZoneId.of("UTC-5")).toLocalDate().format(formatter))
                .horaInicio(agenda.getFecha().atZone(ZoneId.of("UTC-5")).toLocalTime())
                .nombreIps(agenda.getTrabaja().getConsultorio().getId().getIps().getNombre())
                .nombreServicioMedico(agenda.getTrabaja().getConsultorio().getServicioMedico().getNombre())
                .nombreMedico(agenda.getTrabaja().getMedico().getNombre())
                .build();
    }

}
