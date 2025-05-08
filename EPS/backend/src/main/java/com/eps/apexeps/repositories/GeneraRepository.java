package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.relations.Genera;
import com.eps.apexeps.models.relations.GeneraId;

@Repository
public interface GeneraRepository extends JpaRepository<Genera, GeneraId> {
    // Métodos personalizados si son necesarios
}
