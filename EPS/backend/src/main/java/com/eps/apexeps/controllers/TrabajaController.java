/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.DTOs.response.HorarioTrabajaEntradaLista;
import com.eps.apexeps.models.entity.relations.Trabaja;
import com.eps.apexeps.models.entity.users.Medico;
import com.eps.apexeps.services.AdmIpsService;
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

    @Autowired
    private AdmIpsService admIpsService;

    @GetMapping("{dniMedico}/trabaja")
    public ResponseEntity<List<HorarioTrabajaEntradaLista>> findByMedico_Dni(
            @PathVariable long dniMedico) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer idIpsAdm = admIpsService.findIdIpsByEmail(authentication.getName());
        List<Trabaja> trabajos = trabajaService.findByMedico_Dni(dniMedico, idIpsAdm);
        return ResponseEntity.ok(
                trabajos.stream()
                        .map(HorarioTrabajaEntradaLista::of)
                        .toList());
    }

    @PostMapping("/{dniMedico}/trabaja")
    public ResponseEntity<?> crearTrabaja(
            @PathVariable long dniMedico,
            @RequestBody HorarioTrabajaEntradaLista trabajaDTO) {
        Integer idIps = trabajaDTO.getIdIps();
        if (!isAdmIpsOfIdIps(idIps)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("El administrador no pertenece a la IPS del consultorio.");
        }

        if (trabajaDTO.getIdTrabaja() != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El campo idTrabaja debe estar vacío");
    
        Trabaja trabaja = HorarioTrabajaEntradaLista.toTrabaja(trabajaDTO);
        trabaja.setMedico(Medico.builder().dni(dniMedico).build());

        try {
            trabaja = trabajaService.crearTrabaja(dniMedico, trabaja);
            return ResponseEntity.status(HttpStatus.CREATED).body(HorarioTrabajaEntradaLista.of(trabaja));
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
            @RequestBody HorarioTrabajaEntradaLista trabajaDTO) {
        Integer idIps = trabajaDTO.getIdIps();
        if (!isAdmIpsOfIdIps(idIps)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("El administrador no pertenece a la IPS del consultorio.");
        }

        Trabaja trabaja = HorarioTrabajaEntradaLista.toTrabaja(trabajaDTO);
        trabaja.setId(idTrabaja);
        trabaja.setMedico(Medico.builder().dni(dniMedico).build());

        try {
            trabaja = trabajaService.actualizarTrabaja(dniMedico, idTrabaja, trabaja);
            return ResponseEntity.ok(HorarioTrabajaEntradaLista.of(trabaja));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Verifica si el administrador de la sesión actual pertenece a la IPS del
     * consultorio.
     * 
     * @param idIps El id de la IPS del consultorio.
     * @return true si el administrador no pertenece a la IPS, false en caso
     *         contrario.
     */
    private boolean isAdmIpsOfIdIps(Integer idIps) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Integer idIpsAdm = admIpsService.findIdIpsByEmail(authentication.getName());
        return idIpsAdm.equals(idIps);
    }

}
