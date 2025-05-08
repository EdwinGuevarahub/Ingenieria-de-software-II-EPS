package com.eps.apexeps.models.relations;

import com.eps.apexeps.models.Medicamento;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_formula")
public class DetalleFormula {
    @EmbeddedId
    private DetalleFormulaId id;

    @Column(name = "medicamento_detallef", nullable = false)
    private String medicamentoDetallef;

    @Column(name = "cantidad_detallef", nullable = false)
    private Integer cantidadDetallef;

    @Column(name = "dosis_detallef", nullable = false)
    private String dosisDetallef;

    @Column(name = "duracion_detallef", nullable = false)
    private String duracionDetallef;

    // Getters y setters
    public DetalleFormulaId getId() {
        return id;
    }

    public void setId(DetalleFormulaId id) {
        this.id = id;
    }

    public String getMedicamentoDetallef() {
        return medicamentoDetallef;
    }

    public void setMedicamentoDetallef(String medicamentoDetallef) {
        this.medicamentoDetallef = medicamentoDetallef;
    }

    public Integer getCantidadDetallef() {
        return cantidadDetallef;
    }

    public void setCantidadDetallef(Integer cantidadDetallef) {
        this.cantidadDetallef = cantidadDetallef;
    }

    public String getDosisDetallef() {
        return dosisDetallef;
    }

    public void setDosisDetallef(String dosisDetallef) {
        this.dosisDetallef = dosisDetallef;
    }

    public String getDuracionDetallef() {
        return duracionDetallef;
    }

    public void setDuracionDetallef(String duracionDetallef) {
        this.duracionDetallef = duracionDetallef;
    }
}
