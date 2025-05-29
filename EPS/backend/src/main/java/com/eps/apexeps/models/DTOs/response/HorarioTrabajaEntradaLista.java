/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.models.DTOs.response;

import java.util.List;

import com.eps.apexeps.models.entity.Consultorio;
import com.eps.apexeps.models.entity.ConsultorioId;
import com.eps.apexeps.models.entity.Ips;
import com.eps.apexeps.models.entity.relations.EntradaHorario;
import com.eps.apexeps.models.entity.relations.Trabaja;
import com.eps.apexeps.models.entity.users.Medico;

import lombok.Builder;
import lombok.Data;

/**
 *
 * @author Alexander
 */
@Data
@Builder
public class HorarioTrabajaEntradaLista {
    
    private Integer idTrabaja;
    private Integer idConsultorio;
    private Integer idIps;
    private Long dniMedico;
    private List<EntradaHorario> horario;

    /**
     * Método estático para crear una instancia de HorarioTrabajaEntradaLista a partir de una entidad Trabaja
     * @param Trabaja Entidad que se mapeará al HorarioTrabajaEntradaLista.
     * @return Una nueva instancia de HorarioTrabajaEntradaLista.
     * @author Alexander
     */
    public static HorarioTrabajaEntradaLista of(Trabaja trabaja) {
        return HorarioTrabajaEntradaLista.builder()
                .idTrabaja(trabaja.getId())
                .idConsultorio(trabaja.getConsultorio().getId().getIdConsultorio())
                .idIps(trabaja.getConsultorio().getId().getIps().getId())
                .dniMedico(trabaja.getMedico().getDni())
                .horario(trabaja.getHorario())
                .build();
    }

    /**
     * Método estático para crear una entidad Trababaja a partir de una instancia de HorarioTrabajaEntradaLista
     * @param entrada HorarioTrabajaEntradaLista que se mapeará al Trabaja.
     * @return Una nueva instancia de Trabaja.
     * @author Nicolás Sabogal
     */
    public static Trabaja toTrabaja(HorarioTrabajaEntradaLista entrada) {
        Trabaja trabaja = Trabaja.builder()
                            .id(entrada.getIdTrabaja())
                            .consultorio(Consultorio.builder()
                                            .id(ConsultorioId.builder()
                                                    .ips(Ips.builder().id(entrada.getIdIps()).build())
                                                    .idConsultorio(entrada.getIdConsultorio())
                                                    .build()
                                            )
                                            .build()
                            )
                            .medico(Medico.builder().dni(entrada.getDniMedico()).build())
                            .horario("")
                            .build();

        for (EntradaHorario entradaHorario : entrada.getHorario())
            trabaja.addEntradaHorario(entradaHorario);

        return trabaja;
    }

}
