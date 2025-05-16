/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.response;

import java.time.Instant;
import java.util.List;

import com.eps.apexeps.models.Ips;

import lombok.Builder;
import lombok.Data;

/**
 * Clase de respuesta para la lista de IPS con servicios.
 * 
 * @author Alexander
 */
@Data
@Builder
public class IpsEntradaListaConServicios {

    private Integer id;
    private String nombre;
    private String direccion;
    private String telefono;
    private Instant fechaRegistro;
    private List<String> servicios;

    public static IpsEntradaListaConServicios of(Ips ips, List<String> servicios) {
        return IpsEntradaListaConServicios.builder()
                .id(ips.getId())
                .nombre(ips.getNombre())
                .direccion(ips.getDireccion())
                .telefono(ips.getTelefono())
                .fechaRegistro(ips.getFechaRegistro())
                .servicios(servicios)
                .build();
    }
}
