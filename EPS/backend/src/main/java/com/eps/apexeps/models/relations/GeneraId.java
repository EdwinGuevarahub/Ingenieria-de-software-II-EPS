package com.eps.apexeps.models.relations;

import com.eps.apexeps.models.Diagnostico;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import java.io.Serializable;
import jakarta.persistence.*;

// Clase para la clave compuesta de Genera
@Embeddable
public class GeneraId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "agenda_genera")
    private Long agendaGenera;

    @Column(name = "diagnostico_genera")
    private String diagnosticoGenera;

    // Constructor vacío necesario para JPA
    public GeneraId() {
    }

    public GeneraId(Long agendaGenera, String diagnosticoGenera) {
        this.agendaGenera = agendaGenera;
        this.diagnosticoGenera = diagnosticoGenera;
    }

    // Getters y setters
    public Long getAgendaGenera() {
        return agendaGenera;
    }

    public void setAgendaGenera(Long agendaGenera) {
        this.agendaGenera = agendaGenera;
    }

    public String getDiagnosticoGenera() {
        return diagnosticoGenera;
    }

    public void setDiagnosticoGenera(String diagnosticoGenera) {
        this.diagnosticoGenera = diagnosticoGenera;
    }

    // equals y hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        GeneraId generaId = (GeneraId) o;
        return agendaGenera.equals(generaId.agendaGenera) &&
               diagnosticoGenera.equals(generaId.diagnosticoGenera);
    }

    @Override
    public int hashCode() {
        return agendaGenera.hashCode() + diagnosticoGenera.hashCode();
    }
}
