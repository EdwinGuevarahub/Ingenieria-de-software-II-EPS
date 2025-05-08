package com.eps.apexeps.models.relations;


import jakarta.persistence.*;
import java.io.Serializable;

// Clase para la clave compuesta de DetalleFormula
@Embeddable
public class DetalleFormulaId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "agenda_detallef")
    private Long agendaDetallef;

    @Column(name = "diagnostico_detallef")
    private String diagnosticoDetallef;

    @Column(name = "id_detallef")
    private Integer idDetallef;

    // Constructor vacío necesario para JPA
    public DetalleFormulaId() {
    }

    public DetalleFormulaId(Long agendaDetallef, String diagnosticoDetallef, Integer idDetallef) {
        this.agendaDetallef = agendaDetallef;
        this.diagnosticoDetallef = diagnosticoDetallef;
        this.idDetallef = idDetallef;
    }

    // Getters y setters
    public Long getAgendaDetallef() {
        return agendaDetallef;
    }

    public void setAgendaDetallef(Long agendaDetallef) {
        this.agendaDetallef = agendaDetallef;
    }

    public String getDiagnosticoDetallef() {
        return diagnosticoDetallef;
    }

    public void setDiagnosticoDetallef(String diagnosticoDetallef) {
        this.diagnosticoDetallef = diagnosticoDetallef;
    }

    public Integer getIdDetallef() {
        return idDetallef;
    }

    public void setIdDetallef(Integer idDetallef) {
        this.idDetallef = idDetallef;
    }

    // equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DetalleFormulaId that = (DetalleFormulaId) o;
        return agendaDetallef.equals(that.agendaDetallef) &&
               diagnosticoDetallef.equals(that.diagnosticoDetallef) &&
               idDetallef.equals(that.idDetallef);
    }

    @Override
    public int hashCode() {
        return agendaDetallef.hashCode() + diagnosticoDetallef.hashCode() + idDetallef.hashCode();
    }
}
