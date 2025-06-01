package com.eps.apexeps.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO que representa el estado de cuenta de un paciente.
 * Incluye el saldo pendiente, el total pagado y la lista de facturas detalladas.
 *
 * @author DCanas
 */
public class EstadoCuentaDTO {

    private BigDecimal saldoPendiente;
    private BigDecimal totalPagado;
    private List<FacturaDTO> facturas;

    // Constructor vacío necesario para deserialización (por ejemplo, con Jackson)
    public EstadoCuentaDTO() {
    }

    // Constructor completo
    public EstadoCuentaDTO(BigDecimal saldoPendiente, BigDecimal totalPagado, List<FacturaDTO> facturas) {
        this.saldoPendiente = saldoPendiente;
        this.totalPagado = totalPagado;
        this.facturas = facturas;
    }

    // Getters y Setters
    public BigDecimal getSaldoPendiente() {
        return saldoPendiente;
    }

    public void setSaldoPendiente(BigDecimal saldoPendiente) {
        this.saldoPendiente = saldoPendiente;
    }

    public BigDecimal getTotalPagado() {
        return totalPagado;
    }

    public void setTotalPagado(BigDecimal totalPagado) {
        this.totalPagado = totalPagado;
    }

    public List<FacturaDTO> getFacturas() {
        return facturas;
    }

    public void setFacturas(List<FacturaDTO> facturas) {
        this.facturas = facturas;
    }
}
