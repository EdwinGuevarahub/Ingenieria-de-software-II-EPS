package com.eps.apexeps.controllers;

import com.eps.apexeps.dto.HistoriaClinicaDto;
import com.eps.apexeps.services.HistoriaClinicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoriaClinicaController {

    private final HistoriaClinicaService historiaClinicaService;

    @GetMapping("/historia-clinica")
    public ResponseEntity<List<HistoriaClinicaDto>> obtenerHistoriaClinica(
            @RequestParam("pacienteId") Long pacienteId,
            @RequestParam(value = "desde", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(value = "hasta", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta
    ) {
        List<HistoriaClinicaDto> historia = historiaClinicaService.obtenerHistorialCompleto(pacienteId, desde, hasta);
        return ResponseEntity.ok(historia);
    }
}