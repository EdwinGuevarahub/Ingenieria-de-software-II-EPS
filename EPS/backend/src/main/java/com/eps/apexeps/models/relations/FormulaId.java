package com.eps.apexeps.models.relations;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;

@Embeddable
public class FormulaId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "agenda_formula")
    private Long agendaFormula;

    @Column(name = "diagnostico_formula")
    private String diagnosticoFormula;

    // Constructor vacío necesario para JPA
    public FormulaId() {
    }

    public FormulaId(Long agendaFormula, String diagnosticoFormula) {
        this.agendaFormula = agendaFormula;
        this.diagnosticoFormula = diagnosticoFormula;
    }

    // Getters y setters
    public Long getAgendaFormula() {
        return agendaFormula;
    }

    public void setAgendaFormula(Long agendaFormula) {
        this.agendaFormula = agendaFormula;
    }

    public String getDiagnosticoFormula() {
        return diagnosticoFormula;
    }

    public void setDiagnosticoFormula(String diagnosticoFormula) {
        this.diagnosticoFormula = diagnosticoFormula;
    }

    // equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FormulaId formulaId = (FormulaId) o;
        return agendaFormula.equals(formulaId.agendaFormula) &&
               diagnosticoFormula.equals(formulaId.diagnosticoFormula);
    }

    @Override
    public int hashCode() {
        return agendaFormula.hashCode() + diagnosticoFormula.hashCode();
    }
}
