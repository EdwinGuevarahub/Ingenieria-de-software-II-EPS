/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.response;

import com.eps.apexeps.models.entity.Ips;

import lombok.Builder;
import lombok.Data;

/**
 * Clase que representa una entrada en una lista de IPS para mostrar en la interfaz de usuario.
 * Contiene información básica de la IPS, como su ID y nombre.
 * @author Alexander
 */
@Data
@Builder
public class IpsEntradaLista {

    /** ID de la IPS. Clave primaria. */
    private Integer id;

    /** Nombre de la IPS. */
    private String nombre;

    /**
     * Método estático para crear un objeto IpsEntradaLista a partir de un objeto Ips.
     * @param ips El objeto Ips del cual se extraerán los datos.
     * @return Un objeto IpsEntradaLista con los datos de la IPS.
     */
    public static IpsEntradaLista of(Ips ips) {
        return IpsEntradaLista.builder()
                .id(ips.getId())
                .nombre(ips.getNombre())
                .build();
    }
}
