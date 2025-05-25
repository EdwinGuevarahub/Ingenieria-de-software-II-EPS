package com.eps.apexeps.models.relations;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Embeddable
public class PagoAfiliacionId implements Serializable {

    @Column(name = "paciente_pagoafiliacion", nullable = false)
    private Long pacienteId;

    @Column(name = "f_pagoafiliacion", nullable = false)
    private LocalDateTime fecha;

    // Getters y setters
    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    // equals y hashCode obligatorios para claves compuestas
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PagoAfiliacionId)) return false;
        PagoAfiliacionId that = (PagoAfiliacionId) o;
        return Objects.equals(pacienteId, that.pacienteId) &&
               Objects.equals(fecha, that.fecha);
    }

    @Override
    public int hashCode() {
        return Objects.hash(pacienteId, fecha);
    }
}
