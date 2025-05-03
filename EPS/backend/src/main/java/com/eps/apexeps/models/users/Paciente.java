package com.eps.apexeps.models.users;
import java.time.Instant;
import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table paciente {
//     dni_paciente bigint [pk]
//     beneficiario_paciente bigint [null, ref: > paciente.dni_paciente]
//     nom_paciente varchar(80) [not null]
//     fnac_paciente date [not null]
//     email_paciente varchar(255) [not null, unique]
//     pass_paciente char(256) [not null]
//     tel_paciente varchar(20) [not null]
//     sexo_paciente char(1) [not null]
//     dir_paciente varchar(255) [not null]
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

    @ManyToOne
    @JoinColumn(
        name = "beneficiario_paciente",
        referencedColumnName = "dni_paciente"
    )
    Paciente beneficiario;

    @NotEmpty
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
        unique = true
    )
    private String email;

    @NotEmpty
    @Column(
        name = "pass_paciente",
        length = 256,
        nullable = false,
        columnDefinition = "bpchar"
    )
    private String password;

    @NotEmpty
    @Column(
        name = "tel_paciente",
        length = 20,
        nullable = false
    )
    private String telefono;

    @NotEmpty
    @Column(
        name = "sexo_paciente",
        length = 1,
        nullable = false,
        columnDefinition = "bpchar"
    )
    private Character sexo;

    @NotEmpty
    @Column(
        name = "dir_paciente",
        length = 255,
        nullable = false
    )
    private String direccion;

    @NotEmpty
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
