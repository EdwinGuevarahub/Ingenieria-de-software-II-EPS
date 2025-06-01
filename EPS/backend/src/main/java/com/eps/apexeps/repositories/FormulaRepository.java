package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.relations.Formula;
import com.eps.apexeps.models.entity.relations.FormulaId;

@Repository
public interface FormulaRepository extends JpaRepository<Formula, FormulaId> {
}
