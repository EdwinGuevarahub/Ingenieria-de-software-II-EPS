package com.eps.apexeps.models.users;

import com.fasterxml.jackson.annotation.JsonProperty;

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

// Table adm_eps {
//   email_admeps varchar(255) [pk]
//   nom_admeps varchar(80) [not null]
//   pass_admeps varchar(256) [not null]
//   tel_admeps varchar(20) [not null]
// }

/**
 * Esta clase representa la entidad AdmEps en la base de datos.
 * Se utiliza para mapear la tabla 'adm_eps' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "adm_eps")
public class AdmEps {

    @Id
    @Column(
        name = "email_admeps",
        length = 255,
        nullable = false,
        columnDefinition = "email_valido"
    )
    private String email;

    @NotEmpty
    @Column(
        name = "nom_admeps",
        length = 80,
        nullable = false
    )
    private String nombre;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotEmpty
    @Column(
        name = "pass_admeps",
        length = 256,
        nullable = false
    )
    private String password;

    @NotEmpty
    @Column(
        name = "tel_admeps",
        length = 20,
        nullable = false
    )
    private String telefono;

}
