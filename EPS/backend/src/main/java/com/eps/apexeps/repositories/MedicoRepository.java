package com.eps.apexeps.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.eps.apexeps.models.users.Medico;

/**
 * Esta interfaz es un repositorio de JPA para la entidad Medico.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
public interface MedicoRepository extends JpaRepository<Medico, Long> {

    /**
     * Método para encontrar todos los médicos filtrados por id de IPS, dni o nombre del médico, CUPS del servicio médico y estado activo/inactivo.
     * @param idIps id de la ips.
     * @param dniNombreLike parte del dni o nombre del médico.
     * @param cupsServicioMedico cups del servicio médico.
     * @param estaActivo estado activo/inactivo del médico.
     * @param pageable objeto Pageable para paginación.
     * @return lista de médicos filtrados.
     */
    @Query("""
        SELECT m
        FROM Medico m
        INNER JOIN Trabaja t ON t.medico = m
        WHERE
            (:idIps IS NULL
                OR t.consultorio.id.ips.id = :idIps
            )
            AND (:dniNombreLike IS NULL
                OR CAST(m.dni AS String) LIKE %:dniNombreLike%
                OR m.nombre LIKE %:dniNombreLike%
            )
            AND (:cupsServicioMedico IS NULL
                OR :cupsServicioMedico IN (
                    SELECT s.cups
                    FROM m.dominios s
                )
            )
            AND (:estaActivo IS NULL
                OR m.activo = :estaActivo
            )
    """)
    public List<Medico> findAllFiltered(
        Integer idIps,
        String dniNombreLike,
        String cupsServicioMedico,
        Boolean estaActivo,
        Pageable pageable
    );

}
