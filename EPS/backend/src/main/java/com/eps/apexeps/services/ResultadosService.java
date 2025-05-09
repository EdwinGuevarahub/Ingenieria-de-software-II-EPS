package com.eps.apexeps.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

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
import com.eps.apexeps.models.DTOs.ResultadoDiagnostico;
import com.eps.apexeps.models.DTOs.FormulaMedica;
import com.eps.apexeps.models.DTOs.Orden;
import com.eps.apexeps.repositories.AgendaRepository;
import com.eps.apexeps.repositories.GeneraRepository;
import com.eps.apexeps.repositories.FormulaRepository;
import com.eps.apexeps.repositories.MedicamentoRepository;
import com.eps.apexeps.repositories.DiagnosticoRepository;
import com.eps.apexeps.repositories.DetalleFormulaRepository;
import com.eps.apexeps.repositories.OrdenaRepository;
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
        private DetalleFormulaRepository detalleFormulaRepository;

        @Autowired
        private ServicioMedicoRepository servicioMedicoRepository;

        // Obtener las citas (agenda) en estado PENDIENTE de un paciente
        @GetMapping("/citas")
        public List<Agenda> getCitasPaciente(@RequestParam Long dniPaciente) {
                return agendaRepository.findByPacienteDniAndEstado(dniPaciente, "PENDIENTE");
        }

        // Obtener lista de diagnosticos
        @GetMapping("/lista-diagnosticos")
        public List<Diagnostico> getListaDiagnosticos() {
                return diagnosticoRepository.findAll();
        }

        // Obtener lista de medicamentos
        @GetMapping("/lista-medicamentos")
        public List<Medicamento> getListaMedicamentos() {
                return medicamentoRepository.findAll();
        }

        // Registrar resultados de una cita (agenda)
        // Actualizando el resultado general de una cita y
        // Registrando diagnosticos con sus respectivos medicamentos
        @PostMapping("/actualizar-resultados")
        public void actualizarResultados(@RequestBody ResultadoDiagnostico resultados) {

                // Actualizacion del resultado de la agenda
                Agenda agenda = agendaRepository.findById(resultados.getAgendaId())
                                .orElseThrow(() -> new RuntimeException("Agenda no encontrada"));
                agenda.setResultado(resultados.getResultadoAgenda());
                agenda.setEstado("COMPLETADA");
                agendaRepository.save(agenda);

                // Recorrer los diagnosticos
                for (FormulaMedica fMedica : resultados.getDiagnosticos()) {
                        Diagnostico diagnostico = diagnosticoRepository.findById(fMedica.getDiagnostico())
                                        .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado"));

                        GeneraId generaId = GeneraId.builder()
                                        .agenda(agenda)
                                        .diagnostico(diagnostico)
                                        .build();

                        Genera genera = Genera.builder()
                                        .id(generaId)
                                        .observaciones(fMedica.getObservacion())
                                        .build();
                        generaRepository.save(genera);

                        FormulaId formulaId = FormulaId.builder()
                                        .agenda(agenda)
                                        .diagnostico(diagnostico)
                                        .build();

                        Formula formula = Formula.builder()
                                        .id(formulaId)
                                        .observaciones(fMedica.getObservacion())
                                        .build();
                        formulaRepository.save(formula);

                        for (DetalleFormula df : fMedica.getMedicamentos()) {
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
                                                .duracion(df.getDuracion())
                                                .build();
                                detalleFormulaRepository.save(detalleFormula);
                        }
                }
        }

        // Crear las ordenes (Resmisión o Examen) asociadas a una cita (agenda)
        @PostMapping("/ordenes")
        public void crearOrdenes(@RequestBody List<Orden> ordenes) {
                List<Ordena> ordenesCreacion = new ArrayList<>();

                for (Orden orden : ordenes) {
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
