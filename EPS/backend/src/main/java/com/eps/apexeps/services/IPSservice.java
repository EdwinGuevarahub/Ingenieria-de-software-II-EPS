/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.Ips;
import com.eps.apexeps.repositories.IPSRespository;

/**
 *
 * @author Alexander
 */
@Service
public class IPSservice {

    @Autowired
    private IPSRespository ipsRespository;

    public List<Ips> findByNombreContainingIgnoreCase(String nombre) {
        return ipsRespository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Ips> findAll() {
        return ipsRespository.findAll();
    }
    public Ips findById(Integer id) {
        return ipsRespository.findById(id).orElse(null);
    }
    public Ips save(Ips ips) {
        return ipsRespository.save(ips);
    } 
    public void deleteById(Integer id) {
        ipsRespository.deleteById(id);
    }
    
    public List<Ips> obtenerIpsPorServicio(String nombreServicio) {
        System.out.println("Nombre del servicio: " + nombreServicio);
        return ipsRespository.buscarIpsPorNombreServicio(nombreServicio);
    }
}
