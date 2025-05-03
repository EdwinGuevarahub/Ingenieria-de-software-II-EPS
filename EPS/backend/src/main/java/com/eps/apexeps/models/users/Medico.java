package com.eps.apexeps.models.users;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table medico {
//   dni_medico bigint [pk]
//   nom_medico varchar(80) [not null]
//   email_medico varchar(255) [not null, unique]
//   pass_medico char(256) [not null]
//   tel_medico varchar(20) [not null]
//   activo_medico boolean [not null, default: true]
// }

/**
 * Esta clase representa la entidad Medico en la base de datos.
 * Se utiliza para mapear la tabla 'medico' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "medico")
public class Medico {

    @Id
    @Column(
        name = "dni_medico",
        nullable = false
    )
    private Long dni;

    @NotEmpty
    @Column(
        name = "nom_medico",
        length = 80,
        nullable = false
    )
    private String nombre;

    @NotEmpty
    @Column(
        name = "email_medico",
        length = 255,
        nullable = false,
        unique = true
    )
    private String email;

    @NotEmpty
    @Column(
        name = "pass_medico",
        length = 256,
        nullable = false,
        columnDefinition = "bpchar"
    )
    private String password;

    @NotEmpty
    @Column(
        name = "tel_medico",
        length = 20,
        nullable = false
    )
    private String telefono;

    @Column(
        name = "activo_medico",
        nullable = false,
        columnDefinition = "boolean default true"
    )
    @Builder.Default
    private Boolean activo = true;

}
