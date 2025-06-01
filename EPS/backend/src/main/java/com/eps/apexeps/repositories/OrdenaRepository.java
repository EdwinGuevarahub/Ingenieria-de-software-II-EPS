package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.relations.Ordena;
import com.eps.apexeps.models.entity.relations.OrdenaId;

import java.util.Optional;

@Repository
public interface OrdenaRepository extends JpaRepository<Ordena, OrdenaId> {

    @Query("""
           SELECT o
             FROM Ordena  o
             JOIN o.id.agenda a
            WHERE o.id.agenda.id    = :agendaId
              AND o.id.servicio.cups = :cups
              AND a.paciente.dni = :dniPaciente
              AND a.estado <> 'CANCELADA'
           """)
    Optional<Ordena> validar(Integer agendaId, String cups, Long dniPaciente);


}
