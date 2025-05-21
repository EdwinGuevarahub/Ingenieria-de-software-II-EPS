package com.eps.apexeps.models.DTOs;

import java.time.Instant;

import com.eps.apexeps.models.relations.Agenda;

public class AgendaDTO {
    private Integer id;
    private Instant fecha;
    
    // Constructor para mapear desde Agenda
    public AgendaDTO(Agenda agenda) {
        this.id = agenda.getId();
        this.fecha = agenda.getFecha();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Instant getFecha() {
        return fecha;
    }

    public void setFecha(Instant fecha) {
        this.fecha = fecha;
    }
    
}
