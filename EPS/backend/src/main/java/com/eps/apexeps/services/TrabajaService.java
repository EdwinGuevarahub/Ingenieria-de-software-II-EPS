/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.relations.EntradaHorario;
import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.repositories.MedicoRepository;
import com.eps.apexeps.repositories.TrabajaRepository;

import jakarta.transaction.Transactional;

/**
 *
 * @author Alexander
 */
@Service
public class TrabajaService {

    @Autowired
    private TrabajaRepository trabajaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    /**
     * Método para guardar una entrada de trabajo en la base de datos.
     * 
     * @param trabaja La entrada de trabajo a guardar.
     * @return La entrada de trabajo guardada.
     */
    public List<Trabaja> findAll() {
        return trabajaRepository.findAll();
    }

    /**
     * Método para encontrar todas las entradas de trabajo asociadas a un conjunto
     * de médicos.
     * 
     * @param medicos Una lista de médicos para los cuales se desean encontrar las
     *                entradas de trabajo.
     * @return Una lista de entradas de trabajo asociadas a los médicos
     *         proporcionados.
     */
    public List<Trabaja> findByMedico_Dni(long dniMedico) {
        return trabajaRepository.findByMedico_Dni(dniMedico);
    }

    /**
     * Método para encontrar una entrada de trabajo por su ID.
     * 
     * @param idTrabaja El ID del registro de trabajo.
     * @return Un objeto Trabaja si se encuentra, o null si no.
     */
    public Trabaja findByIdTrabaja(int idTrabaja) {
        return trabajaRepository.findById(idTrabaja).orElse(null);
    }

    /**
     * Método para encontrar una entrada de trabajo por su ID y el DNI del médico.
     * 
     * @param idTrabaja El ID del registro de trabajo.
     * @param dniMedico El DNI del médico.
     * @return Un objeto Optional que contiene la entrada de trabajo si se
     *         encuentra, o vacío si no.
     */
    public Optional<Trabaja> findTrabajaByIdAndMedicoDni(Integer idTrabaja, Long dniMedico) {
        Optional<Trabaja> trabajaOpt = trabajaRepository.findById(idTrabaja);
        if (trabajaOpt.isPresent()) {
            Trabaja trabaja = trabajaOpt.get();
            // Asumiendo que Trabaja tiene un getMedico() y Medico tiene getDniMedico()
            if (trabaja.getMedico() != null && trabaja.getMedico().getDni().equals(dniMedico)) {
                return Optional.of(trabaja);
            }
        }
        return Optional.empty();
    }

    /**
     * Método para obtener una entrada de horario por día específico.
     * 
     * @param dniMedico El DNI del médico.
     * @param idTrabaja El ID del registro de trabajo.
     * @param dia       El día de la semana para el cual se desea obtener la entrada
     *                  de horario.
     * @return La entrada de horario correspondiente al día especificado.
     */
    public EntradaHorario obtenerEntradaPorDia(Long dniMedico, Integer idTrabaja, DayOfWeek dia) {
        Trabaja trabaja = trabajaRepository.findById(idTrabaja)
                .orElseThrow(() -> new RuntimeException("No se encontró el registro de trabajo con id " + idTrabaja));

        if (!trabaja.getMedico().getDni().equals(dniMedico)) {
            throw new RuntimeException("El médico no coincide con el registro de trabajo");
        }

        return trabaja.getHorario().stream()
                .filter(entrada -> entrada.getDia() == dia)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No se encontró horario para el día: " + dia));
    }

    /**
     * Método para obtener un objeto Trabaja con solo la entrada de horario
     * correspondiente a un día específico.
     * 
     * @param dniMedico El DNI del médico.
     * @param idTrabaja El ID del registro de trabajo.
     * @param dia       El día de la semana para el cual se desea obtener el
     *                  horario.
     * @return Un objeto Trabaja con solo la entrada de horario correspondiente al
     *         día especificado.
     */
    public Trabaja obtenerTrabajaConDia(Long dniMedico, Integer idTrabaja, DayOfWeek dia) {
        Trabaja trabaja = trabajaRepository.findById(idTrabaja)
                .orElseThrow(() -> new RuntimeException("No se encontró el registro de trabajo con id " + idTrabaja));

        if (!trabaja.getMedico().getDni().equals(dniMedico)) {
            throw new RuntimeException("El médico no coincide con el registro de trabajo");
        }

        EntradaHorario entradaDelDia = trabaja.getHorario().stream()
                .filter(e -> e.getDia() == dia)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No hay horario para el día " + dia));

        // Crear un nuevo objeto trabaja con solo esa entrada
        Trabaja resultado = Trabaja.builder()
                .id(trabaja.getId())
                .medico(trabaja.getMedico())
                .consultorio(trabaja.getConsultorio())
                .build();
        resultado.setHorario(List.of(entradaDelDia));

        return resultado;
    }

