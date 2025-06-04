package com.eps.apexeps.dto;

import java.time.Instant;

/**
 * DTO para registrar un pago en la agenda.
 * Contiene el id de la agenda, la fecha de pago y el estado.
 * @author DCanas
 */
public class PagoAgendaDTO {
    private Long agendaId;
    private Instant fechaPago;
    private String estado; // Nuevo campo para el estado de la agenda

    public Long getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Long agendaId) {
        this.agendaId = agendaId;
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