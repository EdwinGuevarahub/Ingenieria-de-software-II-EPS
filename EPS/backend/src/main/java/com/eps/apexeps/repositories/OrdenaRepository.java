package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.relations.Ordena;
import com.eps.apexeps.models.relations.OrdenaId;

@Repository
public interface OrdenaRepository extends JpaRepository<Ordena, OrdenaId> {
}
