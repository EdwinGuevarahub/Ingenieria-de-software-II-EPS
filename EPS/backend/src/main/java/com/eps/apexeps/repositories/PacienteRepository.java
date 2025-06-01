package com.eps.apexeps.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eps.apexeps.models.entity.users.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    /**
     * Método para encontrar un paciente por su correo electrónico.
     * @param email El correo electrónico del paciente.
     * @return Un objeto Optional que contiene el paciente si se encuentra, o vacío si no se encuentra.
     */
    Optional<Paciente> findByEmail(String email);

}
