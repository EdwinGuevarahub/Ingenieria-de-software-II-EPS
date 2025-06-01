package com.eps.apexeps.models.entity.relations;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pago_afiliacion")
public class PagoAfiliacionRelation {

    @EmbeddedId
    private PagoAfiliacionId id;

    @Column(name = "tarifa_pagoafiliacion", nullable = false, columnDefinition = "numeric(10, 2)")
    private Double tarifa;
}
