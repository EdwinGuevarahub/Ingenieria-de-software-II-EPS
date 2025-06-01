package com.eps.apexeps.models.DTOs;

import java.util.List;
import java.util.stream.Collectors;

import com.eps.apexeps.models.entity.relations.Agenda;
import com.eps.apexeps.models.entity.users.Paciente;

// Modelo para la informacion del paciente y las citas pendientes que le corresponden
public class PacienteCitasDTO {

    private Paciente paciente;
    private List<AgendaDTO> citasPendientes;

    // Constructor que mapea la información de paciente y citas
    public PacienteCitasDTO(Paciente paciente, List<Agenda> agendas) {
        this.paciente = paciente;
        this.citasPendientes = agendas.stream().map(agenda -> new AgendaDTO(agenda)).collect(Collectors.toList());
    }

    // Getters y setters
    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public List<AgendaDTO> getCitasPendientes() {
        return citasPendientes;
    }

    public void setCitasPendietes(List<AgendaDTO> citas) {
        this.citasPendientes = citas;
    }
}
