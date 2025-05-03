package com.eps.apexeps.models;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

// Table consultorio {
//   ips_consultorio integer [pk, ref: > ips.id_ips]
//   id_consultorio integer [pk]
//   sermed_consultorio integer [not null, ref: > servicio_medico.cups_sermed]
// }

public class Consultorio {

    @Id
    private ConsultorioId id;

    @ManyToOne
    @JoinColumn(
        name = "sermed_consultorio",
        referencedColumnName = "cups_sermed",
        nullable = false
    )
    private ServicioMedico servicioMedico;

    
}
