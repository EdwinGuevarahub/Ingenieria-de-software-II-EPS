package com.eps.apexeps.models.entity.relations;

import com.eps.apexeps.models.entity.ServicioMedico;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
 * Esta clase representa la clave primaria compuesta de la relación Ordena en la base de datos.
 * Se utiliza para mapear la tabla 'ordena' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenaId {

    // Se ignora la relación para evitar problemas de recursividad al serializar a JSON.
    @JsonIgnore
    @ManyToOne
    @JoinColumn(
        name = "agenda_ordena",
        referencedColumnName = "id_agenda",
        nullable = false
    )
    private Agenda agenda;

    @ManyToOne
    @JoinColumn(
        name = "servicio_ordena",
        referencedColumnName = "cups_sermed",
        nullable = false
    )
    private ServicioMedico servicio;
    
}
