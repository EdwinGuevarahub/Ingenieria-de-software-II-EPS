package com.eps.apexeps.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.Consultorio;
import com.eps.apexeps.models.ConsultorioId;

/**
 * Esta interfaz es un repositorio de JPA para la entidad Consultorio.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface ConsultorioRepository extends JpaRepository<Consultorio, ConsultorioId> {

    /**
     * Método para encontrar todos los consultorios filtrados por id de IPS, id de consultorio y CUPS del servicio médico.
     * @param idIps El id de la IPS.
     * @param idConsultorioLike Parte del id del consultorio (opcional).
     * @param cupsServicioMedico El CUPS del servicio médico (opcional).
     * @param pageable Objeto Pageable para la paginación.
     * @return Una lista de consultorios que cumplen con los criterios de búsqueda.
     */
    @Query("""
        SELECT c
        FROM Consultorio c
        WHERE 
            (:idIps IS NULL
                OR :idIps = c.id.ips.id
            )
            AND (:idConsultorioLike IS NULL
                OR CAST(c.id.idConsultorio AS String) LIKE %:idConsultorioLike%
            )
            AND (:cupsServicioMedico IS NULL
                OR c.servicioMedico.cups = :cupsServicioMedico
            )
    """)
    Page<Consultorio> findAllFiltered(
        Integer idIps,
        String idConsultorioLike,
        String cupsServicioMedico,
        Pageable pageable
    );

    /**
     * Método para encontrar un consultorio específico por su id de IPS y el id del consultorio.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return El consultorio encontrado o null si no existe.
     */
    Optional<Consultorio> findById_Ips_IdAndId_IdConsultorio(Integer idIps, Integer idConsultorio);


    /**
     * Método para verificar si existe un consultorio por su id de IPS y el id del consultorio.
     * @param idIps El id de la IPS.
     * @param idConsultorio El id del consultorio.
     * @return true si existe, false en caso contrario.
     */
    boolean existsById_Ips_IdAndId_IdConsultorio(Integer idIps, Integer idConsultorio);

}
