/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.entity.users.AdmIps;
import com.eps.apexeps.repositories.AdmIpsRespository;

/**
 *
 * @author Alexander
 */

@Service 
public class AdmIpsService {

    @Autowired
    private AdmIpsRespository admIpsRespository;

    /**
     * Retorna todos los administradores IPS registrados.
     */
    public List<AdmIps> findAll() {
        return admIpsRespository.findAll();
    }

    /**
     * Busca un administrador por su email.
     * @param email El correo electrónico del administrador.
     * @return Optional con el administrador si existe.
     */
    public AdmIps findByEmail(String email) {
        return admIpsRespository.findById(email).orElse(null);
    }

    /**
     * Guarda o actualiza un administrador IPS.
     * @param admIps El administrador a guardar.
     * @return El administrador guardado.
     */
    public AdmIps save(AdmIps admIps) {
        return admIpsRespository.save(admIps);
    }

    /**
     * Elimina un administrador IPS por su email.
     * @param email El correo electrónico del administrador.
     */
    public void deleteByEmail(String email) {
        admIpsRespository.deleteById(email);
    }

    /**
     * Verifica si existe un administrador con el email dado.
     */
    public boolean existsByEmail(String email) {
        return admIpsRespository.existsByEmail(email);
    }

    /**
     * Busca un administrador IPS por su correo electrónico y retorna el ID de la IPS asociada.
     * @param email El correo electrónico del administrador.
     * @return El ID de la IPS asociada, o null si no se encuentra el administrador.
     * @throws IllegalArgumentException Si el email es nulo.
     */
    public Integer findIdIpsByEmail(String email) {
        if (email == null)
            throw new IllegalArgumentException("El email no puede ser nulo");

        AdmIps admIps = admIpsRespository.findByEmail(email).orElse(null);

        if (admIps == null)
            return null;

        return admIps.getIps().getId();
    }

}
