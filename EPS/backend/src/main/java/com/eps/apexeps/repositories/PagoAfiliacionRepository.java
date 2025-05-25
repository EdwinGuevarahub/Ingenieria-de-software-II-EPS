package com.eps.apexeps.repositories;

import com.eps.apexeps.models.PagoAfiliacion;
import com.eps.apexeps.models.relations.PagoAfiliacionId;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PagoAfiliacionRepository extends JpaRepository<PagoAfiliacion, PagoAfiliacionId> {
    List<PagoAfiliacion> findByIdPacienteId(Long pacienteId);
}