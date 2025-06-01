package com.eps.apexeps.repositories;

import com.eps.apexeps.models.entity.relations.Despacha;
import com.eps.apexeps.models.entity.relations.DespachaId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DespachaRepository extends JpaRepository<Despacha, DespachaId> {
    List<Despacha> findByPacienteDni(Long dni);
}