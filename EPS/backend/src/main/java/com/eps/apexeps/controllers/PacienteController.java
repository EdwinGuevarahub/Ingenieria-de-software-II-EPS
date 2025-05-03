package com.eps.apexeps.controllers;

import com.eps.apexeps.models.users.Paciente;
import com.eps.apexeps.repositories.PacienteRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class PacienteController {

    private final PacienteRepository pacienteRepository;

    @GetMapping
    public List<Paciente> getAllUsers() {
        return pacienteRepository.findAll();
    }

    @PostMapping
    public Paciente createUser(@RequestBody Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

}
