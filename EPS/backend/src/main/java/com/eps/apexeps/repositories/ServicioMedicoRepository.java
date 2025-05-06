package com.eps.apexeps.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.ServicioMedico;

/**
 * Repositorio para la entidad ServicioMedico.
 * Proporciona métodos para realizar operaciones CRUD en la base de datos.
 * @author Nicolás Sabogal
 */
@Repository
public interface ServicioMedicoRepository extends JpaRepository<ServicioMedico, String> {

    /**
     * Método para buscar todos los servicios médicos filtrados por nombre o código CUPS.
     * @param cupsNombreLike Parte del nombre o código CUPS del servicio médico a buscar (opcional).
     * @param pageable Objeto Pageable para la paginación de resultados.
     * @return Una lista de servicios médicos que coinciden con el filtro.
     */
    @Query("""
        SELECT sm
        FROM ServicioMedico sm
        WHERE
            :cupsNombreLike IS NULL
            OR sm.cups LIKE %:cupsNombreLike%
            OR sm.nombre LIKE %:cupsNombreLike%
    """)
    List<ServicioMedico> findAllFiltered(String cupsNombreLike, Pageable pageable);

}
