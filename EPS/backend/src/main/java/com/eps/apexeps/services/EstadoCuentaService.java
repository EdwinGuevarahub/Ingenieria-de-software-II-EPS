package com.eps.apexeps.services;

import com.eps.apexeps.dto.EstadoCuentaDTO;
import com.eps.apexeps.dto.FacturaDTO;
import com.eps.apexeps.dto.FacturaDetalleDTO;
import com.eps.apexeps.dto.ServicioDTO;
import com.eps.apexeps.models.entity.relations.PagoAfiliacion;
import com.eps.apexeps.models.entity.relations.Agenda;
import com.eps.apexeps.models.entity.relations.Despacha;
import com.eps.apexeps.repositories.PagoAfiliacionRepository;
import com.eps.apexeps.repositories.AgendaRepository;
import com.eps.apexeps.repositories.DespachaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class EstadoCuentaService {

    public static final BigDecimal VALOR_CITA_DEFAULT = BigDecimal.valueOf(10000);
    public static final BigDecimal VALOR_DESPACHA_DEFAULT = BigDecimal.valueOf(80);

    @Autowired
    private PagoAfiliacionRepository pagoRepo;
    @Autowired
    private AgendaRepository agendaRepo;
    @Autowired
    private DespachaRepository despachaRepo;

    /**
     * Consulta el estado de cuenta de un paciente con paginación.
     */
    public EstadoCuentaDTO consultarEstadoCuenta(Long pacienteId, Instant desde, Instant hasta, int page, int size) {
        List<FacturaDTO> facturas = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        BigDecimal pagado = BigDecimal.ZERO;

        // 1. Suscripciones (pago_afiliacion)
        List<PagoAfiliacion> pagos = pagoRepo.findByIdPacienteDni(pacienteId);
        for (PagoAfiliacion pago : pagos) {
            String estado = pago.getId().getFechaPagoAfiliacion().isBefore(Instant.now()) ? "pagada" : "pendiente";
            List<ServicioDTO> detalles = List.of(new ServicioDTO("Pago de afiliación", pago.getTarifa()));
            // Afiliación
            facturas.add(new FacturaDTO(
                pago.getId().getFechaPagoAfiliacion().toEpochMilli(),
                pago.getId().getFechaPagoAfiliacion().toString(),
                pago.getTarifa(),
                estado,
                "AFILIACION",
                detalles
            ));
            total = total.add(pago.getTarifa());
            if (estado.equals("pagada")) pagado = pagado.add(pago.getTarifa());
        }

        // 2. Citas médicas (agenda)
        List<Agenda> agendas = agendaRepo.findByPaciente_Dni(pacienteId);
        for (Agenda agenda : agendas) {
            if (agenda.getFechaPago() != null) {
                String estado = agenda.getFechaPago().isBefore(Instant.now()) ? "pagada" : "pendiente";
                BigDecimal valorCita = VALOR_CITA_DEFAULT;
                List<ServicioDTO> detalles = List.of(new ServicioDTO("Pago de cita médica", valorCita));
                // Cita médica
                facturas.add(new FacturaDTO(
                    agenda.getFechaPago().toEpochMilli(),
                    agenda.getFechaPago().toString(),
                    valorCita,
                    estado,
                    "CITA_MEDICA",
                    detalles
                ));
                total = total.add(valorCita);
                if (estado.equals("pagada")) pagado = pagado.add(valorCita);
            }
        }

        // 3. Medicamentos (despacha)
        List<Despacha> despachos = despachaRepo.findByPacienteDni(pacienteId);
        for (Despacha despacha : despachos) {
            BigDecimal valorDespacha = VALOR_DESPACHA_DEFAULT;
            String descMedicamento = "Medicamento despachado";
            if (despacha.getInventaria() != null && despacha.getInventaria().getMedicamento() != null) {
                descMedicamento = despacha.getInventaria().getMedicamento().getNombre();
                if (despacha.getInventaria().getMedicamento().getValorMedicamento() != null) {
                    valorDespacha = despacha.getInventaria().getMedicamento().getValorMedicamento();
                }
            }
            String estado = despacha.getFecha().isBefore(Instant.now()) ? "pagada" : "pendiente";
            List<ServicioDTO> detalles = List.of(new ServicioDTO(descMedicamento, valorDespacha));
            // Medicamento
            facturas.add(new FacturaDTO(
                despacha.getFecha().toEpochMilli(),
                despacha.getFecha().toString(),
                valorDespacha,
                estado,
                "MEDICAMENTO",
                detalles
            ));
            total = total.add(valorDespacha);
            if (estado.equals("pagada")) pagado = pagado.add(valorDespacha);
        }

        // Paginación manual
        int fromIndex = Math.min(page * size, facturas.size());
        int toIndex = Math.min(fromIndex + size, facturas.size());
        List<FacturaDTO> pagina = facturas.subList(fromIndex, toIndex);

        return new EstadoCuentaDTO(total.subtract(pagado), pagado, pagina);
    }

    /**
     * Consulta el estado de cuenta completo sin paginación.
     */
    public EstadoCuentaDTO consultarEstadoCuenta(Long pacienteId, Instant desde, Instant hasta) {
        return consultarEstadoCuenta(pacienteId, desde, hasta, 0, Integer.MAX_VALUE);
    }

    /**
     * Consulta el detalle de una factura específica para un paciente.
     */
    public FacturaDetalleDTO obtenerDetalleFactura(Long facturaId, Long pacienteId) {
        // Buscar en pago_afiliacion
        Instant fechaFactura = Instant.ofEpochMilli(facturaId);
        List<PagoAfiliacion> pagos = pagoRepo.findByIdPacienteDniAndIdFechaPagoAfiliacion(pacienteId, fechaFactura);
        if (!pagos.isEmpty()) {
            PagoAfiliacion pago = pagos.get(0);
            List<ServicioDTO> detalles = List.of(new ServicioDTO("Pago de afiliación", pago.getTarifa()));
            String estado = pago.getId().getFechaPagoAfiliacion().isBefore(Instant.now()) ? "pagada" : "pendiente";
            return new FacturaDetalleDTO(
                    facturaId,
                    pago.getId().getFechaPagoAfiliacion().toString(),
                    pago.getTarifa(),
                    estado,
                    "AFILIACION",
                    "Pago de afiliación",
                    detalles
            );
        }

        // Buscar en agenda
        List<Agenda> agendas = agendaRepo.findByPaciente_Dni(pacienteId);
        for (Agenda agenda : agendas) {
            if (agenda.getFechaPago() != null && agenda.getFechaPago().toEpochMilli() == facturaId) {
                BigDecimal valorCita = VALOR_CITA_DEFAULT;
                List<ServicioDTO> detalles = List.of(new ServicioDTO("Pago de cita médica", valorCita));
                String estado = agenda.getFechaPago().isBefore(Instant.now()) ? "pagada" : "pendiente";
                return new FacturaDetalleDTO(
                        facturaId,
                        agenda.getFechaPago().toString(),
                        valorCita,
                        estado,
                        "CITA_MEDICA",
                        "Consulta médica",
                        detalles
                );
            }
        }

        // Buscar en despacha
        List<Despacha> despachos = despachaRepo.findByPacienteDni(pacienteId);
        for (Despacha despacha : despachos) {
            if (despacha.getFecha().toEpochMilli() == facturaId) {
                BigDecimal valorDespacha = despacha.getInventaria().getMedicamento().getValorMedicamento();
                List<ServicioDTO> detalles = List.of(new ServicioDTO("Medicamento despachado", valorDespacha));
                String estado = despacha.getFecha().isBefore(Instant.now()) ? "pagada" : "pendiente";
                String descMedicamento = "Medicamento despachado";
                if (despacha.getInventaria() != null && despacha.getInventaria().getMedicamento() != null) {
                    descMedicamento = despacha.getInventaria().getMedicamento().getNombre();
                }
                return new FacturaDetalleDTO(
                        facturaId,
                        despacha.getFecha().toString(),
                        valorDespacha,
                        estado,
                        "MEDICAMENTO",
                        descMedicamento,
                        detalles
                );
            }
        }

        throw new RuntimeException("Factura no encontrada para el paciente y fecha especificados.");
    }
}
