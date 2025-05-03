package com.eps.apexeps.models.relations;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table genera {
//   agenda_genera integer [pk, ref: > agenda.id_agenda]
//   diagnostico_genera varchar(10) [pk, ref: > diagnostico.cie_diagnostico]
//   obs_genera text [null]
// }

/**
 * Esta clase representa la relación Genera en la base de datos.
 * Se utiliza para mapear la tabla 'genera' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "genera")
public class Genera {

    @Id
    private GeneraId id;

    @Column(
        name = "obs_genera",
        columnDefinition = "text"
    )
    private String observaciones;
    
}
