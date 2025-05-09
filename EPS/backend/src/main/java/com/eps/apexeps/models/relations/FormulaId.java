package com.eps.apexeps.models.relations;

import com.eps.apexeps.models.Diagnostico;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table formula {
//   agenda_formula integer [pk, ref: > agenda.id_agenda]
//   diagnostico_formula varchar(10) [pk, ref: > diagnostico.cie_diagnostico]
//   obs_formula text [null]
// }

/**
 * Esta clase representa la clave primaria compuesta de la relación Formula en la base de datos.
 * Se utiliza para mapear la tabla 'formula' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormulaId {

    // Se ignora la relación para evitar problemas de recursividad al serializar a JSON.
    @JsonIgnore
    @ManyToOne
    @JoinColumn(
        name = "agenda_formula",
        referencedColumnName = "id_agenda",
        nullable = false
    )
    private Agenda agenda;

    @ManyToOne
    @JoinColumn(
        name = "diagnostico_formula",
        referencedColumnName = "cie_diagnostico",
        nullable = false
    )
    private Diagnostico diagnostico;
    
}
