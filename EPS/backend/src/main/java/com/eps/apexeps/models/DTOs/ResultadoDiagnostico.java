package com.eps.apexeps.models.DTOs;

import java.util.List;

// Resultado de la cita (agenda) y diagnosticos generados
public class ResultadoDiagnostico {
    private Long agendaId;
    private String resultadoAgenda;
    private List<FormulaMedica> diagnosticos;

    public Long getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Long agendaId) {
        this.agendaId = agendaId;
    }

    public String getResultadoAgenda() {
        return resultadoAgenda;
    }

    public void setResultadoAgenda(String resultado_agenda) {
        this.resultadoAgenda = resultado_agenda;
    }

    public List<FormulaMedica> getDiagnosticos() {
        return diagnosticos;
    }

    public void setDiagnosticos(List<FormulaMedica> diagnosticos) {
        this.diagnosticos = diagnosticos;
    }
}
