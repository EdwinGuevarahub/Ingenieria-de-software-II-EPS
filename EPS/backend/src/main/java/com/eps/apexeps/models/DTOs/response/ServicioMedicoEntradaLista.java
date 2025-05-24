package com.eps.apexeps.models.DTOs.response;

import com.eps.apexeps.models.entity.ServicioMedico;

import lombok.Builder;
import lombok.Data;

/**
 * Clase que representa una entrada en una lista de servicios médicos para mostrar en la interfaz de usuario.
 * Contiene información básica del servicio médico, como su CUPS y nombre.
 * @author Nicolás Sabogal
 */
@Data
@Builder
public class ServicioMedicoEntradaLista {

    /** CUPS del servicio médico. Clave primaria. */
    private String cupsServicioMedico;

    /** Nombre del servicio médico. */
    private String nombreServicioMedico;

    /**
     * Método estático para crear un objeto ServicioMedicoEntradaLista a partir de un objeto ServicioMedico.
     * @param servicioMedico El objeto ServicioMedico del cual se extraerán los datos.
     * @return Un objeto ServicioMedicoEntradaLista con los datos del servicio médico.
     */
    public static ServicioMedicoEntradaLista of(ServicioMedico servicioMedico) {
        return ServicioMedicoEntradaLista
            .builder()
            .cupsServicioMedico(servicioMedico.getCups())
            .nombreServicioMedico(servicioMedico.getNombre())
            .build();
    }

}
