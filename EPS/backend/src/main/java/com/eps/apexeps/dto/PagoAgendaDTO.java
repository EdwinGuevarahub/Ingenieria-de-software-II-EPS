package com.eps.apexeps.dto;

import java.time.LocalDateTime;

/**
 * DTO para registrar un pago en la agenda.
 * Contiene el id de la agenda y la fecha de pago.
 * @author DCanas
 */
public class PagoAgendaDTO {
    private Long agendaId;
    private LocalDateTime fechaPago;

    public Long getAgendaId() {
        return agendaId;
    }

    public void setAgendaId(Long agendaId) {
        this.agendaId = agendaId;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
}