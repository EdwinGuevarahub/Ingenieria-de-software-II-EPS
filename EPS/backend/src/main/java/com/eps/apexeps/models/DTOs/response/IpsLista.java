/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.models.DTOs.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Alexander
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IpsLista {

    /** Número total de páginas de Ips. */
    private Integer totalPages;
    /** Lista de entradas de Ips. */
    private List<IpsEntradaLista> ips;
}
