package com.eps.apexeps.models.relations;

import java.time.Instant;
import java.util.List;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.users.Paciente;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "agenda")
public class Agenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agenda")
    private Long idAgenda;

    @Column(name = "paciente_agenda", nullable = false)
    private Long pacienteAgenda;

    @Column(name = "trabaja_agenda", nullable = false)
    private Integer trabajaAgenda;

    @Column(name = "f_agenda", nullable = false)
    private LocalDateTime fAgenda;

    @Column(name = "fpago_agenda")
    private LocalDateTime fpagoAgenda;

    @Column(name = "resultado_agenda")
    private String resultadoAgenda;

    @Column(name = "estado_agenda", nullable = false)
    private String estadoAgenda;

    // Getters y setters
    public Long getIdAgenda() {
        return idAgenda;
    }

    public void setIdAgenda(Long idAgenda) {
        this.idAgenda = idAgenda;
    }

    public Long getPacienteAgenda() {
        return pacienteAgenda;
    }

    public void setPacienteAgenda(Long pacienteAgenda) {
        this.pacienteAgenda = pacienteAgenda;
    }

    public Integer getTrabajaAgenda() {
        return trabajaAgenda;
    }

    public void setTrabajaAgenda(Integer trabajaAgenda) {
        this.trabajaAgenda = trabajaAgenda;
    }

    public LocalDateTime getFAgenda() {
        return fAgenda;
    }

    public void setFAgenda(LocalDateTime fAgenda) {
        this.fAgenda = fAgenda;
    }

    public LocalDateTime getFpagoAgenda() {
        return fpagoAgenda;
    }

    public void setFpagoAgenda(LocalDateTime fpagoAgenda) {
        this.fpagoAgenda = fpagoAgenda;
    }

    public String getResultadoAgenda() {
        return resultadoAgenda;
    }

    public void setResultadoAgenda(String resultadoAgenda) {
        this.resultadoAgenda = resultadoAgenda;
    }

    public String getEstadoAgenda() {
        return estadoAgenda;
    }

    public void setEstadoAgenda(String estadoAgenda) {
        this.estadoAgenda = estadoAgenda;
    }
}
