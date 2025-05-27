package com.eps.apexeps.models.entity.relations;

import com.eps.apexeps.models.entity.Ips;
import com.eps.apexeps.models.entity.Medicamento;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table inventaria {
//   id_inventaria serial [pk]
//   ips_inventaria integer [not null, unique, ref: > ips.id_ips]
//   medicamento_inventaria varchar(20) [not null, unique, ref: > medicamento.id_medicamento]
//   cantidad_inventaria integer [not null, default: 0]
// }

/**
 * Esta clase representa la relación Inventaria en la base de datos.
 * Se utiliza para mapear la tabla 'inventaria' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "inventaria")
public class Inventaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_inventaria")
    private Integer id;

    @ManyToOne
    @JoinColumn(
        name = "ips_inventaria",
        referencedColumnName = "id_ips",
        nullable = false
    )
    private Ips ips;

    @ManyToOne
    @JoinColumn(
        name = "medicamento_inventaria",
        referencedColumnName = "id_medicamento",
        nullable = false
    )
    private Medicamento medicamento;

    @Column(
        name = "cantidad_inventaria",
        nullable = false
    )
    @Builder.Default
    private Integer cantidadInventario = 0;
    
}
