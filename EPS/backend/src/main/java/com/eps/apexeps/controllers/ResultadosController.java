package com.eps.apexeps.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eps.apexeps.models.DTOs.response.ApiResponse;
import com.eps.apexeps.models.DTOs.PacienteCitasDTO;
import com.eps.apexeps.models.DTOs.ResultadoDiagnosticoDTO;
import com.eps.apexeps.models.entity.Diagnostico;
import com.eps.apexeps.models.entity.Medicamento;
import com.eps.apexeps.models.entity.ServicioMedico;
import com.eps.apexeps.models.entity.relations.Agenda;

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

        // Obtener lista de servicios medicos
        @GetMapping("/lista-servicios")
        public List<ServicioMedico> getListaServiciosMedicos() {
                return resultadosService.getListaServiciosMedicos();
        }

        // Obtener las citas (agenda) en estado PENDIENTE de un paciente
        @GetMapping("/citas")
        public ResponseEntity<ApiResponse> getCitasPaciente(@RequestParam Long dniPaciente) {
                try {
                        PacienteCitasDTO pacienteCitas = resultadosService.getCitasPaciente(dniPaciente);
                        return ResponseEntity.ok(new ApiResponse(
                                        HttpStatus.OK.value(),
                                        true,
                                        "Resultados actualizados y registrados correctamente.",
                                        pacienteCitas));
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

        // Registrar resultado de una cita (agenda)
        // Actualizando el resultado general de una cita y
        // Registrando el diagnostico con sus respectivos medicamentos
        // O Registrando el diagnostico con su respectiva remisión
        @PostMapping()
        public ResponseEntity<ApiResponse> registrarResultado(@RequestBody ResultadoDiagnosticoDTO resultados) {
                try {
                        resultadosService.registrarResultado(resultados);
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

        // Actualizar unicamente el resultado de una agenda
        @PutMapping("/{id}")
        public ResponseEntity<ApiResponse> actualizarResultadoAgenda(@PathVariable Integer id,
                        @RequestBody Agenda agenda) {
                try {
                        resultadosService.actualizarResultadoAgenda(id, agenda);
                        return ResponseEntity.ok(new ApiResponse(
                                        HttpStatus.OK.value(),
                                        true,
                                        "Resultado de la agenda registrado exitosamente",
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
                                        "Error inesperado al registrar el resultado de la agenda",
                                        null));
                }
        }
}
