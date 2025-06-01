/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.models.DTOs;

/**
 *
 * @author Alexander
 */
public class ServicioEnIpsDTO {
    private String cups;
    private String nombre;

    public ServicioEnIpsDTO(String cups, String nombre) {
        this.cups = cups;
        this.nombre = nombre;
    }

    // Getters y Setters
    public String getCups() {
        return cups;
    }

    public void setCups(String cups) {
        this.cups = cups;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
