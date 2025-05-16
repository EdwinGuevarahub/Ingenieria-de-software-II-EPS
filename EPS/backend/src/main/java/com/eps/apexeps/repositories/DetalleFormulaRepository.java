package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.relations.DetalleFormula;

@Repository
public interface DetalleFormulaRepository extends JpaRepository<DetalleFormula, Long> {
}