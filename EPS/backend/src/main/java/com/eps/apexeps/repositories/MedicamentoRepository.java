package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.Medicamento;

@Repository
public interface MedicamentoRepository extends JpaRepository<Medicamento, String> {
}
