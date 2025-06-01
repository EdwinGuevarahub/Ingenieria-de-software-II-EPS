package com.eps.apexeps.repositories;

import com.eps.apexeps.models.entity.relations.PagoAfiliacion;
import com.eps.apexeps.models.entity.relations.PagoAfiliacionId;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface PagoAfiliacionRepository extends JpaRepository<PagoAfiliacion, PagoAfiliacionId> {
    List<PagoAfiliacion> findByIdPacienteDni(Long dni);
    List<PagoAfiliacion> findByIdPacienteDniAndIdFechaPagoAfiliacion(Long dni, Instant fechaPagoAfiliacion);
}