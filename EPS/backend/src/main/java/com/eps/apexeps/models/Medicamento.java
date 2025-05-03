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

// Table medicamento {
//   id_medicamento varchar(20) [pk]
//   nom_medicamento varchar(100) [not null]
// }

/**
 * Esta clase representa la entidad Medicamento en la base de datos.
 * Se utiliza para mapear la tabla 'medicamento' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "medicamento")
public class Medicamento {

    @Id
    @Column(
        name = "id_medicamento",
        length = 20,
        nullable = false
    )
    private String id;

    @NotEmpty
    @Column(
        name = "nom_medicamento",
        length = 100,
        nullable = false
    )
    private String nombre;
    
}
