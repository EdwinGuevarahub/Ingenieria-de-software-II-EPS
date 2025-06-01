package com.eps.apexeps.repositories;

import com.eps.apexeps.models.entity.relations.DetalleFormula;
import com.eps.apexeps.models.entity.relations.DetalleFormulaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleFormulaRepository extends JpaRepository<DetalleFormula, DetalleFormulaId> {
    List<DetalleFormula> findById_Formula_Id_Agenda_IdAndId_Formula_Id_Diagnostico_Cie(Integer agendaId, String diagnosticoCie);
}
