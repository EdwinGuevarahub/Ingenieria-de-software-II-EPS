package com.eps.apexeps.dto;

import java.math.BigDecimal;

/**
 * DTO que representa una factura individual del estado de cuenta.
 * Incluye un identificador, fecha, monto y estado de la factura (pagada o pendiente).
 *
 * @author DCanas
 */
public class FacturaDTO {

    private Long id;
    private String fecha;
    private BigDecimal monto;
    private String estado;

    // Constructor completo
    public FacturaDTO(Long id, String fecha, BigDecimal tarifa, String estado) {
        this.id = id;
        this.fecha = fecha;
        this.monto = tarifa;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFecha() {
        return fecha;
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}
