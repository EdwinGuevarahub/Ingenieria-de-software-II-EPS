package com.eps.apexeps.models.entity.relations;

import com.eps.apexeps.models.entity.users.Paciente;
import jakarta.persistence.*;
import lombok.*;
//import java.math.BigDecimal;
import java.time.Instant;

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
@IdClass(DespachaId.class)
public class Despacha {

    @Id
    @ManyToOne
    @JoinColumn(name = "paciente_despacha", referencedColumnName = "dni_paciente", nullable = false)
    private Paciente paciente;

    @Id
    @ManyToOne
    @JoinColumn(name = "inventaria_despacha", referencedColumnName = "id_inventaria", nullable = false)
    private Inventaria inventaria;

    @Id
    @Column(name = "f_despacha", nullable = false)
    private Instant fecha;

    // Si tienes valor, puedes mapearlo así:
    // @Column(name = "valor_despacha")
    // private BigDecimal valor;
}
