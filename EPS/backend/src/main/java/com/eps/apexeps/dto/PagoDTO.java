package com.eps.apexeps.dto;

import java.time.LocalDateTime;

/**
 * DTO que representa los pagos realizados por un paciente.
 * Incluye información de agenda, fechas y estado.
 * @author DCanas
 */
public class PagoDTO {

    private Long agendaId;
    private Long pacienteId;
    private LocalDateTime fechaAgenda;
    private LocalDateTime fechaPago;
    private String estado;

    public PagoDTO() {
        // Constructor vacío necesario para setters
    }

    public PagoDTO(Long agendaId, Long pacienteId, LocalDateTime fechaAgenda, LocalDateTime fechaPago, String estado) {
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

    public LocalDateTime getFechaAgenda() {
        return fechaAgenda;
    }

    public void setFechaAgenda(LocalDateTime fechaAgenda) {
        this.fechaAgenda = fechaAgenda;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
