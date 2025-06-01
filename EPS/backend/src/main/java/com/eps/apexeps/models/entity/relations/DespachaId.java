package com.eps.apexeps.models.entity.relations;

import java.io.Serializable;
import java.time.Instant;

//import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table despacha {
//   paciente_despacha bigint [pk, ref: > paciente.dni_paciente]
//   inventaria_despacha integer [pk, ref: > inventaria.id_inventaria]
//   f_despacha timestamp [pk]
// }

/**
 * Esta clase representa la clave primaria compuesta de la relación Despacha en la base de datos.
 * Se utiliza para mapear la tabla 'despacha' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Builder
public class DespachaId implements Serializable {
    private Long paciente;
    private Integer inventaria;
    private Instant fecha;
}
