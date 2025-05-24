package com.eps.apexeps.repositories;

import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.eps.apexeps.models.relations.PagoAfiliacion;
import com.eps.apexeps.models.relations.PagoAfiliacionId;

@Repository
public interface PagoAfiliacionRepository
        extends JpaRepository<PagoAfiliacion, PagoAfiliacionId> {

    @Query("""
           SELECT MAX(p.id.fechaPagoAfiliacion)
             FROM PagoAfiliacion p
            WHERE p.id.paciente.dni = :dni
           """)
    Instant findUltimoPago(Long dni);
}
