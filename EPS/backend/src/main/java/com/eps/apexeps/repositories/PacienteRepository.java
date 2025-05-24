package com.eps.apexeps.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.users.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {}
