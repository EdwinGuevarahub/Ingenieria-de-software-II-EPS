package com.eps.apexeps.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO que representa el detalle de una factura específica en el estado de cuenta.
 * Incluye información general de la factura y una lista de servicios asociados.
 *
 * @author DCanas
 */
public class FacturaDetalleDTO {

    private Long id;
    private String fecha;
    private BigDecimal monto;
    private String estado;
    private String tipo;        // Nuevo campo
    private String descripcion; // Nuevo campo
    private List<ServicioDTO> detalles;

    // Constructor vacío (requerido para frameworks como Jackson)
    public FacturaDetalleDTO() {
    }

    // Constructor completo
    public FacturaDetalleDTO(Long id, String fecha, BigDecimal monto, String estado, String tipo, String descripcion, List<ServicioDTO> detalles) {
        this.id = id;
        this.fecha = fecha;
        this.monto = monto;
        this.estado = estado;
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.detalles = detalles;
    }

    // Getters y setters
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

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public List<ServicioDTO> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<ServicioDTO> detalles) {
        this.detalles = detalles;
    }
}
