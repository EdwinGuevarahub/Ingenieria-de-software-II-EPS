package com.eps.apexeps.models.DTOs.response;

import com.eps.apexeps.models.entity.users.Medico;

import lombok.Builder;
import lombok.Data;

/**
 * Clase que representa una entrada en una lista de médicos para mostrar en la interfaz de usuario.
 * Contiene información básica del médico, como su DNI y nombre.
 * @author Nicolás Sabogal
 */
@Data
@Builder
public class MedicoEntradaLista {

    /** DNI del médico. Clave primaria. */
    private Long dni;

    /** Nombre del médico. */
    private String nombre;

    /**
     * Método estático para crear un objeto MedicoEntradaLista a partir de un objeto Medico.
     * @param medico El objeto Medico del cual se extraerán los datos.
     * @return Un objeto MedicoEntradaLista con los datos del médico.
     */
    public static MedicoEntradaLista of(Medico medico) {
        return MedicoEntradaLista.builder()
                .dni(medico.getDni())
                .nombre(medico.getNombre())
                .build();
    }

}
