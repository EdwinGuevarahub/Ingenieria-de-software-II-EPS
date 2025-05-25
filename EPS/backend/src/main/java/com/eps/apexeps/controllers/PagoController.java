package com.eps.apexeps.controllers;

import com.eps.apexeps.dto.PagoDTO;
import com.eps.apexeps.dto.PagoAgendaDTO;
import com.eps.apexeps.dto.AgendaPagoDTO;
import com.eps.apexeps.services.PagoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controlador REST para gestión de pagos (GET y POST).
 * Permite consultar y registrar pagos realizados por un paciente.
 */
@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    /**
     * Consulta pagos realizados por un paciente, con filtros de fecha y paginación.
     */
    @GetMapping
    public ResponseEntity<List<PagoDTO>> listarPagos(
            @RequestParam("pacienteId") Long pacienteId,
            @RequestParam(value = "desde", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime desde,
            @RequestParam(value = "hasta", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime hasta,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        if (desde == null) desde = LocalDateTime.of(2000, 1, 1, 0, 0);
         /**
     * Agregar una linea de codigo para que responda una alerta si als fechas estan al reves
     */
        if (hasta == null) hasta = LocalDateTime.now();

        List<PagoDTO> pagos = pagoService.listarPagos(pacienteId, desde, hasta, page, size);
        return ResponseEntity.ok(pagos);
    }

    /**
     * Registra el pago de una agenda médica por parte de un paciente.
     */
    @PostMapping
    public ResponseEntity<AgendaPagoDTO> registrarPago(
            @RequestParam("pacienteId") Long pacienteId,
            @RequestBody PagoAgendaDTO dto
    ) {
        AgendaPagoDTO agendaActualizada = pagoService.registrarPago(pacienteId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(agendaActualizada);
    }
}
