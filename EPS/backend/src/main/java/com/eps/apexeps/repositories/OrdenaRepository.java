package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.relations.Ordena;
import com.eps.apexeps.models.entity.relations.OrdenaId;

import java.util.List;
import org.springframework.data.repository.query.Param;
import com.eps.apexeps.models.DTOs.CupsNombreDTO;


import java.util.Optional;

@Repository
public interface OrdenaRepository extends JpaRepository<Ordena, OrdenaId> {

    @Query("""
    SELECT new com.eps.apexeps.models.DTOs.CupsNombreDTO(
        s.cups,
        s.nombre
    )
    FROM Ordena o
    JOIN o.id.servicio s
    JOIN o.id.agenda a
    WHERE a.id = :idOrden
      AND a.paciente.dni = :dniPaciente
""")
    List<CupsNombreDTO> findCupsAndNamesByOrdenIdAndPaciente(@Param("idOrden") Integer idOrden,
                                                             @Param("dniPaciente") Long dniPaciente);


}
