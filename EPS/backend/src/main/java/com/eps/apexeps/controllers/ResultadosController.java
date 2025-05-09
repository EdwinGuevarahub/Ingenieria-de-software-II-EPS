package com.eps.apexeps.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eps.apexeps.models.Diagnostico;
import com.eps.apexeps.models.Medicamento;
import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.response.ApiResponse;
import com.eps.apexeps.models.DTOs.Orden;
import com.eps.apexeps.models.DTOs.ResultadoDiagnostico;

import com.eps.apexeps.services.ResultadosService;

import java.util.List;

/**
 * Controlador para manejar las operaciones relacionadas con
 * los resultados y diagnosticos.
 */
@RestController
@RequestMapping("/api/resultados")
public class ResultadosController {

        @Autowired
        private ResultadosService resultadosService;

        // Obtener las citas (agenda) en estado PENDIENTE de un paciente
        @GetMapping("/citas")
        public List<Agenda> getCitasPaciente(@RequestParam Long dniPaciente) {
                return resultadosService.getCitasPaciente(dniPaciente);
        }

        // Obtener lista de diagnosticos
        @GetMapping("/lista-diagnosticos")
        public List<Diagnostico> getListaDiagnosticos() {
                return resultadosService.getListaDiagnosticos();
        }

        // Obtener lista de medicamentos
        @GetMapping("/lista-medicamentos")
        public List<Medicamento> getListaMedicamentos() {
                return resultadosService.getListaMedicamentos();
        }

        // Registrar resultados de una cita (agenda)
        // Actualizando el resultado general de una cita y
        // Registrando diagnosticos con sus respectivos medicamentos
        @PostMapping("/actualizar-resultados")
        public ResponseEntity<ApiResponse> actualizarResultados(@RequestBody ResultadoDiagnostico resultados) {
                try {
                        resultadosService.actualizarResultados(resultados);

                        return ResponseEntity.ok(new ApiResponse(
                                        HttpStatus.OK.value(),
                                        true,
                                        "Resultados actualizados y registrados correctamente.",
                                        null));
                } catch (RuntimeException ex) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                                        HttpStatus.NOT_FOUND.value(),
                                        false,
                                        ex.getMessage(),
                                        null));
                } catch (Exception ex) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                        false,
                                        "Error inesperado al procesar la solicitud.",
                                        null));
                }
        }

        // Crear las ordenes (Resmisión o Examen) asociadas a una cita (agenda)
        @PostMapping("/ordenes")
        public ResponseEntity<ApiResponse> crearOrdenes(@RequestBody List<Orden> ordenes) {
                try {
                        resultadosService.crearOrdenes(ordenes);

                        return ResponseEntity.ok(new ApiResponse(
                                        HttpStatus.OK.value(),
                                        true,
                                        "Órdenes creadas exitosamente",
                                        null));
                } catch (RuntimeException ex) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(
                                        HttpStatus.NOT_FOUND.value(),
                                        false,
                                        ex.getMessage(),
                                        null));
                } catch (Exception ex) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(
                                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                        false,
                                        "Error inesperado al crear las órdenes",
                                        null));
                }
        }
}
