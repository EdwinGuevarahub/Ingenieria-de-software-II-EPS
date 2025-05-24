package com.eps.apexeps.models.entity.relations;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table despacha {
//   paciente_despacha bigint [pk, ref: > paciente.dni_paciente]
//   inventaria_despacha integer [pk, ref: > inventaria.id_inventaria]
//   f_despacha timestamp [pk]
// }

/**
 * Esta clase representa la relación Despacha en la base de datos.
 * Se utiliza para mapear la tabla 'despacha' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "despacha")
public class Despacha {

    @Id
    private DespachaId id;
    
}
