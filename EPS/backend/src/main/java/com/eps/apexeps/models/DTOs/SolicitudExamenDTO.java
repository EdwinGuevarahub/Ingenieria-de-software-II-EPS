package com.eps.apexeps.models.DTOs;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Data;

@Data
public class SolicitudExamenDTO {
    private Long     dniPaciente;
    private Integer  agendaOrden;
    private String   cupsServicio;

    private Long     dniMedico;
    private Integer  idConsultorio;

    private LocalDate fecha;
    private LocalTime hora;
}

