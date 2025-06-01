package com.eps.apexeps.models.entity.relations;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table pago_afiliacion {
//   paciente_pagoafiliacion bigint [pk, ref: > paciente.dni_paciente]
//   f_pagoafiliacion timestamp [pk]
//   tarifa_pagoafiliacion numeric(10, 2) [not null]
//   estado_pagoafiliacion estado_pago_afiliacion [not null, default: 'pendiente']
// }

/**
 * Esta clase representa la relación PagoAfiliacion en la base de datos.
 * Se utiliza para mapear la tabla 'pago_afiliacion' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pago_afiliacion")
public class PagoAfiliacion {

    @Id
    private PagoAfiliacionId id;

    @Column(
        name = "tarifa_pagoafiliacion",
        nullable = false,
        columnDefinition = "numeric(10, 2)"
    )
    private Double tarifa;

    @Builder.Default
    @Column(
        name = "estado_pagoafiliacion",
        nullable = false,
        columnDefinition = "estado_pago_afiliacion"
    )
    private String estado = "pendiente";

}
