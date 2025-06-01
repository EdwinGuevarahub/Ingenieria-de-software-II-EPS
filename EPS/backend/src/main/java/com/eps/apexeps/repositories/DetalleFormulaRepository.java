package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.relations.DetalleFormula;
import com.eps.apexeps.models.entity.relations.DetalleFormulaId;

@Repository
public interface DetalleFormulaRepository extends JpaRepository<DetalleFormula, DetalleFormulaId> {
}
