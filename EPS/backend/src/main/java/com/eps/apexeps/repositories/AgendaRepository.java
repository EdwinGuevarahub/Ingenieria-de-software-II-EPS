package com.eps.apexeps.repositories;

import java.util.List;

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

    @Query("""
        SELECT a
        FROM Agenda a
        JOIN a.trabaja t
        JOIN t.consultorio c
        JOIN c.servicioMedico s
        JOIN t.medico m
        WHERE
            a.paciente.dni = :dniPaciente
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
    public List<Agenda> findAllFilteredByPaciente(
        Long dniPaciente,
        String dniNombreMedicoLike,
        String cupsServicioMedico,
        String fecha,
        String horaDeInicio,
        String horaDeFin,
        Pageable pageable
    );

}
