package com.eps.apexeps.services;

import com.eps.apexeps.dto.PagoDTO;
import com.eps.apexeps.dto.PagoAgendaDTO;
import com.eps.apexeps.dto.AgendaPagoDTO;
import com.eps.apexeps.models.entity.relations.Agenda;
import com.eps.apexeps.repositories.AgendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para consultar y registrar pagos del paciente.
 * Incluye paginación y filtros de fecha.
 * @author DCanas
 */
@Service
public class PagoService {

    @Autowired
    private AgendaRepository agendaRepository;

    /**
     * Consulta pagos con filtros de fecha y paginación.
     */
    public List<PagoDTO> listarPagos(Long pacienteId, Instant desde, Instant hasta, int page, int size) {
        List<Agenda> agendas = agendaRepository.findByPaciente_DniAndFechaBetween(
                pacienteId,
                desde.atZone(ZoneId.systemDefault()).toInstant(),
                hasta.atZone(ZoneId.systemDefault()).toInstant()
        );

        int fromIndex = Math.min(page * size, agendas.size());
        int toIndex = Math.min(fromIndex + size, agendas.size());

        return agendas.subList(fromIndex, toIndex).stream()
            .map(agenda -> new PagoDTO(
                agenda.getId().longValue(),
                agenda.getPaciente().getDni(),
                agenda.getFecha(),
                agenda.getFechaPago() != null ? agenda.getFechaPago(): null,
                agenda.getEstado()
            ))
            .collect(Collectors.toList());
    }

    /**
     * Versión sin paginación explícita.
     */
    public List<PagoDTO> listarPagos(Long pacienteId, Instant desde, Instant hasta) {
        return listarPagos(pacienteId, desde, hasta, 0, Integer.MAX_VALUE);
    }

    /**
     * Registra el pago de una agenda médica.
     */
    public AgendaPagoDTO registrarPago(Long pacienteId, PagoAgendaDTO dto) {
        Agenda agenda = agendaRepository.findById(dto.getAgendaId().intValue())
            .orElseThrow(() -> new RuntimeException("Agenda no encontrada"));

        if (!agenda.getPaciente().getDni().equals(pacienteId)) {
            throw new RuntimeException("El paciente no coincide con la agenda.");
        }

        agenda.setFechaPago(dto.getFechaPago().atZone(ZoneId.systemDefault()).toInstant());
        Agenda actualizado = agendaRepository.save(agenda);

        return new AgendaPagoDTO(
            actualizado.getId().longValue(),
            actualizado.getFechaPago(),
            actualizado.getEstado()
        );
    }
}
