package com.eps.apexeps.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.entity.relations.Agenda;
import com.eps.apexeps.models.entity.relations.DetalleFormula;
import com.eps.apexeps.models.entity.relations.DetalleFormulaId;
import com.eps.apexeps.models.entity.relations.Formula;
import com.eps.apexeps.models.entity.relations.FormulaId;
import com.eps.apexeps.models.entity.relations.Genera;
import com.eps.apexeps.models.entity.relations.GeneraId;
import com.eps.apexeps.models.entity.relations.Ordena;
import com.eps.apexeps.models.entity.relations.OrdenaId;
import com.eps.apexeps.models.entity.users.Paciente;
import com.eps.apexeps.models.DTOs.ResultadoDiagnosticoDTO;
import com.eps.apexeps.models.entity.Diagnostico;
import com.eps.apexeps.models.entity.Medicamento;
import com.eps.apexeps.models.entity.ServicioMedico;
import com.eps.apexeps.models.DTOs.PacienteCitasDTO;

import com.eps.apexeps.repositories.AgendaRepository;
import com.eps.apexeps.repositories.GeneraRepository;
import com.eps.apexeps.repositories.FormulaRepository;
import com.eps.apexeps.repositories.MedicamentoRepository;
import com.eps.apexeps.repositories.DiagnosticoRepository;
import com.eps.apexeps.repositories.DetalleFormulaRepository;
import com.eps.apexeps.repositories.OrdenaRepository;
import com.eps.apexeps.repositories.PacienteRepository;
import com.eps.apexeps.repositories.ServicioMedicoRepository;

import java.util.List;

@Service
public class ResultadosService {

        @Autowired
        private AgendaRepository agendaRepository;

        @Autowired
        private GeneraRepository generaRepository;

        @Autowired
        private FormulaRepository formulaRepository;

        @Autowired
        private DiagnosticoRepository diagnosticoRepository;

        @Autowired
        private MedicamentoRepository medicamentoRepository;

        @Autowired
        private OrdenaRepository ordenaRepository;

        @Autowired
        private PacienteRepository pacienteRepository;

        @Autowired
        private DetalleFormulaRepository detalleFormulaRepository;

        @Autowired
        private ServicioMedicoRepository servicioMedicoRepository;

        // Obtener lista de diagnosticos
        public List<Diagnostico> getListaDiagnosticos() {
                return diagnosticoRepository.findAll();
        }

        // Obtener lista de medicamentos
        public List<Medicamento> getListaMedicamentos() {
                return medicamentoRepository.findAll();
        }

        // Obtener lista de servicios medicos
        public List<ServicioMedico> getListaServiciosMedicos() {
                return servicioMedicoRepository.findAll();
        }

        // Obtener las citas (agenda) en estado PENDIENTE de un paciente
        public PacienteCitasDTO getCitasPaciente(Long dniPaciente) {
                Paciente paciente = pacienteRepository.findById(dniPaciente)
                                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

                List<Agenda> agendas = agendaRepository.findByPacienteDniAndEstado(dniPaciente, "PENDIENTE");
                return new PacienteCitasDTO(paciente, agendas);
        }

        // Registrar resultados de una cita (agenda)
        // Actualizando el resultado general de una cita y
        // Registrando el diagnostico con sus respectivos medicamentos
        // O Registrando una orden (Resmisión) asociada a una cita (agenda)
        public void registrarResultado(ResultadoDiagnosticoDTO resultado) {

                // Actualizacion del resultado de la agenda
                Agenda agenda = agendaRepository.findById(resultado.getAgendaId())
                                .orElseThrow(() -> new RuntimeException("Agenda no encontrada"));
                agenda.setResultado(resultado.getResultadoAgenda());
                agenda.setEstado("COMPLETADA");
                agendaRepository.save(agenda);

                Diagnostico diagnostico = diagnosticoRepository.findById(resultado.getDiagnostico())
                                .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado"));

                GeneraId generaId = GeneraId.builder()
                                .agenda(agenda)
                                .diagnostico(diagnostico)
                                .build();

                Genera genera = Genera.builder()
                                .id(generaId)
                                .observaciones(resultado.getObservacion())
                                .build();
                generaRepository.save(genera);

                if (resultado.getMedicamentos() != null && !resultado.getMedicamentos().isEmpty()) {
                        FormulaId formulaId = FormulaId.builder()
                                        .agenda(agenda)
                                        .diagnostico(diagnostico)
                                        .build();

                        Formula formula = Formula.builder()
                                        .id(formulaId)
                                        .observaciones(resultado.getObservacion())
                                        .build();
                        formulaRepository.save(formula);

                        List<DetalleFormula> medicamentos = resultado.getMedicamentos();
                        for (int i = 0; i < medicamentos.size(); i++) {
                                DetalleFormula df = medicamentos.get(i);

                                Medicamento medicamento = medicamentoRepository
                                                .findById(df.getMedicamento().getId())
                                                .orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

                                DetalleFormulaId detalleId = DetalleFormulaId.builder()
                                                .formula(formula)
                                                .id(i+1)
                                                .build();

                                DetalleFormula detalleFormula = DetalleFormula.builder()
                                                .id(detalleId)
                                                .medicamento(medicamento)
                                                .cantidad(df.getCantidad())
                                                .dosis(df.getDosis())
                                                .build();
                                detalleFormulaRepository.save(detalleFormula);
                        }
                } else if (resultado.getServicioMedico() != null && !resultado.getServicioMedico().isEmpty()) {
                        ServicioMedico servicio = servicioMedicoRepository
                                        .findByCups(resultado.getServicioMedico())
                                        .orElseThrow(() -> new RuntimeException("Servicio Medico no encontrado"));

                        OrdenaId ordenaId = new OrdenaId(agenda, servicio);
                        Ordena ordena = Ordena.builder().id(ordenaId).build();
                        ordenaRepository.save(ordena);

                } else {
                        throw new RuntimeException("Debe especificarse al menos un medicamento o un servicio.");
                }

        }

        // Actualizar unicamente el resultado de una agenda
        public void actualizarResultadoAgenda(Integer id, Agenda agenda) {
                Agenda agendaEncontrada = agendaRepository
                                .findById(id)
                                .orElseThrow(() -> new RuntimeException("Agenda no encontrada"));

                agendaEncontrada.setResultado(agenda.getResultado());
                agendaEncontrada.setEstado("COMPLETADA");
                agendaRepository.save(agendaEncontrada);
        }
}
