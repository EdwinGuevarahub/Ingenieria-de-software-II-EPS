/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.services.TrabajaService;


/**
 *
 * @author Alexander
 */
@RestController
@RequestMapping("/api/medico/trabaja")
@CrossOrigin(origins = "http://localhost:3000")
public class TrabajaController {

    @Autowired
    private TrabajaService trabajaService;

    @GetMapping("/all")
    public List<Trabaja> findAll() {
        return trabajaService.findAll();
    }

    @GetMapping("/dni/")
    public List<Trabaja> findByMedico_Dni(
        @RequestParam(required = false) long dniMedico) {
            System.out.println("DNI Medico: " + dniMedico);
        return trabajaService.findByMedico_Dni(dniMedico);
    }
    
    @GetMapping("/filtrar")
    public List<Medico> filtrarMedicosPorHorario(@RequestParam String horario) {
        return trabajaService.filtrarMedicosPorDisponibilidad(horario);
    }
}
