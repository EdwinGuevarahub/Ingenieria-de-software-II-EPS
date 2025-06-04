package com.eps.apexeps.controllers;

import com.eps.apexeps.models.DTOs.AfiliacionDto;
import com.eps.apexeps.services.AfiliacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AfiliacionController {

    private final AfiliacionService afiliacionService;

    @PostMapping("/afiliacion")
    public ResponseEntity<?> registrarAfiliacion(@RequestBody AfiliacionDto dto) {
        Long afiliacionId = afiliacionService.registrarAfiliacion(dto);
        return ResponseEntity.status(201).body(
            new AfiliacionResponse(afiliacionId, "activo")
        );
    }

    record AfiliacionResponse(Long afiliacionId, String estado) {}
}