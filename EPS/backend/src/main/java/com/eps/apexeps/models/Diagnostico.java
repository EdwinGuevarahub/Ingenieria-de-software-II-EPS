package com.eps.apexeps.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table diagnostico {
//   cie_diagnostico varchar(10) [pk]
//   nom_diagnostico varchar(255) [not null]
//   desc_diagnostico text [null]
// }

/**
 * Esta clase representa la entidad Diagnostico en la base de datos.
 * Se utiliza para mapear la tabla 'diagnostico' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "diagnostico")
public class Diagnostico {

    @Id
    @Column(
        name = "cie_diagnostico",
        length = 10,
        nullable = false
    )
    private String cie;

    @NotEmpty
    @Column(
        name = "nom_diagnostico",
        length = 255,
        nullable = false
    )
    private String nombre;

    @Column(
        name = "desc_diagnostico",
        columnDefinition = "text"
    )
    private String descripcion;
    
}
