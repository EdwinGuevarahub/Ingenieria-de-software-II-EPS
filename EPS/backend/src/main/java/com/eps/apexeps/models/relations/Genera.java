package com.eps.apexeps.models.relations;

import jakarta.persistence.*;

@Entity
@Table(name = "genera")
public class Genera {
    @EmbeddedId
    private GeneraId id;

    @Column(name = "obs_genera")
    private String obsGenera;

    // Getters y setters
    public GeneraId getId() {
        return id;
    }

    public void setId(GeneraId id) {
        this.id = id;
    }

    public String getObsGenera() {
        return obsGenera;
    }

    public void setObsGenera(String obsGenera) {
        this.obsGenera = obsGenera;
    }
}
