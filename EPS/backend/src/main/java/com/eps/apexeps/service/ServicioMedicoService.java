package com.eps.apexeps.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.ServicioMedico;
import com.eps.apexeps.repositories.ServicioMedicoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar la lógica de negocio relacionada con los servicios médicos.
 * Proporciona métodos para obtener, crear y actualizar servicios médicos.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class ServicioMedicoService {

    /** Repositorio de servicios médicos para acceder a la base de datos. */
    private final ServicioMedicoRepository servicioMedicoRepository;

    /**
     * Método para obtener todos los servicios médicos de la base de datos.
     * @param cupsNombreLike Parte del nombre o código CUPS del servicio médico a buscar (opcional).
     * @param qSize Tamaño de la página (por defecto, 10).
     * @param qPage Número de la página (por defecto, 0).
     * @return Una lista de servicios médicos.
     */
    public List<ServicioMedico> getServiciosMedicos(String cupsNombreLike, Integer qSize, Integer qPage) {
        Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
        return servicioMedicoRepository.findAllFiltered(cupsNombreLike, pageable);
    }
    
    /**
     * Método para obtener un servicio médico por su código CUPS.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @return El servicio médico correspondiente al código CUPS o null si no existe.
     */
    public ServicioMedico getServicioMedicoByCups(String cupsServicioMedico) {
        return servicioMedicoRepository
                .findById(cupsServicioMedico)
                .orElse(null);
    }

    /**
     * Método para crear un nuevo servicio médico.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @param nombreServicioMedico El nombre del servicio médico.
     * @param descripcionServicioMedico La descripción del servicio médico.
     * @param tarifaServicioMedico La tarifa del servicio médico.
     * @return El servicio médico creado.
     * @throws IllegalArgumentException Si el servicio médico ya existe.
     */
    public ServicioMedico createServicioMedico(
        String cupsServicioMedico,
        String nombreServicioMedico,
        String descripcionServicioMedico,
        Double tarifaServicioMedico
    ) {
        if (servicioMedicoRepository.existsById(cupsServicioMedico))
            throw new IllegalArgumentException("El servicio médico ya existe.");

        return saveServicioMedico(
                    cupsServicioMedico,
                    nombreServicioMedico,
                    descripcionServicioMedico,
                    tarifaServicioMedico
                );
    }

    /**
     * Método para actualizar un servicio médico existente.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @param nombreServicioMedico El nuevo nombre del servicio médico.
     * @param descripcionServicioMedico La nueva descripción del servicio médico.
     * @param tarifaServicioMedico La nueva tarifa del servicio médico.
     * @return El servicio médico actualizado.
     * @throws IllegalArgumentException Si el servicio médico no existe.
     */
    public ServicioMedico updateServicioMedico(
        String cupsServicioMedico,
        String nombreServicioMedico,
        String descripcionServicioMedico,
        Double tarifaServicioMedico
    ) {
        if (!servicioMedicoRepository.existsById(cupsServicioMedico))
            throw new IllegalArgumentException("El servicio médico no existe.");

        return saveServicioMedico(
                    cupsServicioMedico,
                    nombreServicioMedico,
                    descripcionServicioMedico,
                    tarifaServicioMedico
                );
    }

    /**
     * Método privado para guardar un servicio médico en la base de datos.
     * @param cupsServicioMedico El código CUPS del servicio médico.
     * @param nombreServicioMedico El nombre del servicio médico.
     * @param descripcionServicioMedico La descripción del servicio médico.
     * @param tarifaServicioMedico La tarifa del servicio médico.
     * @return El servicio médico guardado.
     */
    private ServicioMedico saveServicioMedico(
        String cupsServicioMedico,
        String nombreServicioMedico,
        String descripcionServicioMedico,
        Double tarifaServicioMedico
    ) {
        ServicioMedico servicioMedico =
            ServicioMedico.builder()
                .cups(cupsServicioMedico)
                .nombre(nombreServicioMedico)
                .descripcion(descripcionServicioMedico)
                .tarifa(tarifaServicioMedico)
                .build();

        return servicioMedicoRepository.save(servicioMedico);
    }

}
