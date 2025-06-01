package com.eps.apexeps.models.DTOs;

import java.util.List;

import com.eps.apexeps.models.entity.relations.DetalleFormula;

// Resultado de la cita (agenda) y diagnosticos generados
public class ResultadoDiagnosticoDTO {
    private Integer agendaId;
    private String resultadoAgenda;
    private String diagnostico;
    private String observacion;

    // Uno u otro
    private List<DetalleFormula> medicamentos;
    private String servicioMedico;

    public Integer getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Integer agendaId) {
        this.agendaId = agendaId;
    }

    public String getResultadoAgenda() {
        return resultadoAgenda;
    }

    public void setResultadoAgenda(String resultado_agenda) {
        this.resultadoAgenda = resultado_agenda;
    }

        public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getObservacion() {
        return observacion;
    }

    public void setObservacion(String observacion) {
        this.observacion = observacion;
    }

    public List<DetalleFormula> getMedicamentos() {
        return medicamentos;
    }

    public void setMedicamentos(List<DetalleFormula> medicamentos) {
        this.medicamentos = medicamentos;
    }

    public String getServicioMedico() {
        return servicioMedico;
    }

    public void setServicioMedico(String servicioMedico) {
        this.servicioMedico = servicioMedico;
    }
}
