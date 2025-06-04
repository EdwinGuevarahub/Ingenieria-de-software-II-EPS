package com.eps.apexeps.controllers;

import com.eps.apexeps.models.entity.users.Paciente;
import com.eps.apexeps.repositories.PacienteRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class PacienteController {

    private final PacienteRepository pacienteRepository;

    @GetMapping
    public List<Paciente> getAllUsers() {
        return pacienteRepository.findAll();
    }

    @GetMapping("/pacientes/{dni}")
    public ResponseEntity<?> getPacienteByDni(@PathVariable Long dni) {
        Optional<Paciente> paciente = pacienteRepository.findById(dni);
        if (paciente.isPresent()) {
            return ResponseEntity.ok(paciente.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public Paciente createUser(@RequestBody Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

}
