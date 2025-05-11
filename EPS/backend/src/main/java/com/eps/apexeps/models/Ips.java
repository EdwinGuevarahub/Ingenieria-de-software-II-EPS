package com.eps.apexeps.models;

import java.time.Instant;

import com.eps.apexeps.models.users.AdmEps;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table ips {
//   id_ips serial [pk]
//   nom_ips varchar(200) [not null]
//   dir_ips varchar(255) [not null]
//   tel_ips varchar(20) [not null]
//   admreg_ips varchar(255) [not null, ref: > adm_eps.email_admeps]
//   freg_ips timestamp [not null]
// }

/**
 * Esta clase representa la entidad Ips en la base de datos.
 * Se utiliza para mapear la tabla 'ips' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "ips")
public class Ips {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ips")
    private Integer id;

    @NotEmpty
    @Column(
        name = "nom_ips",
        length = 200,
        nullable = false
    )
    private String nombre;

    @NotEmpty
    @Column(
        name = "dir_ips",
        length = 255,
        nullable = false
    )
    private String direccion;

    @NotEmpty
    @Column(
        name = "tel_ips",
        length = 20,
        nullable = false
    )
    private String telefono;

    @ManyToOne
    @JoinColumn(
        name = "admreg_ips",
        referencedColumnName = "email_admeps",
        nullable = false
    )
    private AdmEps admEps;

    @Column(
        name = "freg_ips",
        nullable = false
    )
    private Instant fechaRegistro;
    
    @PrePersist
    public void prePersist() {
        if (fechaRegistro == null) {
            fechaRegistro = Instant.now();
        }
    }
}
