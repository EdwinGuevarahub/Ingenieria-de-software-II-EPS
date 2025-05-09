package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.eps.apexeps.models.relations.Agenda;

@Repository
public interface AgendaRepository extends JpaRepository<Agenda, Long> {
  List<Agenda> findByPacienteDniAndEstado(Long dni, String estado);
}
