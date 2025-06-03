package com.eps.apexeps.models.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table consultorio {
//   ips_consultorio integer [pk, ref: > ips.id_ips]
//   id_consultorio integer [pk]
//   sermed_consultorio integer [not null, ref: > servicio_medico.cups_sermed]
// }

/**
 * Esta clase representa la entidad Consultorio en la base de datos.
 * Se utiliza para mapear la tabla 'consultorio' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "consultorio")
public class Consultorio {

    @EmbeddedId
    private ConsultorioId id;

    @ManyToOne
    @JoinColumn(
        name = "sermed_consultorio",
        referencedColumnName = "cups_sermed",
        nullable = false
    )
    private ServicioMedico servicioMedico;

    
}
