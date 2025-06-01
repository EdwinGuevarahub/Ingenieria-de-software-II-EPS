package com.eps.apexeps.dto;

import java.time.Instant;

/**
 * DTO para registrar un pago en la agenda.
 * Contiene el id de la agenda y la fecha de pago.
 * @author DCanas
 */
public class PagoAgendaDTO {
    private Long agendaId;
    private Instant fechaPago;

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
}