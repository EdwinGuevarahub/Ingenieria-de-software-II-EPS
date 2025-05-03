package com.eps.apexeps.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table servicio_medico {
//   cups_sermed varchar(10) [pk]
//   nom_sermed varchar(100) [not null]
//   desc_sermed text [null]
//   tarifa_sermed numeric(10,2) [not null]
// }

/**
 * Esta clase representa la entidad ServicioMedico en la base de datos.
 * Se utiliza para mapear la tabla 'servicio_medico' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "servicio_medico")
public class ServicioMedico {

    @Id
    @Column(
        name = "cups_sermed",
        length = 10,
        nullable = false
    )
    private String cups;

    @Column(
        name = "nom_sermed",
        length = 100,
        nullable = false
    )
    private String nombre;

    @Column(
        name = "desc_sermed",
        columnDefinition = "text"
    )
    private String descripcion;

    @Column(
        name = "tarifa_sermed",
        nullable = false,
        columnDefinition = "numeric(10,2)"
    )
    private Double tarifa;

}
