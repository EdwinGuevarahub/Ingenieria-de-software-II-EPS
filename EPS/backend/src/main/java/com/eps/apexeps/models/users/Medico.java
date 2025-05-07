package com.eps.apexeps.models.users;

import java.util.List;

import com.eps.apexeps.models.ServicioMedico;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
//   pass_medico varchar(256) [not null]
//   tel_medico varchar(20) [not null]
//   activo_medico boolean [not null, default: true]
// }

// Table domina {
//   medico_domina bigint [pk, ref: > medico.dni_medico]
//   servicio_domina varchar(10) [pk, ref: > servicio_medico.cups_sermed]
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
        columnDefinition = "email_valido",
        unique = true
    )
    private String email;

    @JsonIgnore
    @NotEmpty
    @Column(
        name = "pass_medico",
        length = 256,
        nullable = false
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

    /**
     * Lista de servicios médicos que el médico domina.
     * Esta relación es de muchos a muchos, ya que un médico puede dominar varios servicios.
     * Se utiliza la tabla 'domina' para mapear esta relación.
     */
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "domina",
        joinColumns = @JoinColumn(name = "medico_domina"),
        inverseJoinColumns = @JoinColumn(name = "servicio_domina")
    )
    private List<ServicioMedico> dominios;

}
