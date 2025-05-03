package com.eps.apexeps.models.relations;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table detalle_formula {
//   agenda_detallef integer [pk]
//   diagnostico_detallef varchar(10) [pk]
//   id_detallef integer [pk]
//   medicamento_detallef varchar(20) [not null, ref: > medicamento.id_medicamento]
//   cantidad_detallef integer [not null]
//   dosis_detallef varchar(100) [not null]
//   duracion_detallef varchar(100) [not null]
// }
// ref: detalle_formula.(agenda_detallef, diagnostico_detallef) > formula.(agenda_formula, diagnostico_formula)

/**
 * Esta clase representa la clave primaria compuesta de la relación DetalleFormula en la base de datos.
 * Se utiliza para mapear la tabla 'detalle_formula' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DetalleFormulaId {
    
    @ManyToOne
    @JoinColumns({
        @JoinColumn(
            name = "agenda_detallef",
            referencedColumnName = "agenda_formula",
            nullable = false
        ),
        @JoinColumn(
            name = "diagnostico_detallef",
            referencedColumnName = "diagnostico_formula",
            nullable = false
        )
    })
    private Formula formula;
    
    @Column(
        name = "id_detallef",
        nullable = false
    )
    private Integer id;

}
