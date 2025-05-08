package com.eps.apexeps.services;

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
     * @param servicioMedico El servicio médico a crear.
     * @return El servicio médico creado.
     * @throws IllegalArgumentException Si el servicio médico ya existe.
     */
    public ServicioMedico createServicioMedico(ServicioMedico servicioMedico) {
        if (servicioMedicoRepository.existsById(servicioMedico.getCups()))
            throw new IllegalArgumentException("El servicio médico ya existe.");

        return servicioMedicoRepository.save(servicioMedico);
    }

    /**
     * Método para actualizar un servicio médico existente.
     * @param servicioMedico El servicio médico a actualizar.
     * @return El servicio médico actualizado.
     * @throws IllegalArgumentException Si el servicio médico no existe.
     */
    public ServicioMedico updateServicioMedico(ServicioMedico servicioMedico) {
        if (!servicioMedicoRepository.existsById(servicioMedico.getCups()))
            throw new IllegalArgumentException("El servicio médico no existe.");

        return servicioMedicoRepository.save(servicioMedico);
    }

}
