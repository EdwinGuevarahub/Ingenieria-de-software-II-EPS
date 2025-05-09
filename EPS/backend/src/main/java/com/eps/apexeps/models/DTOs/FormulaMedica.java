package com.eps.apexeps.models.DTOs;

import java.util.List;

import com.eps.apexeps.models.relations.DetalleFormula;

// Formula medica
public class FormulaMedica {
    private String diagnostico;
    private String observacion;
    private List<DetalleFormula> medicamentos;

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

}
