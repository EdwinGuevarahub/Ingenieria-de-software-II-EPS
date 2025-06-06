package com.eps.apexeps.models.DTOs.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Clase de respuesta que representa una lista de entradas de agenda.
 * Se utiliza para enviar información sobre múltiples citas médicas.
 * @author Nicolás Sabogal
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendaListaMedico {

    /** Número total de páginas de agenda. */
    private Integer totalPages;
    /** Lista de entradas de agenda. */
    private List<AgendaEntradaListaMedico> agendas;
    
}
