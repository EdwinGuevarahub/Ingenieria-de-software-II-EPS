package com.eps.apexeps.models;
import java.util.List;

public class DiagnosticoDTO {
    private String diagnostico;
    private String observacion;
    private List<MedicamentoDTO> medicamentos;

    // Getters y setters
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

    public List<MedicamentoDTO> getMedicamentos() {
        return medicamentos;
    }

    public void setMedicamentos(List<MedicamentoDTO> medicamentos) {
        this.medicamentos = medicamentos;
    }
}
