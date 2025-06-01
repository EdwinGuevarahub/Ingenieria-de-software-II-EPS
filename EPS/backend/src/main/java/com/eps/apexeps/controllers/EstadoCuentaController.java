package com.eps.apexeps.controllers;

import com.eps.apexeps.dto.EstadoCuentaDTO;
import com.eps.apexeps.dto.FacturaDetalleDTO;
import com.eps.apexeps.services.EstadoCuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

/**
 * Controlador REST para consultar el estado de cuenta de un paciente.
 * Soporta filtros por rango de fechas y paginación de resultados.
 * También permite consultar el detalle de una factura individual.
 *
 * @author DCanas
 */
@RestController
@RequestMapping("/api/estado-cuenta")
public class EstadoCuentaController {

    @Autowired
    private EstadoCuentaService estadoCuentaService;

    /**
     * Consulta el estado de cuenta de un paciente.
     * Soporta parámetros opcionales de fecha y paginación.
     */
    @GetMapping
    public ResponseEntity<EstadoCuentaDTO> getEstadoCuenta(
            @RequestParam Long pacienteId,
            @RequestParam(value = "desde", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant desde,
            @RequestParam(value = "hasta", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant hasta,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                estadoCuentaService.consultarEstadoCuenta(pacienteId, desde, hasta, page, size)
        );
    }

    /**
     * Consulta el detalle de una factura específica para un paciente.
     */
    @GetMapping("/facturas/{id}")
    public ResponseEntity<FacturaDetalleDTO> consultarFacturaDetalle(
            @PathVariable("id") Long facturaId,
            @RequestParam("pacienteId") Long pacienteId) {

        FacturaDetalleDTO detalle = estadoCuentaService.obtenerDetalleFactura(facturaId, pacienteId);
        return ResponseEntity.ok(detalle);
    }
}
