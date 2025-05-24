package com.eps.apexeps.models.DTOs;

//package com.eps.apexeps.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.Data;


@Data
public class SolicitudCitaDTO {
    private Long     dniPaciente;
    private Long     dniMedico;
    private Integer  idConsultorio;
    private LocalDate fecha;
    private LocalTime hora;
    private List<String> cupsServicios;
}
