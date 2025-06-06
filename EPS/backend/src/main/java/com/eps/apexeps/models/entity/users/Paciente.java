package com.eps.apexeps.models.entity.users;

import java.time.Instant;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table paciente {
//     dni_paciente bigint [pk]
//     tipo_dni tipo_dni [not null]
//     beneficiario_paciente bigint [null, ref: > paciente.dni_paciente]
//     nom_paciente varchar(80) [not null]
//     fnac_paciente date [not null]
//     email_paciente varchar(255) [not null, unique]
//     pass_paciente varchar(256) [not null]
//     tel_paciente varchar(20) [null]
//     sexo_paciente char [not null]
//     dir_paciente varchar(255) [not null]
//     parentezco_paciente varchar(20) [null]
//     admreg_paciente varchar(255) [not null, ref: > adm_eps.email_admeps]
//     fafili_paciente timestamp [not null]
// }

/**
 * Esta clase representa la entidad Paciente en la base de datos.
 * Se utiliza para mapear la tabla 'paciente' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "paciente")
public class Paciente {

    @Id
    @Column(
        name = "dni_paciente",
        nullable = false
    )
    private Long dni;

    @Column(
        name = "tipo_dni",
        nullable = false,
        columnDefinition = "tipo_dni"
    )
    private String tipoDni;

    @ManyToOne
    @JoinColumn(
        name = "beneficiario_paciente",
        referencedColumnName = "dni_paciente"
    )
    Paciente beneficiario;

    @NotNull
    @Column(
        name = "nom_paciente",
        length = 80,
        nullable = false
    )
    private String nombre;

    @Column(
        name = "fnac_paciente",
        nullable = false
    )
    private LocalDate fechaNacimiento;

    @Email
    @Column(
        name = "email_paciente",
        length = 255,
        nullable = false,
        columnDefinition = "email_valido",
        unique = true
    )
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotNull
    @Column(
        name = "pass_paciente",
        length = 256,
        nullable = false
    )
    private String password;

    @Column(
        name = "tel_paciente",
        length = 20
    )
    private String telefono;

    @Column(
        name = "parentezco_paciente",
        length = 20
    )
    private String parentezco;

    @NotNull
    @Column(
        name = "sexo_paciente",
        nullable = false,
        columnDefinition = "sexo_valido"
    )
    private Character sexo;

    @NotNull
    @Column(
        name = "dir_paciente",
        length = 255,
        nullable = false
    )
    private String direccion;

    @NotNull
    @ManyToOne
    @JoinColumn(
        name = "admreg_paciente",
        referencedColumnName = "email_admeps"
    )
    private AdmEps admRegistrador;

    @Column(
        name = "fafili_paciente",
        nullable = false
    )
    private Instant fechaAfiliacion;

}
