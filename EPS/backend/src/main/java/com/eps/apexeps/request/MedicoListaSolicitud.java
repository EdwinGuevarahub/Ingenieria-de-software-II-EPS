package com.eps.apexeps.request;

import lombok.Data;

/**
 * Clase que representa una solicitud de médico para listar servicios médicos.
 * Contiene información sobre la IPS, el nombre del médico, el CUPS del servicio médico,
 * el día de la semana, las horas de inicio y fin, y si está activo o no.
 * @autor Nicolás Sabogal
 */
@Data
public class MedicoListaSolicitud {

    /** El id de la IPS (opcional). */
    private Integer idIps;
    /** Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional). */
    private String dniNombreLike;
    /** El CUPS de un servicio médico asociado al médico (opcional). */
    private String cupsServicioMedico;
    /** Código del día de la semana en el que el médico está disponible (opcional, 1 = Lunes -> 7 = Domingo). */
    private Integer codDiaSemana;
    /** La hora de inicio de la jornada laboral del médico (opcional, 0 a 23). */
    private Integer horaDeInicio;
    /** La hora de fin de la jornada laboral del médico (opcional, 0 a 23). */
    private Integer horaDeFin;
    /** Indica si el médico está activo o no (opcional). */
    private Boolean estaActivo;
    /** Tamaño de la página (por defecto, 10). */
    private Integer qSize = 10;
    /** Número de la página (por defecto, 0). */
    private Integer qPage = 0;

;}
