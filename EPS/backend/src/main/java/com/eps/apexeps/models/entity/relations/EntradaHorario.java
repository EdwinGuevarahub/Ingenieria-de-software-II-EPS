package com.eps.apexeps.models.entity.relations;

import java.time.DayOfWeek;
import java.time.LocalTime;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Clase lógica que representa una entrada de horario para mapear los horarios de trabajo en la base de datos.
 * @autor Nicolás Sabogal
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntradaHorario {

    /** Mapa para los valores del enum DayOfWeek a sus caracteres correspondientes. */
    public static final Map<DayOfWeek, Character> CHAR_MAP = Map.of(
        DayOfWeek.MONDAY, 'L',
        DayOfWeek.TUESDAY, 'M',
        DayOfWeek.WEDNESDAY, 'R',
        DayOfWeek.THURSDAY, 'J',
        DayOfWeek.FRIDAY, 'V',
        DayOfWeek.SATURDAY, 'S',
        DayOfWeek.SUNDAY, 'D'
    );

    /** Mapa para los caracteres a sus valores correspondientes del enum DayOfWeek. */
    public static final Map<Character, DayOfWeek> DIA_MAP = Map.of(
        'L', DayOfWeek.MONDAY,
        'M', DayOfWeek.TUESDAY,
        'R', DayOfWeek.WEDNESDAY,
        'J', DayOfWeek.THURSDAY,
        'V', DayOfWeek.FRIDAY,
        'S', DayOfWeek.SATURDAY,
        'D', DayOfWeek.SUNDAY
    );

    /**
     * Convierte una representación en cadena de una entrada de horario a un objeto EntradaHorario.
     * El formato es DHH-HH, donde D es el carácter del día de la semana,
     * HH es la hora de inicio y HH es la hora de fin.
     * Los días de la semana se representan por un solo carácter:
     * L - Lunes, M - Martes, R - Miércoles, J - Jueves,
     * V - Viernes, S - Sábado, D - Domingo.
     * 
     * @param entry La representación en cadena de la entrada de horario.
     * @return Un objeto EntradaHorario que representa la entrada de horario.
     * @throws IllegalArgumentException si la cadena de entrada es inválida.
     */
    public static final EntradaHorario valueOf(String entry) {
        // Convertir el primer carácter a un valor del enum DayOfWeek.
        char dayChar = entry.charAt(0);
        DayOfWeek day = DIA_MAP.get(dayChar);
        if (day == null)
            throw new IllegalArgumentException("Carácter de día inválido: " + dayChar);

        // Obtener el rango de tiempo de la cadena.
        String[] timeRangeStr = entry.substring(1).split("-");
        if (timeRangeStr.length != 2)
            throw new IllegalArgumentException("Rango de tiempo inválido: " + entry.substring(1));

        int startInt = Integer.parseInt(timeRangeStr[0]);
        int endInt = Integer.parseInt(timeRangeStr[1]);
        if (startInt < 0 || startInt > 23 || endInt < 0 || endInt > 23 || startInt >= endInt)
            throw new IllegalArgumentException("Rango de tiempo inválido: " + entry.substring(1));
        
        // Convertir las horas de inicio y fin a objetos LocalTime.
        LocalTime start = LocalTime.of(startInt, 0);
        LocalTime end = LocalTime.of(endInt, 0);

        return new EntradaHorario(day, start, end);
    }


    /** El día de la semana para la entrada de horario. */
    private DayOfWeek dia;
    /** La hora de inicio de la entrada de horario. Debe ser una hora exacta. */
    private LocalTime inicio;
    /** La hora de fin de la entrada de horario. Debe ser una hora exacta. */
    private LocalTime fin;

    /**
     * Convierte el objeto EntradaHorario a una representación en cadena.
     * El formato es DHH-HH, donde D es el carácter del día de la semana,
     * HH es la hora de inicio y HH es la hora de fin.
     * Los días de la semana se representan por un solo carácter:
     * L - Lunes, M - Martes, R - Miércoles, J - Jueves,
     * V - Viernes, S - Sábado, D - Domingo.
     * 
     * @return Una representación en cadena de la entrada de horario.
     */
    @Override
    public String toString() {
        // Convertir el valor del enum DayOfWeek a un carácter.
        Character dayChar = CHAR_MAP.get(this.getDia());

        // Crear la cadena de entrada con el formato DHH-HH.
        String entryStr = dayChar.toString();
        entryStr += String.format("%02d", this.getInicio().getHour());
        entryStr += "-";
        entryStr += String.format("%02d", this.getFin().getHour());
        
        return entryStr;
    }

}
