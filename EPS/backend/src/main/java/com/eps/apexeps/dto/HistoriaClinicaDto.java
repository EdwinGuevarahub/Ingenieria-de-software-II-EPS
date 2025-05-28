package com.eps.apexeps.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class HistoriaClinicaDto {
    private Integer agendaId;
    private LocalDateTime fecha;
    private String estado;
    private String resultado;
    private List<DiagnosticoDto> diagnosticos;
    private List<MedicamentoDto> medicamentos;
    private List<ExamenDto> examenes;

    @Data
    public static class DiagnosticoDto {
        private String codigo;
        private String nombre;
        private String observacion;
    }

    @Data
    public static class MedicamentoDto {
        private String nombre;
        private String dosis;
        private Integer cantidad;
        private String duracion;
    }

    @Data
    public static class ExamenDto {
        private String servicio;
        private String nombre;
        private Boolean ordenado;
    }
}