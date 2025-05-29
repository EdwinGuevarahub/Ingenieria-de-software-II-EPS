package com.eps.apexeps.models.DTOs.response;

import com.eps.apexeps.models.entity.Consultorio;
import com.eps.apexeps.models.entity.Ips;
import com.eps.apexeps.models.entity.ServicioMedico;

import lombok.Builder;
import lombok.Data;

/**
 * Clase que representa una entrada en una lista de consultorios para mostrar en la interfaz de usuario.
 * Contiene información básica del consultorio, como su id, el id de la IPS y el nombre del servicio médico.
 * @author Nicolás Sabogal
 */
@Data
@Builder
public class ConsultorioEntradaLista {

    /** Id de la IPS. Parte de la clave primaria compuesta. */
    private Integer idIps;
    /** Id del consultorio. Parte de la clave primaria compuesta. */
    private Integer idConsultorio;
    /** CUPS del servicio médico que presta el consultorio. */
    private String cupsServicioMedico;

    /** Nombre del servicio médico que presta el consultorio. */
    private String nombreServicioMedico;

    /**
     * Método estático para crear un objeto ConsultorioEntradaLista a partir de un objeto Consultorio.
     * @param consultorio El objeto Consultorio del cual se extraerán los datos.
     * @return Un objeto ConsultorioEntradaLista con los datos del consultorio.
     */
    public static ConsultorioEntradaLista of(Consultorio consultorio) {
        Ips ips = consultorio.getId().getIps();
        ServicioMedico servicioMedico = consultorio.getServicioMedico();

        return ConsultorioEntradaLista
            .builder()
            .idIps(ips.getId())
            .idConsultorio(consultorio.getId().getIdConsultorio())
            .cupsServicioMedico(servicioMedico.getCups())
            .nombreServicioMedico(servicioMedico.getNombre())
            .build();
    }
    
}
