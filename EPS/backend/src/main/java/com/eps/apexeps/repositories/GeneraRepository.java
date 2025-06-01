package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.relations.Genera;
import com.eps.apexeps.models.entity.relations.GeneraId;

@Repository
public interface GeneraRepository extends JpaRepository<Genera, GeneraId> {
}
