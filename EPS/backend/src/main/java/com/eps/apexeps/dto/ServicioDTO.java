package com.eps.apexeps.dto;

import java.math.BigDecimal;

/**
 * DTO que representa un servicio incluido en una factura detallada.
 * Contiene el nombre del servicio y su costo asociado.
 *
 * Autor: DCanas
 */
public class ServicioDTO {

    private String servicio;
    private BigDecimal costo;

    // Constructor vacío requerido por frameworks como Jackson
    public ServicioDTO() {
    }

    // Constructor completo
    public ServicioDTO(String servicio, BigDecimal costo) {
        this.servicio = servicio;
        this.costo = costo;
    }

    // Getters y setters
    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public BigDecimal getCosto() {
        return costo;
    }

    public void setCosto(BigDecimal costo) {
        this.costo = costo;
    }
}