    // ---------------------------------------------------------------------------------------------------------------------

    public Trabaja crearTrabaja(Trabaja nuevoTrabaja) {
        // Puedes filtrar por médico, consultorio, o por todos según tu necesidad
        List<Trabaja> existentes = trabajaRepository
                .findByConsultorio(nuevoTrabaja.getConsultorio());

        return trabajaRepository.save(nuevoTrabaja);
    }

    public void crearTrabaja(long dniMedico, Trabaja trabaja) {
        try {
            Medico medico = medicoRepository.findById(dniMedico)
                    .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

            // Obtener todos los trabaja del mismo consultorio
            List<Trabaja> existentes = trabajaRepository.findByConsultorio(trabaja.getConsultorio());

            // Validar solapamiento
            if (haySolapamientoHorario(existentes, trabaja)) {
                throw new IllegalArgumentException("El nuevo horario se solapa con otro en el mismo consultorio.");
            }

            trabaja.setMedico(medico);
            trabajaRepository.save(trabaja);

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error al crear horario: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Ocurrió un error inesperado: " + e.getMessage());
        }
    }

    public boolean haySolapamientoHorario(List<Trabaja> existentes, Trabaja nuevo) {
        for (Trabaja existente : existentes) {
            for (EntradaHorario hExistente : existente.getHorario()) {
                for (EntradaHorario hNuevo : nuevo.getHorario()) {

                    // Verifica que sea el mismo día
                    if (hExistente.getDia().equals(hNuevo.getDia())) {
                        LocalTime iniExist = hExistente.getInicio();
                        LocalTime finExist = hExistente.getFin();
                        LocalTime iniNuevo = hNuevo.getInicio();
                        LocalTime finNuevo = hNuevo.getFin();

                        // Condición de solapamiento
                        if (iniNuevo.isBefore(finExist) && finNuevo.isAfter(iniExist)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // ---------------------------------------------------------------------------------------------------------------------
    public void probarTrabaja() {
        List<Trabaja> trabajaList = trabajaRepository.findAll();

        for (Trabaja t : trabajaList) {
            System.out.println("Médico: " + t.getMedico().getNombre());
        }
    }

    public List<Medico> filtrarMedicosPorDisponibilidad(String entradaHorarioStr) {
        EntradaHorario filtro = EntradaHorario.valueOf(entradaHorarioStr);

        List<Trabaja> trabajaList = trabajaRepository.findAll();

        return trabajaList.stream()
                .filter(t -> tieneDisponibilidad(t, filtro))
                .map(Trabaja::getMedico) // <- Aquí es donde estaba el error
                .distinct()
                .collect(Collectors.toList());
    }

    private boolean tieneDisponibilidad(Trabaja trabaja, EntradaHorario filtro) {
        return trabaja.getHorario().stream().anyMatch(entrada -> entrada.getDia().equals(filtro.getDia()) &&
                !entrada.getInicio().isAfter(filtro.getInicio()) &&
                !entrada.getFin().isBefore(filtro.getFin()));
    }

    @Transactional
    public Trabaja actualizarTrabaja(long dniMedico, int idTrabaja, Trabaja trabajaActualizado) {
        Trabaja existente = trabajaRepository.findById(idTrabaja)
                .orElseThrow(() -> new RuntimeException("No se encontró el registro de trabajo con id " + idTrabaja));

        if (!existente.getMedico().getDni().equals(dniMedico)) {
            throw new RuntimeException("El médico no coincide con el registro de trabajo");
        }

        // Buscar otros trabaja en el mismo consultorio, excepto este mismo
        List<Trabaja> enMismoConsultorio = trabajaRepository.findByConsultorio(trabajaActualizado.getConsultorio())
                .stream()
                .filter(t -> t.getId() != idTrabaja)
                .toList();

        // Validar que no haya solapamiento con otros trabaja en el mismo consultorio
        if (haySolapamientoHorario(enMismoConsultorio, trabajaActualizado)) {
            throw new IllegalArgumentException("El nuevo horario se solapa con otro en el mismo consultorio.");
        }

        // Actualizar campos (si es que deseas permitir cambiar consultorio y horario)
        existente.setConsultorio(trabajaActualizado.getConsultorio());
        existente.setHorario(trabajaActualizado.getHorario());

        return trabajaRepository.save(existente);
    }

}
