package com.eps.apexeps.models.entity.relations;

import java.time.Instant;

import com.eps.apexeps.models.entity.users.Paciente;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.Objects;
import lombok.Setter;

// Table pago_afiliacion {
//   paciente_pagoafiliacion bigint [pk, ref: > paciente.dni_paciente]
//   f_pagoafiliacion timestamp [pk]
//   tarifa_pagoafiliacion numeric(10, 2) [not null]
// }

/**
 * Esta clase representa la clave primaria compuesta de la relación
 * PagoAfiliacion en la base de datos.
 * Se utiliza para mapear la tabla 'pago_afiliacion' y sus columnas a un objeto
 * Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 *
 * @author Nicolás Sabogal
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoAfiliacionId {

    @ManyToOne
    @JoinColumn(name = "paciente_pagoafiliacion", referencedColumnName = "dni_paciente", nullable = false)
    private Paciente paciente;

    @Column(name = "f_pagoafiliacion", nullable = false)
    private Instant fechaPagoAfiliacion;

    // equals y hashCode obligatorios para IDs compuestos
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof PagoAfiliacionId))
            return false;
        PagoAfiliacionId that = (PagoAfiliacionId) o;
        return Objects.equals(paciente, that.paciente) &&
                Objects.equals(fechaPagoAfiliacion, that.fechaPagoAfiliacion);
    }

}
