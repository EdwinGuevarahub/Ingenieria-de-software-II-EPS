/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.models.DTOs.response;

import java.util.List;

import com.eps.apexeps.models.entity.relations.EntradaHorario;
import com.eps.apexeps.models.entity.relations.Trabaja;

import lombok.Builder;
import lombok.Data;

/**
 *
 * @author Alexander
 */
@Data
@Builder
public class HorarioTrabajaEntradaLista {
    
    private int idTrabaja;
    private int idConsultorio;
    private int idIps;
    private List<EntradaHorario> horario;

    /**
     * Método estático para crear una instancia de HorarioTrabajaEntradaLista a partir de una entidad EntradaHorario.
     * @param entradaHorario La entidad EntradaHorario de la que se creará la instancia.
     * @return Una nueva instancia de HorarioTrabajaEntradaLista.
     */
    public static HorarioTrabajaEntradaLista of(Trabaja trabaja) {
        return HorarioTrabajaEntradaLista.builder()
                .idTrabaja(trabaja.getId())
                .idConsultorio(trabaja.getConsultorio().getId().getIdConsultorio())
                .idIps(trabaja.getConsultorio().getId().getIps().getId())
                .horario(trabaja.getHorario())
                .build();
    }

}
