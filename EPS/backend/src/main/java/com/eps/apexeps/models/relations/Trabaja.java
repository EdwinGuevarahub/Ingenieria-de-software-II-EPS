package com.eps.apexeps.models.relations;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.users.Medico;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Table trabaja {
//   id_trabaja serial [pk]
//   medico_trabaja bigint [not null, ref: > medico.dni_medico]
//   ips_trabaja integer [not null]
//   consultorio_trabaja integer [not null]
//   horario_trabaja varchar(48) [not null, note: 'L00-23,M00-23,R00-23,J00-23,V00-23,S00-23,D00-23']

//   Indexes {
//     (ips_trabaja, consultorio_trabaja) [unique]
//   }
// }
// ref: trabaja.(ips_trabaja, consultorio_trabaja) > consultorio.(ips_consultorio, id_consultorio)

/**
 * Esta clase representa la relación Trabaja en la base de datos.
 * Se utiliza para mapear la tabla 'trabaja' y sus columnas a un objeto Java.
 * Incluye anotaciones de JPA para la persistencia y validaciones de datos.
 * @author Nicolás Sabogal
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "trabaja")
public class Trabaja {

    /** Identificador único de la relación Trabaja. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_trabaja")
    private Integer id;

    /** Médico asociado a la relación Trabaja. */
    @ManyToOne
    @JoinColumn(
        name = "medico_trabaja",
        referencedColumnName = "dni_medico",
        nullable = false
    )
    private Medico medico;

    /** IPS asociada a la relación Trabaja. */
    @ManyToOne
    @JoinColumns({
        @JoinColumn(
            name = "ips_trabaja",
            referencedColumnName = "ips_consultorio",
            nullable = false
        ),
        @JoinColumn(
            name = "consultorio_trabaja",
            referencedColumnName = "id_consultorio",
            nullable = false
        )
    })
    private Consultorio consultorio;

    /** Horario de trabajo del médico en la relación Trabaja. */
    @NotEmpty
    @Getter(AccessLevel.NONE)
    @Column(
        name = "horario_trabaja",
        length = 48,
        nullable = false
    )
    public String horario; // L00-23,M00-23,R00-23,J00-23,V00-23,S00-23,D00-23

    /**
     * Convierte la cadena de horario a una lista de objetos EntradaHorario.
     * @return Una lista de objetos EntradaHorario que representan los horarios de trabajo.
     */
    public List<EntradaHorario> getHorario() {
        List<EntradaHorario> entradas = new ArrayList<>();

        // Separar la cadena de horario por comas y convertir cada parte a un objeto EntradaHorario.
        String[] entradasStr = horario.split(",");
        for (String entradaStr : entradasStr)
            entradas.add(EntradaHorario.valueOf(entradaStr));

        return entradas;
    }

    /**
     * Agrega una entrada de horario a la cadena de horario.
     * @param entrada La entrada de horario a agregar.
     */
    public void addEntradaHorario(EntradaHorario entrada) {
        // Sólo se permite una entrada de horario por día de la semana.
        int indice = this.horario.indexOf(EntradaHorario.CHAR_MAP.get(entrada.getDia()));
        if (indice >= 0)
            throw new IllegalArgumentException("Ya existe una entrada de horario para el día: " + entrada.getDia());

        this.horario += (this.horario.isEmpty() ? "" : ",") + entrada.toString();
    }

    /**
     * Elimina una entrada de horario para el día especificado de la cadena de horario.
     * @param dia El día de la semana para el cual se desea eliminar la entrada de horario.
     */
    public void removeEntradaHorario(DayOfWeek dia) {
        // Encontrar la entrada de horario correspondiente al día especificado y eliminarla.
        List<EntradaHorario> entradas = getHorario();
        for (EntradaHorario entrada : entradas) {
            if (entrada.getDia() == dia) {
                entradas.remove(entrada);
                break;
            }
        }

        // Si la entrada de horario no se encuentra, lanzar una excepción.
        if (entradas.size() == this.getHorario().size())
            throw new IllegalArgumentException("No se encontró la entrada de horario para el día: " + dia);


        // Si no hay, al menos, una entrada, lanzar excepción.
        if (entradas.isEmpty())
            throw new IllegalArgumentException("No se puede eliminar la última entrada de horario.");
        
        // Reconstruir la cadena de horario a partir de las entradas restantes.
        this.horario = "";
        for (EntradaHorario entrada : entradas)
            this.horario += (this.horario.isEmpty() ? "" : ",") + entrada.toString();
    }

}
