package com.eps.apexeps.models.relations;

import com.eps.apexeps.models.Medicamento;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
 * Esta clase representa la relación DetalleFormula en la base de datos.
 * Se utiliza para mapear la tabla 'detalle_formula' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "detalle_formula")
public class DetalleFormula {

    // Se ignora la relación para evitar problemas de recursividad al serializar a JSON.
    @JsonIgnore
    @Id
    private DetalleFormulaId id;

    @ManyToOne
    @JoinColumn(
        name = "medicamento_detallef",
        referencedColumnName = "id_medicamento",
        nullable = false
    )
    private Medicamento medicamento;

    @Column(
        name = "cantidad_detallef",
        nullable = false
    )
    private Integer cantidad;

    @Column(
        name = "dosis_detallef",
        length = 100,
        nullable = false
    )
    private String dosis;

    @Column(
        name = "duracion_detallef",
        length = 100,
        nullable = false
    )
    private String duracion;

}
