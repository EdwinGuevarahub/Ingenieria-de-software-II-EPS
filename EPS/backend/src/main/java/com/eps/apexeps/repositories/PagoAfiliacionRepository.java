package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.eps.apexeps.models.entity.relations.PagoAfiliacion;
import com.eps.apexeps.models.entity.relations.PagoAfiliacionId;

import java.time.Instant;
import java.util.List;

@Repository
public interface PagoAfiliacionRepository
        extends JpaRepository<PagoAfiliacion, PagoAfiliacionId> {

    List<PagoAfiliacion> findByIdPacienteDni(Long dni);
    List<PagoAfiliacion> findByIdPacienteDniAndIdFechaPagoAfiliacion(Long dni, Instant fechaPagoAfiliacion);

    @Query("""
           SELECT MAX(p.id.fechaPagoAfiliacion)
             FROM PagoAfiliacion p
            WHERE p.id.paciente.dni = :dni
           """)
    Instant findUltimoPago(Long dni);
}
