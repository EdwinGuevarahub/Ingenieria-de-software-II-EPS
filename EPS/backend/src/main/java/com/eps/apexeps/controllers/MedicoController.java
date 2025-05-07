package com.eps.apexeps.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eps.apexeps.models.users.Medico;
import com.eps.apexeps.response.MedicoEntradaLista;
import com.eps.apexeps.services.MedicoService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para manejar las operaciones relacionadas con los médicos de una IPS.
 * Proporciona endpoints para obtener, crear y actualizar médicos.
 * @author Nicolás Sabogal
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/medico")
public class MedicoController {

    /** Servicio de médicos para manejar la lógica de negocio. */
    private final MedicoService medicoService;

    /**
     * Endpoint para obtener todos los médicos de la base de datos.
     * @param idIps El id de la IPS (opcional).
     * @param dniNombreLike Cadena que se usará para filtrar los médicos por su DNI o nombre (opcional).
     * @param cupsServicioMedico El CUPS de un servicio médico asociado al médico (opcional).
     * @param codDiaSemana Código del día de la semana en el que el médico está disponible (opcional, 1 = Lunes -> 7 = Domingo).
     * @param horaDeInicio La hora de inicio de la jornada laboral del médico (opcional, 0 a 23).
     * @param horaDeFin La hora de fin de la jornada laboral del médico (opcional, 0 a 23).
     * @param estaActivo Indica si el médico está activo o no (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de médicos.
     * @throws RuntimeException Si ocurre un error al obtener los médicos.
     */
    @GetMapping
    public List<MedicoEntradaLista> getAllMedicos(
        @RequestParam(required = false) Integer idIps,
        @RequestParam(required = false) String dniNombreLike,
        @RequestParam(required = false) String cupsServicioMedico,
        @RequestParam(required = false) Integer codDiaSemana,
        @RequestParam(required = false) Integer horaDeInicio,
        @RequestParam(required = false) Integer horaDeFin,
        @RequestParam(required = false) Boolean estaActivo,
        @RequestParam(defaultValue = "10") Integer qSize,
        @RequestParam(defaultValue = "0") Integer qPage
    ) {
        try{
            return medicoService
                    .getMedicos(
                        idIps,
                        dniNombreLike,
                        cupsServicioMedico,
                        codDiaSemana,
                        horaDeInicio,
                        horaDeFin,
                        estaActivo,
                        qSize,
                        qPage
                    )
                    .stream()
                    .map(MedicoEntradaLista::of)
                    .toList();
        }
        catch (Throwable t) {
            throw new RuntimeException("Error al obtener los médicos: " + t.getMessage(), t);
        }
    }

    /**
     * Endpoint para obtener un médico por su DNI.
     * @param dniMedico El DNI del médico.
     * @return El médico correspondiente al DNI o null si no existe.
     */
    @GetMapping("/{dniMedico}")
    public Medico getMedico(@RequestParam Long dniMedico) {
        return medicoService.getMedico(dniMedico);
    }

    /**
     * Endpoint para crear un nuevo médico.
     * @param dniMedico El DNI del médico.
     * @param nombreMedico El nombre del médico.
     * @param emailMedico El correo electrónico del médico.
     * @param telefonoMedico El número de teléfono del médico.
     * @return El médico creado.
     * @throws RuntimeException Si ocurre un error al crear el médico.
     */
    @PostMapping
    public Medico createMedico(
        Long dniMedico,
        String nombreMedico,
        String emailMedico,
        String telefonoMedico
    ) {
        try {
            return medicoService.createMedico(
                        dniMedico,
                        nombreMedico,
                        emailMedico,
                        telefonoMedico
                    );
        }
        catch (Throwable t) {
            throw new RuntimeException("Error al crear el médico: " + t.getMessage(), t);
        }
    }

    /**
     * Endpoint para actualizar un médico existente.
     * @param dniMedico El DNI del médico.
     * @param nombreMedico El nuevo nombre del médico.
     * @param emailMedico El nuevo correo electrónico del médico.
     * @param telefonoMedico El nuevo número de teléfono del médico.
     * @return El médico actualizado.
     * @throws RuntimeException Si ocurre un error al actualizar el médico.
     */
    @PutMapping
    public Medico updateMedico(
        Long dniMedico,
        String nombreMedico,
        String emailMedico,
        String telefonoMedico
    ) {
        try {
            return medicoService.updateMedico(
                        dniMedico,
                        nombreMedico,
                        emailMedico,
                        telefonoMedico
                    );
        }
        catch (Throwable t) {
            throw new RuntimeException("Error al actualizar el médico: " + t.getMessage(), t);
        }
    }

}
