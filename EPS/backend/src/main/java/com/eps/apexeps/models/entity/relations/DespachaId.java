package com.eps.apexeps.models.entity.relations;

import java.time.Instant;

import com.eps.apexeps.models.entity.users.Paciente;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Builder
public class DespachaId {
    
    @ManyToOne
    @JoinColumn(
        name = "paciente_despacha",
        referencedColumnName = "dni_paciente",
        nullable = false
    )
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(
        name = "inventaria_despacha",
        referencedColumnName = "id_inventaria",
        nullable = false
    )
    private Inventaria inventaria;

    @Column(
        name = "f_despacha",
        nullable = false
    )
    private Instant fecha;
    
}
