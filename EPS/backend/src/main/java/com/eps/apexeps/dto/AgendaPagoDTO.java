package com.eps.apexeps.dto;

import java.time.Instant;

/**
 * DTO para retornar la información mínima al registrar un pago,
 * evitando la serialización de relaciones complejas como `generaciones`.
 * @author DCanas
 */
public class AgendaPagoDTO {

    private Long agendaId;
    private Instant fechaPago;
    private String estado;

    public AgendaPagoDTO() {
    }

    public AgendaPagoDTO(Long agendaId, Instant fechaPago, String estado) {
        this.agendaId = agendaId;
        this.fechaPago = fechaPago;
        this.estado = estado;
    }

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
