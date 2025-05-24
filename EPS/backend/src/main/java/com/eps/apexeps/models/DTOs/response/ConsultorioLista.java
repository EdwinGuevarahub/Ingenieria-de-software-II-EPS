package com.eps.apexeps.models.DTOs.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultorioLista {

    /** Número total de páginas de consultorios. */
    private Integer totalPages;
    /** Lista de consultorios. */
    private List<ConsultorioEntradaLista> consultorios;
    
}
