/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.relations.Trabaja;
import com.eps.apexeps.repositories.TrabajaRepository;

/**
 *
 * @author Alexander
 */
@Service
public class TrabajaService {

    @Autowired
    private TrabajaRepository trabajaRepository;

    public List<Trabaja> findAll() {
        return trabajaRepository.findAll();
    }

    public List<Trabaja> findByMedico_Dni(long dniMedico) {
        return trabajaRepository.findByMedico_Dni(dniMedico);
    }


    
}
