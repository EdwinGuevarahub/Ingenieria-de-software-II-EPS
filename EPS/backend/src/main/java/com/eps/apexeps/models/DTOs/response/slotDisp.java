package com.eps.apexeps.models.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class slotDisp {
    private Long dniMedico;
    private String nombreMedico;
    private Integer idConsultorio;
    private LocalDate fecha;
    private LocalTime hora;
}
