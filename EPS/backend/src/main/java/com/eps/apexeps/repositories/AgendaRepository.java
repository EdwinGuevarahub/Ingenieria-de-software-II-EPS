package com.eps.apexeps.repositories;


import java.time.Instant;
import java.util.List;

import com.eps.apexeps.models.entity.relations.Trabaja;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.relations.Agenda;

/**
 * Repositorio para manejar las operaciones de acceso a datos relacionadas con la entidad Agenda.
 * Extiende JpaRepository para proporcionar métodos CRUD y consultas personalizadas.
 * @author Nicolás Sabogal
 */
@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Integer> {
    List<Agenda> findByPacienteDniAndEstado(Long dni, String estado);
    List<Agenda> findByPaciente_Dni(Long dniPaciente);
    List<Agenda> findByPaciente_DniAndFechaBetween(Long dniPaciente, Instant desde, Instant hasta);

    /**
     * Método para obtener todas las agendas de la base de datos con filtros opcionales.
     * @param dniPaciente El DNI del paciente.
     * @param dniMedico El DNI del médico.
     * @param dniNombrePacienteLike Cadena que se usará para filtrar los pacientes por su DNI o nombre (opcional).
     * @param dniNombreMedicoLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha La fecha de la cita (opcional).
     * @param horaDeInicio Inicio del filtro por hora (opcional).
     * @param horaDeFin Fin del filtro por hora (opcional).
     * @return Una lista de agendas filtradas según los parámetros proporcionados.
     */
    @Query("""
        SELECT a
        FROM Agenda a
        JOIN a.trabaja t
        JOIN t.consultorio c
        JOIN c.servicioMedico s
        JOIN t.medico m
        WHERE
            (   :dniPaciente IS NULL
                OR a.paciente.dni = :dniPaciente
            )
            AND (:dniMedico IS NULL
                OR t.medico.dni = :dniMedico
            )
            AND (:dniNombrePacienteLike IS NULL
                OR CAST(a.paciente.dni AS String) LIKE %:dniNombrePacienteLike%
                OR a.paciente.nombre LIKE %:dniNombrePacienteLike%
            )
            AND (:dniNombreMedicoLike IS NULL
                OR CAST(m.dni AS String) LIKE %:dniNombreMedicoLike%
                OR m.nombre LIKE %:dniNombreMedicoLike%
            )
            AND (:cupsServicioMedico IS NULL
                OR s.cups = :cupsServicioMedico
            )
            AND (:fecha IS NULL
                OR DATE_TRUNC('day', a.fecha) = TO_TIMESTAMP(CAST(:fecha AS String), 'DD-MM-YYYY')
            )
            AND (:horaDeInicio IS NULL
                OR EXTRACT(HOUR FROM a.fecha) > EXTRACT(HOUR FROM TO_TIMESTAMP(CAST(:horaDeInicio AS String), 'HH24:MI'))
                OR (EXTRACT(HOUR FROM a.fecha) = EXTRACT(HOUR FROM TO_TIMESTAMP(CAST(:horaDeInicio AS String), 'HH24:MI'))
                    AND EXTRACT(MINUTE FROM a.fecha) >= EXTRACT(MINUTE FROM TO_TIMESTAMP(CAST(:horaDeInicio AS String), 'HH24:MI'))
                )
            )
            AND (:horaDeFin IS NULL
                OR EXTRACT(HOUR FROM a.fecha) < EXTRACT(HOUR FROM TO_TIMESTAMP(CAST(:horaDeFin AS String), 'HH24:MI'))
                OR (EXTRACT(HOUR FROM a.fecha) = EXTRACT(HOUR FROM TO_TIMESTAMP(CAST(:horaDeFin AS String), 'HH24:MI'))
                    AND EXTRACT(MINUTE FROM a.fecha) <= EXTRACT(MINUTE FROM TO_TIMESTAMP(CAST(:horaDeFin AS String), 'HH24:MI'))
                )
            )
            AND a.estado = 'PENDIENTE'
    """)
    public Page<Agenda> findAllFiltered(
        Long dniPaciente,
        Long dniMedico,
        String dniNombrePacienteLike,
        String dniNombreMedicoLike,
        String cupsServicioMedico,
        String fecha,
        String horaDeInicio,
        String horaDeFin,
        Pageable pageable
    );

    /**
     * Método para obtener todas las agendas de la base de datos con filtros opcionales.
     * @param idIPS Nombre del IPS
     * @param cupsServicioMedico El CUPS del servicio médico asociado a la agenda (opcional).
     * @param fecha La fecha de la cita (opcional).
     * @param horaDeInicio Inicio del filtro por hora (opcional).
     * @param horaDeFin Fin del filtro por hora (opcional).
     * @return Una lista de agendas filtradas según los parámetros proporcionados.
     */
    @Query("""
        WITH puestos AS (
            SELECT t.id_trabaja,
                   t.medico_trabaja,
                   t.consultorio_trabaja,
                   t.horario_trabaja
            FROM Trabaja t
            JOIN t.consultorio c
              ON c.id_consultorio = t.consultorio_trabaja
        ),
        dias AS (
            SELECT generate_series(
                       CURRENT_DATE,
                       CURRENT_DATE + interval '7 days',
                       interval '1 day'
                   )::date AS d
        ),
        ranuras AS (
            SELECT
                p.id_trabaja,
                p.medico_trabaja,
                p.consultorio_trabaja,
                gs.slot_ts
            FROM puestos p
            CROSS JOIN dias d
            CROSS JOIN LATERAL (
                SELECT segm
                FROM regexp_split_to_table(p.horario_trabaja, ',') segm
                WHERE substring(segm, 1, 1) = 
                      CASE EXTRACT(DOW FROM d.d)::int
                          WHEN 1 THEN 'L'
                          WHEN 2 THEN 'M'
                          WHEN 3 THEN 'X'
                          WHEN 4 THEN 'J'
                          WHEN 5 THEN 'V'
                          WHEN 6 THEN 'S'
                          WHEN 0 THEN 'D'
                      END
            ) h
            CROSS JOIN LATERAL (
                SELECT generate_series(
                         d.d + (substring(h.segm,2,2) || ':00')::time,
                         d.d + (substring(h.segm,5,2) || ':00')::time
                             - INTERVAL '30 minutes',
                         INTERVAL '30 minutes'
                       ) AS slot_ts
            ) gs
        ),
        ocupadas AS (
            SELECT a.trabaja_agenda AS id_trabaja,
                   a.f_agenda       AS slot_ts
            FROM agenda a
        )
        SELECT
            r.medico_trabaja            AS dni_medico,
            m.nom_medico                AS nombre_medico,
            r.consultorio_trabaja       AS id_consultorio,
            c.ips_consultorio           AS id_ips,
            c.sermed_consultorio        AS cups,
            s.nom_sermed       AS nombre_servicio,
            (r.slot_ts AT TIME ZONE 'America/Bogota')::date AS fecha,
            (r.slot_ts AT TIME ZONE 'America/Bogota')::time AS hora
        FROM ranuras r
        JOIN medico m ON m.dni_medico = r.medico_trabaja
        JOIN trabaja t ON t.id_trabaja = r.id_trabaja
        JOIN consultorio c ON c.id_consultorio = t.consultorio_trabaja
        JOIN servicio_medico s ON s.cups_sermed = c.sermed_consultorio
        LEFT JOIN ocupadas o
               ON o.id_trabaja = r.id_trabaja
              AND o.slot_ts = r.slot_ts
        WHERE o.slot_ts IS NULL
        ORDER BY fecha, hora, dni_medico
    """)
    public Page<Agenda> findServiciosIps(
            String idIPS,
            String cupsServicioMedico,
            String fecha,
            String horaDeInicio,
            String horaDeFin,
            Pageable pageable
    );

    List<Agenda> findByTrabajaIdInAndFechaAgendaBetween(
            List<Integer> trabajaIds,
            Instant inicio,
            Instant fin);

    public boolean existsByTrabajaAndFecha(Trabaja trabaja, Instant fecha);

    public boolean existsByTrabaja_IdAndFecha(Integer id, Instant fecha);


    public List<Agenda> findByTrabajaIdAndFechaBetween(Integer idTrabaja,
                                                Instant inicio,
                                                Instant fin);

}
