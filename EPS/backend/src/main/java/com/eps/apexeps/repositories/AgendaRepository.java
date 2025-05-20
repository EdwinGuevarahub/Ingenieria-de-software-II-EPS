package com.eps.apexeps.repositories;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.relations.Agenda;

/**
 * Repositorio para manejar las operaciones de acceso a datos relacionadas con la entidad Agenda.
 * Extiende JpaRepository para proporcionar métodos CRUD y consultas personalizadas.
 * @author Nicolás Sabogal
 */
@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Integer> {
  
  
    List<Agenda> findByPacienteDniAndEstado(Long dni, String estado);

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

}
