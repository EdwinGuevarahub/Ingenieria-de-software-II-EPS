package com.eps.apexeps.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import com.eps.apexeps.models.FormulaMedicaRequest;
import com.eps.apexeps.services.FormulaMedicaService;

@RestController
public class DetalleFormulaController {

    @Autowired
    private FormulaMedicaService formulaMedicaService;

    @PostMapping("/api/formulas")
    @ResponseBody
    public ResponseEntity<?> crearFormulaMedica(@RequestBody FormulaMedicaRequest request) {
        try {
            formulaMedicaService.procesarFormulaMedica(request);
            return new ResponseEntity<>("Fórmula médica creada exitosamente", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al crear la fórmula médica: " + e.getMessage(), 
                                        HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
