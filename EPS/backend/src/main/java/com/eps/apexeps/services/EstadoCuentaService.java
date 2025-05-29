package com.eps.apexeps.services;

import com.eps.apexeps.dto.EstadoCuentaDTO;
import com.eps.apexeps.dto.FacturaDTO;
import com.eps.apexeps.dto.FacturaDetalleDTO;
import com.eps.apexeps.dto.ServicioDTO;
import com.eps.apexeps.models.relations.PagoAfiliacion;
import com.eps.apexeps.repositories.PagoAfiliacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadoCuentaService {

    @Autowired
    private PagoAfiliacionRepository pagoRepo;

    /**
     * Consulta el estado de cuenta de un paciente con paginación.
     */
    public EstadoCuentaDTO consultarEstadoCuenta(Long pacienteId, LocalDateTime desde, LocalDateTime hasta, int page, int size) {
        List<PagoAfiliacion> pagos = pagoRepo.findByIdPacienteId(pacienteId);

        // Filtrar por fechas si se especifican
        if (desde != null) {
            pagos = pagos.stream()
                    .filter(p -> !p.getId().getFecha().isBefore(desde))
                    .collect(Collectors.toList());
        }
        if (hasta != null) {
            pagos = pagos.stream()
                    .filter(p -> !p.getId().getFecha().isAfter(hasta))
                    .collect(Collectors.toList());
        }

        // Total facturado (antes de paginar)
        BigDecimal total = pagos.stream()
                .map(p -> BigDecimal.valueOf(p.getTarifa())) // Should return BigDecimal
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aplicar paginación manual
        int fromIndex = Math.min(page * size, pagos.size());
        int toIndex = Math.min(fromIndex + size, pagos.size());
        List<PagoAfiliacion> pagina = pagos.subList(fromIndex, toIndex);

        // Construir DTO de facturas para la página actual
        List<FacturaDTO> facturas = new ArrayList<>();
        int contador = fromIndex + 1;
        for (PagoAfiliacion pago : pagina) {
            String estado = pago.getId().getFecha().isBefore(LocalDateTime.now()) ? "pagada" : "pendiente";
            facturas.add(new FacturaDTO(
                    (long) contador++,
                    pago.getId().getFecha().toString(),
                    BigDecimal.valueOf(pago.getTarifa()), // If getTarifa() returns double
                    estado
            ));
        }

        // Total pagado (sobre todos los pagos, no sólo la página)
        BigDecimal pagado = pagos.stream()
                .filter(p -> p.getId().getFecha().isBefore(LocalDateTime.now()))
                .map(p -> BigDecimal.valueOf(p.getTarifa())) // Convert Double to BigDecimal
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new EstadoCuentaDTO(total.subtract(pagado), pagado, facturas);
    }

    /**
     * Consulta el estado de cuenta completo sin paginación.
     */
    public EstadoCuentaDTO consultarEstadoCuenta(Long pacienteId, LocalDateTime desde, LocalDateTime hasta) {
        return consultarEstadoCuenta(pacienteId, desde, hasta, 0, Integer.MAX_VALUE);
    }

    /**
     * Consulta el detalle de una factura específica para un paciente.
     * Actualmente implementado con datos simulados.
     */
    public FacturaDetalleDTO obtenerDetalleFactura(Long facturaId, Long pacienteId) {
        List<ServicioDTO> detalles = new ArrayList<>();
        detalles.add(new ServicioDTO("consulta médica", new BigDecimal("50000")));
        detalles.add(new ServicioDTO("examen de sangre", new BigDecimal("20000")));

        return new FacturaDetalleDTO(
                facturaId,
                "2025-05-01",
                new BigDecimal("70000"),
                "pendiente",
                detalles
        );
    }
}
