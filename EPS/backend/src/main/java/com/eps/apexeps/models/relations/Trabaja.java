package com.eps.apexeps.models.relations;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.users.Medico;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table trabaja {
//   id_trabaja serial [pk]
//   medico_trabaja bigint [not null, ref: > medico.dni_medico]
//   ips_trabaja integer [not null]
//   consultorio_trabaja integer [not null]
//   horario_trabaja varchar(48) [not null, note: 'L00-23,M00-23,R00-23,J00-23,V00-23,S00-23,D00-23']

//   Indexes {
//     (ips_trabaja, consultorio_trabaja) [unique]
//   }
// }
// ref: trabaja.(ips_trabaja, consultorio_trabaja) > consultorio.(ips_consultorio, id_consultorio)

/**
 * Esta clase representa la relación Trabaja en la base de datos.
 * Se utiliza para mapear la tabla 'trabaja' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "trabaja")
public class Trabaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_trabaja")
    private Integer id;

    @ManyToOne
    @JoinColumn(
        name = "medico_trabaja",
        referencedColumnName = "dni_medico",
        nullable = false
    )
    private Medico medico;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(
            name = "ips_trabaja",
            referencedColumnName = "ips_consultorio",
            nullable = false
        ),
        @JoinColumn(
            name = "consultorio_trabaja",
            referencedColumnName = "id_consultorio",
            nullable = false
        )
    })
    private Consultorio consultorio;

    @NotEmpty
    @Column(
        name = "horario_trabaja",
        length = 48,
        nullable = false
    )
    public String horario; // L00-23,M00-23,R00-23,J00-23,V00-23,S00-23,D00-23

}
