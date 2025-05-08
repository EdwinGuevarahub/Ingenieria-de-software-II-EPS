package com.eps.apexeps.models.relations;

import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "formula")
public class Formula {
    @EmbeddedId
    private FormulaId id;

    @Column(name = "obs_formula")
    private String obsFormula;

    // Getters y setters
    public FormulaId getId() {
        return id;
    }

    public void setId(FormulaId id) {
        this.id = id;
    }

    public String getObsFormula() {
        return obsFormula;
    }

    public void setObsFormula(String obsFormula) {
        this.obsFormula = obsFormula;
    }
}
