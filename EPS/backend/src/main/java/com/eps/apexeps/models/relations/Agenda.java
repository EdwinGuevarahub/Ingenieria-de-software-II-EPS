package com.eps.apexeps.models.relations;

import java.time.Instant;
import java.util.List;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.users.Paciente;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table agenda {
//   id_agenda serial [pk]
//   paciente_agenda bigint [not null, ref: > paciente.dni_paciente]
//   trabaja_agenda integer [not null, ref: > trabaja.id_trabaja]
//   f_agenda timestamp [not null]
//   fpago_agenda timestamp [null]
//   resultado_agenda text [null]
//   estado_agenda varchar(20) [not null, default: 'pendiente', note: 'pendiente, completada, cancelada']
// }

// Table ordena {
//   agenda_ordena integer [pk, ref: > agenda.id_agenda]
//   servicio_ordena varchar(10) [pk, ref: > servicio_medico.cups_sermed]
// }


/**
 * Esta clase representa la relación Agenda en la base de datos.
 * Se utiliza para mapear la tabla 'agenda' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "agenda")
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agenda")
    private Integer id;

    @ManyToOne
    @JoinColumn(
        name = "paciente_agenda",
        referencedColumnName = "dni_paciente",
        nullable = false
    )
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(
        name = "trabaja_agenda",
        referencedColumnName = "id_trabaja",
        nullable = false
    )
    private Trabaja trabaja;

    @Column(
        name = "f_agenda",
        nullable = false
    )
    private Instant fecha;

    @Column(name = "fpago_agenda")
    private Instant fechaPago;

    @Column(
        name = "resultado_agenda",
        columnDefinition = "text"
    )
    private String resultado;

    @Column(
        name = "estado_agenda",
        nullable = false,
        columnDefinition = "varchar(20) default 'pendiente'"
    )
    @Builder.Default
    private String estado = "pendiente";

    /**
     * Relación uno a muchos con la relación Genera.
     * Representa la relación entre la agenda y los diagnósticos generados.
     * Se utiliza para mapear la tabla 'genera' y sus columnas a un objeto Java.
     * No se puede modificar la relación desde aquí, ya que es una relación de solo lectura.
     * Sólo se carga cuando se necesita (Lazy Loading).
     */
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "agenda_genera",
        referencedColumnName = "id_agenda",
        insertable = false,
        updatable = false
    )
    private List<Genera> generaciones;

    /**
     * Lista de servicios médicos que se ordenan en la agenda.
     * Esta relación es de muchos a muchos, ya que una agenda puede tener varios servicios.
     * Se utiliza la tabla 'ordena' para mapear esta relación.
     */
    @ManyToMany
    @JoinTable(
        name = "ordena",
        joinColumns = @JoinColumn(name = "agenda_ordena"),
        inverseJoinColumns = @JoinColumn(name = "servicio_ordena")
    )
    private List<ServicioMedico> ordenes;

}
