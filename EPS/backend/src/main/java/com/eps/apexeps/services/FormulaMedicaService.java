package com.eps.apexeps.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eps.apexeps.models.DiagnosticoDTO;
import com.eps.apexeps.models.FormulaMedicaRequest;
import com.eps.apexeps.models.MedicamentoDTO;
import com.eps.apexeps.models.relations.Agenda;
import com.eps.apexeps.models.relations.DetalleFormula;
import com.eps.apexeps.models.relations.DetalleFormulaId;
import com.eps.apexeps.models.relations.Formula;
import com.eps.apexeps.models.relations.FormulaId;
import com.eps.apexeps.models.relations.Genera;
import com.eps.apexeps.models.relations.GeneraId;
import com.eps.apexeps.repositories.AgendaRepository;
import com.eps.apexeps.repositories.DetalleFormulaRepository;
import com.eps.apexeps.repositories.FormulaRepository;
import com.eps.apexeps.repositories.GeneraRepository;

import java.util.Optional;

@Service
public class FormulaMedicaService {

    @Autowired
    private AgendaRepository agendaRepository;
    
    @Autowired
    private GeneraRepository generaRepository;
    
    @Autowired
    private FormulaRepository formulaRepository;
    
    @Autowired
    private DetalleFormulaRepository detalleFormulaRepository;
    
    @Transactional
    public void procesarFormulaMedica(FormulaMedicaRequest request) {
        // 1. Actualizar la agenda con el resultado
        Optional<Agenda> agendaOpt = agendaRepository.findById(request.getAgendaId());
        if (!agendaOpt.isPresent()) {
            throw new RuntimeException("No se encontró la agenda con ID: " + request.getAgendaId());
        }
        
        Agenda agenda = agendaOpt.get();
        agenda.setResultadoAgenda(request.getResultadoAgenda());
        agenda.setEstadoAgenda("COMPLETADA");
        agendaRepository.save(agenda);
        
        // 2. Procesar cada diagnóstico
        for (DiagnosticoDTO diagDTO : request.getDiagnosticos()) {
            String codigoDiagnostico = diagDTO.getDiagnostico();
            
            // 2.1 Crear registro en la tabla 'genera'
            GeneraId generaId = new GeneraId(request.getAgendaId(), codigoDiagnostico);
            Genera genera = new Genera();
            genera.setId(generaId);
            genera.setObsGenera(diagDTO.getObservacion());
            generaRepository.save(genera);
            
            // 2.2 Crear registro en la tabla 'formula' (que es igual a 'genera')
            FormulaId formulaId = new FormulaId(request.getAgendaId(), codigoDiagnostico);
            Formula formula = new Formula();
            formula.setId(formulaId);
            formula.setObsFormula(diagDTO.getObservacion());
            formulaRepository.save(formula);
            
            // 2.3 Crear registros en la tabla 'detalle_formula'
            if (diagDTO.getMedicamentos() != null && !diagDTO.getMedicamentos().isEmpty()) {
                int idDetalle = 1;
                for (MedicamentoDTO medDTO : diagDTO.getMedicamentos()) {
                    DetalleFormulaId detalleId = new DetalleFormulaId(
                        request.getAgendaId(), 
                        codigoDiagnostico, 
                        idDetalle++
                    );
                    
                    DetalleFormula detalle = new DetalleFormula();
                    detalle.setId(detalleId);
                    detalle.setMedicamentoDetallef(medDTO.getMedicamentoId());
                    detalle.setCantidadDetallef(medDTO.getCantidad());
                    detalle.setDosisDetallef(medDTO.getDosis());
                    detalle.setDuracionDetallef(medDTO.getDuracion());
                    
                    detalleFormulaRepository.save(detalle);
                }
            }
        }
    }
}
