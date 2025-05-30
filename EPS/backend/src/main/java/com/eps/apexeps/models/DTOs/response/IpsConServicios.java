/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.models.DTOs.response;

import java.time.Instant;
import java.util.List;

import com.eps.apexeps.models.DTOs.ServicioEnIpsDTO;
import com.eps.apexeps.models.entity.Ips;
import com.eps.apexeps.models.entity.users.AdmEps;

import lombok.Builder;
import lombok.Data;

/**
 * Clase de respuesta para la lista de IPS con servicios.
 * 
 * @author Alexander
 */
@Data
@Builder
public class IpsConServicios {

    private Integer id;
    private String nombre;
    private String direccion;
    private String telefono;
    private Instant fechaRegistro;
    private AdmEps admEps;
    private Boolean activo;
    private List<ServicioEnIpsDTO> servicios;
    private byte[] imagen;

    public static IpsConServicios of(Ips ips, List<ServicioEnIpsDTO> servicios) {
        return IpsConServicios.builder()
                .id(ips.getId())
                .nombre(ips.getNombre())
                .direccion(ips.getDireccion())
                .telefono(ips.getTelefono())
                .fechaRegistro(ips.getFechaRegistro())
                .activo(ips.getActivo())
                .servicios(servicios)
                .admEps(ips.getAdmEps())
                .imagen(ips.getImagen())
                .build();
    }
}
