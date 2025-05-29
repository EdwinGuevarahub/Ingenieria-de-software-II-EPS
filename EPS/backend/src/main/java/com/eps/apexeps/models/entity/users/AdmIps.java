package com.eps.apexeps.models.entity.users;

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

// Table adm_ips {
//   email_admips varchar(255) [pk]
//   ips_admips integer [not null, ref: > ips.id_ips]
//   nom_admips varchar(80) [not null]
//   pass_admips varchar(256) [not null]
//   tel_admips varchar(20) [not null]
// }

/**
 * Esta clase representa la entidad AdmIps en la base de datos.
 * Se utiliza para mapear la tabla 'adm_ips' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "adm_ips")
public class AdmIps {

    @Id
    @Column(
        name = "email_admips",
        length = 255,
        nullable = false,
        columnDefinition = "email_valido"
    )
    private String email;

    @NotEmpty
    @Column(
        name = "nom_admips",
        length = 80,
        nullable = false
    )
    private String nombre;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotEmpty
    @Column(
        name = "pass_admips",
        length = 256,
        nullable = false
    )
    private String password;

    @NotEmpty
    @Column(
        name = "tel_admips",
        length = 20,
        nullable = false
    )
    private String telefono;
    
}
