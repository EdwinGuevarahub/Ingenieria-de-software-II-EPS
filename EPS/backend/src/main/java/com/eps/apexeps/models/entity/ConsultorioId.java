package com.eps.apexeps.models.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table consultorio {
//   ips_consultorio integer [pk, ref: > ips.id_ips]
//   id_consultorio integer [pk]
//   sermed_consultorio integer [not null, ref: > servicio_medico.id_sermed]
// }

/**
 * Esta clase representa la clave primaria compuesta de la entidad Consultorio en la base de datos.
 * Se utiliza para mapear la tabla 'consultorio' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia.
 * @author Nicolás Sabogal
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultorioId {

    @ManyToOne
    @JoinColumn(
        name = "ips_consultorio",
        referencedColumnName = "id_ips",
        nullable = false
    )
    private Ips ips;

    @Column(
        name = "id_consultorio",
        nullable = false
    )
    private Integer idConsultorio;
    
}
