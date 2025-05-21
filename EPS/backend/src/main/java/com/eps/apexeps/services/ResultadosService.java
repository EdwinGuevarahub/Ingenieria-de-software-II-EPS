package com.eps.apexeps.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.Diagnostico;
import com.eps.apexeps.models.Medicamento;
import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.models.relations.DetalleFormula;
import com.eps.apexeps.models.relations.DetalleFormulaId;
import com.eps.apexeps.models.relations.Formula;
import com.eps.apexeps.models.relations.FormulaId;
import com.eps.apexeps.models.relations.Genera;
import com.eps.apexeps.models.relations.GeneraId;
import com.eps.apexeps.models.relations.Ordena;
import com.eps.apexeps.models.relations.OrdenaId;
import com.eps.apexeps.models.users.Paciente;
import com.eps.apexeps.models.DTOs.ResultadoDiagnostico;

import com.eps.apexeps.models.DTOs.OrdenaDTO;
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

import java.util.ArrayList;
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
        public void actualizarResultados(ResultadoDiagnostico resultado) {

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

                FormulaId formulaId = FormulaId.builder()
                                .agenda(agenda)
                                .diagnostico(diagnostico)
                                .build();

                Formula formula = Formula.builder()
                                .id(formulaId)
                                .observaciones(resultado.getObservacion())
                                .build();
                formulaRepository.save(formula);

                for (DetalleFormula df : resultado.getMedicamentos()) {
                        Medicamento medicamento = medicamentoRepository
                                        .findById(df.getMedicamento().getId())
                                        .orElseThrow(() -> new RuntimeException("Medicamento no encontrado"));

                        DetalleFormulaId detalleId = DetalleFormulaId.builder()
                                        .formula(formula)
                                        .id(10) // PREGUNTAAA
                                        .build();

                        DetalleFormula detalleFormula = DetalleFormula.builder()
                                        .id(detalleId)
                                        .medicamento(medicamento)
                                        .cantidad(df.getCantidad())
                                        .dosis(df.getDosis())
                                        .build();
                        detalleFormulaRepository.save(detalleFormula);
                }

        }

        // Crear las ordenes (Resmisión o Examen) asociadas a una cita (agenda)
        public void crearOrdenes(List<OrdenaDTO> ordenes) {
                List<Ordena> ordenesCreacion = new ArrayList<>();

                for (OrdenaDTO orden : ordenes) {
                        Agenda agenda = agendaRepository
                                        .findById(orden.getAgendaId())
                                        .orElseThrow(() -> new RuntimeException("Agenda no encontrada"));

                        ServicioMedico servicio = servicioMedicoRepository
                                        .findByCups(orden.getCodigoServicio())
                                        .orElseThrow(() -> new RuntimeException("Servicio Medico no encontrado"));

                        OrdenaId ordenaId = new OrdenaId(agenda, servicio);
                        Ordena ordena = Ordena.builder().id(ordenaId).build();
                        ordenesCreacion.add(ordena);
                }
                ordenaRepository.saveAll(ordenesCreacion);
        }
}
