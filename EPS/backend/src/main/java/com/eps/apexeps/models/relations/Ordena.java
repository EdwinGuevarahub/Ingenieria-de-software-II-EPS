package com.eps.apexeps.models.relations;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table ordena {
//   agenda_ordena integer [pk, ref: > agenda.id_agenda]
//   servicio_ordena varchar(10) [pk, ref: > servicio_medico.cups_sermed]
// }

/**
 * Esta clase representa la relación Ordena en la base de datos.
 * Se utiliza para mapear la tabla 'ordena' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ordena")
public class Ordena {

    @EmbeddedId
    private OrdenaId id;
    
}
