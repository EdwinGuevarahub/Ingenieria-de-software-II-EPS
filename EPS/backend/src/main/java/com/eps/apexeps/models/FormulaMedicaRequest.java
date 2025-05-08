package com.eps.apexeps.models;
import java.util.List;

// DTO principal para la solicitud
public class FormulaMedicaRequest {
    private Long agendaId;
    private String resultadoAgenda;
    private List<DiagnosticoDTO> diagnosticos;

    // Getters y setters
    public Long getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Long agendaId) {
        this.agendaId = agendaId;
    }

    public String getResultadoAgenda() {
        return resultadoAgenda;
    }

    public void setResultadoAgenda(String resultadoAgenda) {
        this.resultadoAgenda = resultadoAgenda;
    }

    public List<DiagnosticoDTO> getDiagnosticos() {
        return diagnosticos;
    }

    public void setDiagnosticos(List<DiagnosticoDTO> diagnosticos) {
        this.diagnosticos = diagnosticos;
    }
}
