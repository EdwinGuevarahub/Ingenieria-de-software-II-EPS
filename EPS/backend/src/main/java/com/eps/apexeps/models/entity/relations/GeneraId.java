package com.eps.apexeps.models.entity.relations;

import com.eps.apexeps.models.entity.Diagnostico;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
 * Esta clase representa la clave primaria compuesta de la relación Genera en la base de datos.
 * Se utiliza para mapear la tabla 'genera' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeneraId {

    // Se ignora la relación para evitar problemas de recursividad al serializar a JSON.
    @JsonIgnore
    @ManyToOne
    @JoinColumn(
        name = "agenda_genera",
        referencedColumnName = "id_agenda",
        nullable = false
    )
    private Agenda agenda;

    @ManyToOne
    @JoinColumn(
        name = "diagnostico_genera",
        referencedColumnName = "cie_diagnostico",
        nullable = false
    )
    private Diagnostico diagnostico;
    
}
