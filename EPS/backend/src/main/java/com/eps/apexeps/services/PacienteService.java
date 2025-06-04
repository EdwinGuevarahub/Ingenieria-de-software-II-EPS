package com.eps.apexeps.services;

import org.springframework.stereotype.Service;

import com.eps.apexeps.models.entity.users.Paciente;
import com.eps.apexeps.repositories.PacienteRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar la lógica de negocio relacionada con los pacientes.
 * Proporciona métodos para interactuar con los datos de los pacientes.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class PacienteService {

    /** Servicio para manejar la lógica de negocio relacionada con los pacientes. */
    private final PacienteRepository pacienteRepository;

    /**
     * Método para encontrar el DNI de un paciente a partir de su correo electrónico.
     * @param email El correo electrónico del paciente.
     * @return El DNI del paciente o null si no se encuentra el paciente.
     * @throws IllegalArgumentException Si el correo electrónico es nulo.
     */
    public Long findDniByEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("El correo electrónico no puede ser nulo.");
        }

        return pacienteRepository.findByEmail(email)
                .map(Paciente::getDni)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró un paciente con el correo: " + email));
    }


}
