/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.relations.EntradaHorario;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.services.TrabajaService;

/**
 *
 * @author Alexander
 */
@RestController
@RequestMapping("/api/medico")
@CrossOrigin(origins = "http://localhost:3000")
public class TrabajaController {

    @Autowired
    private TrabajaService trabajaService;

    @GetMapping("/trabaja/all")
    public List<Trabaja> findAll() {
        return trabajaService.findAll();
    }

    @GetMapping("/trabaja/dni/")
    public List<Trabaja> findByMedico_Dni(
            @RequestParam(required = false) long dniMedico) {
        System.out.println("DNI Medico: " + dniMedico);
        return trabajaService.findByMedico_Dni(dniMedico);
    }

    @GetMapping("/{dniMedico}/trabaja/{idTrabaja}/{dia}")
    public EntradaHorario obtenerHorarioPorDia(
            @PathVariable Long dniMedico,
            @PathVariable Integer idTrabaja,
            @PathVariable DayOfWeek dia) {
        return trabajaService.obtenerEntradaPorDia(dniMedico, idTrabaja, dia);
    }

    @GetMapping("/{dniMedico}/full/trabaja/{idTrabaja}/{dia}")
    public Trabaja obtenerTrabajaPorDia(
            @PathVariable Long dniMedico,
            @PathVariable Integer idTrabaja,
            @PathVariable DayOfWeek dia) {
        return trabajaService.obtenerTrabajaConDia(dniMedico, idTrabaja, dia);
    }

    @GetMapping("/trabaja/filtrar")
    public List<Medico> filtrarMedicosPorHorario(@RequestParam String horario) {
        return trabajaService.filtrarMedicosPorDisponibilidad(horario);
    }

    @PostMapping("/trabaja")
    public ResponseEntity<?> crearTrabaja(@RequestBody Trabaja nuevoTrabaja) {
        try {
            Trabaja guardado = trabajaService.crearTrabaja(nuevoTrabaja);
            return ResponseEntity.ok(guardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{dniMedico}/trabaja")
    public ResponseEntity<?> crearTrabaja(
            @PathVariable long dniMedico,
            @RequestBody Trabaja trabaja) {
        try {
            trabajaService.crearTrabaja(dniMedico, trabaja);
            return ResponseEntity.status(HttpStatus.CREATED).body("Horario creado exitosamente.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno: " + e.getMessage());
        }
    }

    @PutMapping("/{dniMedico}/trabaja/{idTrabaja}")
    public ResponseEntity<?> actualizarHorario(
            @PathVariable long dniMedico,
            @PathVariable int idTrabaja,
            @RequestBody Trabaja trabajaActualizado) {
        try {
            Trabaja actualizado = trabajaService.actualizarTrabaja(dniMedico, idTrabaja, trabajaActualizado);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
