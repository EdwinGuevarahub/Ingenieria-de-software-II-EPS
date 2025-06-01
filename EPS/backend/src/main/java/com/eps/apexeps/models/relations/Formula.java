package com.eps.apexeps.models.relations;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table formula {
//   agenda_formula integer [pk]
//   diagnostico_formula varchar(10) [pk]
//   obs_formula text [null]
// }
// ref: formula.(agenda_formula, diagnostico_formula) > genera.(agenda_genera, diagnostico_genera)


/**
 * Esta clase representa la relación Formula en la base de datos.
 * Se utiliza para mapear la tabla 'formula' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "formula")
public class Formula {

    @Id
    private FormulaId id;

    @Column(
        name = "obs_formula",
        columnDefinition = "text"
    )
    private String observaciones;
    
    /** 
     * Relación uno a muchos con la relación DetalleFormula.
     * Representa la relación entre la fórmula y los detalles de la fórmula.
     * Se utiliza para mapear la tabla 'detalle_formula' y sus columnas a un objeto Java.
     * No se puede modificar la relación desde aquí, ya que es una relación de solo lectura.
     * Sólo se carga cuando se necesita (Lazy Loading).
     */
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumns({
        @JoinColumn(
            name = "agenda_detallef",
            referencedColumnName = "agenda_formula",
            nullable = false,
            insertable = false,
            updatable = false
        ),
        @JoinColumn(
            name = "diagnostico_detallef",
            referencedColumnName = "diagnostico_formula",
            nullable = false,
            insertable = false,
            updatable = false
        )}
    )
    private List<DetalleFormula> detalles;
    
}
