package com.eps.apexeps.services;

import org.springframework.transaction.annotation.Transactional;
import com.eps.apexeps.dto.HistoriaClinicaDto;
import com.eps.apexeps.dto.HistoriaClinicaDto.DiagnosticoDto;
import com.eps.apexeps.dto.HistoriaClinicaDto.MedicamentoDto;
import com.eps.apexeps.dto.HistoriaClinicaDto.ExamenDto;
import com.eps.apexeps.models.entity.relations.Agenda;
import com.eps.apexeps.models.entity.relations.Formula;
import com.eps.apexeps.models.entity.relations.FormulaId;
import com.eps.apexeps.models.entity.relations.DetalleFormula;
import com.eps.apexeps.models.entity.Diagnostico;
import com.eps.apexeps.models.entity.Medicamento;
import com.eps.apexeps.repositories.AgendaRepository;
import com.eps.apexeps.repositories.FormulaRepository;
import com.eps.apexeps.repositories.DetalleFormulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class HistoriaClinicaService {

    private final AgendaRepository agendaRepository;
    private final FormulaRepository formulaRepository;
    private final DetalleFormulaRepository detalleFormulaRepository;

    @Transactional(readOnly = true)
    public List<HistoriaClinicaDto> obtenerHistorialCompleto(Long pacienteId, Instant desde, Instant hasta) {
        List<Agenda> agendas;

        if (desde != null && hasta != null) {
            agendas = agendaRepository.findByPaciente_DniAndFechaBetween(
                pacienteId,
                desde,
                hasta
            );
        } else {
            agendas = agendaRepository.findByPaciente_Dni(pacienteId);
        }

        return agendas.stream().map(agenda -> {
            HistoriaClinicaDto dto = new HistoriaClinicaDto();
            dto.setAgendaId(agenda.getId());
            dto.setFecha(agenda.getFecha().atZone(ZoneId.systemDefault()).toLocalDateTime());
            dto.setEstado(agenda.getEstado());
            dto.setResultado(agenda.getResultado());

            // Diagnósticos
            List<DiagnosticoDto> diagnosticos = agenda.getGeneraciones().stream().map(genera -> {
                DiagnosticoDto diagDto = new DiagnosticoDto();
                Diagnostico diag = genera.getId().getDiagnostico();
                diagDto.setCodigo(diag != null ? diag.getCie() : "");
                diagDto.setNombre(diag != null ? diag.getNombre() : "");
                diagDto.setObservacion(genera.getObservaciones());
                return diagDto;
            }).collect(Collectors.toList());
            dto.setDiagnosticos(diagnosticos);

            // Medicamentos (via Formula -> DetalleFormula)
            List<MedicamentoDto> medicamentos = agenda.getGeneraciones().stream()
                .flatMap(genera -> {
                    Diagnostico diag = genera.getId().getDiagnostico();
                    Formula formula = formulaRepository.findById(
                        new FormulaId(agenda, diag)
                    ).orElse(null);
                    if (formula == null) return Stream.empty();
                    List<DetalleFormula> detalles = detalleFormulaRepository.findById_Formula_Id_Agenda_IdAndId_Formula_Id_Diagnostico_Cie(
                        agenda.getId(), diag != null ? diag.getCie() : null
                    );
                    return detalles.stream().map(detalle -> {
                        MedicamentoDto medDto = new MedicamentoDto();
                        Medicamento med = detalle.getMedicamento();
                        medDto.setNombre(med != null ? med.getNombre() : "");
                        medDto.setDosis(detalle.getDosis());
                        medDto.setCantidad(detalle.getCantidad());
                        // Set duration if available
                        return medDto;
                    });
                }).collect(Collectors.toList());
            dto.setMedicamentos(medicamentos);

            // Exámenes (Servicios ordenados)
            List<ExamenDto> examenes = agenda.getOrdenes().stream().map(servicio -> {
                ExamenDto exDto = new ExamenDto();
                exDto.setServicio(servicio.getCups());
                exDto.setNombre(servicio.getNombre());
                exDto.setOrdenado(true);
                return exDto;
            }).collect(Collectors.toList());
            dto.setExamenes(examenes);

            return dto;
        }).collect(Collectors.toList());
    }
}