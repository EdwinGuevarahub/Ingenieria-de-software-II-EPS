/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.relations.EntradaHorario;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.repositories.TrabajaRepository;

/**
 *
 * @author Alexander
 */
@Service
public class TrabajaService {

    @Autowired
    private TrabajaRepository trabajaRepository;

    public List<Trabaja> findAll() {
        return trabajaRepository.findAll();
    }

    public List<Trabaja> findByMedico_Dni(long dniMedico) {
        return trabajaRepository.findByMedico_Dni(dniMedico);
    }

    public Trabaja findByIdTrabaja(int idTrabaja) {
        return trabajaRepository.findById(idTrabaja).orElse(null);
    }

    public Optional<Trabaja> findTrabajaByIdAndMedicoDni(Integer idTrabaja, Long dniMedico) {
        Optional<Trabaja> trabajaOpt = trabajaRepository.findById(idTrabaja);
        if (trabajaOpt.isPresent()) {
            Trabaja trabaja = trabajaOpt.get();
            // Asumiendo que Trabaja tiene un getMedico() y Medico tiene getDniMedico()
            if (trabaja.getMedico() != null && trabaja.getMedico().getDniMedico().equals(dniMedico)) {
                return Optional.of(trabaja);
            }
        }
        return Optional.empty();
    }

    // Dentro de TrabajaService
    public Trabaja findTrabajoByIdAndMedicoDniAndDia(int idTrabaja, long dniMedico, String diaSemana) {
        // Asume un método en el repositorio o lógica para filtrar
        // Esto es más simple si idTrabaja es único y ya contiene el día.
        // Si no, necesitas una lógica más compleja o un query específico.
        Trabaja trabajo = trabajaRepository.findById(idTrabaja).orElse(null);
        if (trabajo != null &&
                trabajo.getMedico().getDni().equals(dniMedico) &&
                trabajo.getDiaSemana().equalsIgnoreCase(diaSemana)) {
            return trabajo;
        }
        // Alternativa si tienes un método directo en el repo:
        // return trabajaRepository.findByIdAndMedicoDniAndDiaSemana(idTrabaja,
        // dniMedico, diaSemana);
        return null;
    }

    public void probarTrabaja() {
        List<Trabaja> trabajaList = trabajaRepository.findAll();

        for (Trabaja t : trabajaList) {
            System.out.println("Médico: " + t.getMedico().getNombre());
        }
    }

    public List<Medico> filtrarMedicosPorDisponibilidad(String entradaHorarioStr) {
        EntradaHorario filtro = EntradaHorario.valueOf(entradaHorarioStr);

        List<Trabaja> trabajaList = trabajaRepository.findAll();

        return trabajaList.stream()
                .filter(t -> tieneDisponibilidad(t, filtro))
                .map(Trabaja::getMedico) // <- Aquí es donde estaba el error
                .distinct()
                .collect(Collectors.toList());
    }

    private boolean tieneDisponibilidad(Trabaja trabaja, EntradaHorario filtro) {
        return trabaja.getHorario().stream().anyMatch(entrada -> entrada.getDia().equals(filtro.getDia()) &&
                !entrada.getInicio().isAfter(filtro.getInicio()) &&
                !entrada.getFin().isBefore(filtro.getFin()));
    }

}
