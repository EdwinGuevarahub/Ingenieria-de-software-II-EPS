package com.eps.apexeps.dto;

import java.time.Instant;

/**
 * DTO que representa los pagos realizados por un paciente.
 * Incluye información de agenda, fechas y estado.
 * @author DCanas
 */
public class PagoDTO {

    private Long agendaId;
    private Long pacienteId;
    private Instant fechaAgenda;
    private Instant fechaPago;
    private String estado;

    public PagoDTO() {
        // Constructor vacío necesario para setters
    }

    public PagoDTO(Long agendaId, Long pacienteId, Instant fechaAgenda, Instant fechaPago, String estado) {
        this.agendaId = agendaId;
        this.pacienteId = pacienteId;
        this.fechaAgenda = fechaAgenda;
        this.fechaPago = fechaPago;
        this.estado = estado;
    }

    public Long getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Long agendaId) {
        this.agendaId = agendaId;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Instant getFechaAgenda() {
        return fechaAgenda;
    }

    public void setFechaAgenda(Instant fechaAgenda) {
        this.fechaAgenda = fechaAgenda;
    }

    public Instant getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(Instant fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
