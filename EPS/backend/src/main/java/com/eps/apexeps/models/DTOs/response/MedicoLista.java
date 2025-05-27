package com.eps.apexeps.models.DTOs.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoLista {

    /** Número total de páginas de médicos. */
    private Integer totalPages;
    /** Lista de médicos. */
    private List<MedicoEntradaLista> medicos;
    
}
