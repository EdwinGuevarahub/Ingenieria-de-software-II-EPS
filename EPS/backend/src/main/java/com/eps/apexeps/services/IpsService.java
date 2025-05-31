/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.eps.apexeps.services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.DTOs.ServicioEnIpsDTO;
import com.eps.apexeps.models.entity.Ips;
import com.eps.apexeps.models.entity.users.AdmIps;
import com.eps.apexeps.repositories.AdmIpsRespository;
import com.eps.apexeps.repositories.IpsRepository;
import com.eps.apexeps.models.DTOs.response.IpsConServicios;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 *
 * @author Alexander
 */
@Service
@RequiredArgsConstructor
public class IpsService {

    /** Repositorio para manejar las operaciones CRUD de AdmIps */
    private final AdmIpsRespository admIpsRespository;

    /** Repositorio para manejar las operaciones CRUD de Ips */
    private final IpsRepository ipsRepository;

    public List<Ips> findAll() {
        return ipsRepository.findAll();
    }

    /**
     * Filtra las IPS según los parámetros proporcionados. Los parámetros son
     * opcionales y se aplican en orden de prioridad.
     *
     * @param nombre        Nombre de la IPS (opcional)
     * @param telefono      Teléfono de la IPS (opcional)
     * @param direccion     Dirección de la IPS (opcional)
     * @param fechaRegistro Fecha de registro de la IPS (opcional)
     * @return Lista de IPS que cumplen con los criterios de búsqueda
     */
    public Page<Ips> filtrarIpsMulticriterio(String nombre, String telefono, String direccion, String fechaRegistro,
            String cupsServicio, Integer qSize, Integer qPage) {
        try {
            // Limpieza de datos
            nombre = (nombre != null && !nombre.trim().isEmpty()) ? nombre.trim() : null;
            telefono = (telefono != null && !telefono.trim().isEmpty()) ? telefono.trim() : null;
            direccion = (direccion != null && !direccion.trim().isEmpty()) ? direccion.trim() : null;
            Pageable pageable = Pageable.ofSize(qSize).withPage(qPage);
            Page<Ips> resultado = ipsRepository.filtrarIpsMultiples(nombre, telefono, direccion, fechaRegistro,
                    cupsServicio, pageable);
            // List<Ips> resultado = ipsRepository.filtrarIpsMultiples(nombre, telefono,
            // direccion);
            
            return resultado;

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error al filtrar las IPS: " + e.getMessage(), e);
        }
    }

    public Optional<Ips> findById(Integer id) {
        return ipsRepository.findById(id);
    }


    /**
     * Crea una nueva IPS y administrador en la base de datos.
     * Intenta guardar la imagen de la IPS en el sistema de archivos.
     * @param adm El administrador con la información de la IPS.
     * @return El administrador creado con la IPS asociada.
     * @throws IOException Si ocurre un error al guardar la imagen
     */
    @Transactional
    public AdmIps create(AdmIps adm) throws IOException {

        // Primero intenta guardar la ips actualizada.
        Ips ipsNueva = ipsRepository.save(adm.getIps());
        // Luego intenta guardar la imagen de la ips en el sistema de archivos.
        ipsNueva.setImagen(adm.getIps().getImagen());
        ipsNueva.saveImage();

        // Finalmente intenta guardar el administrador de la IPS.
        return admIpsRespository.save(adm);
    }

    public void deleteById(Integer id) {
        ipsRepository.deleteById(id);
    }

    /**
     * Actualiza una IPS existente en la base de datos.
     * Intenta guardar la imagen de la IPS en el sistema de archivos.
     * @param ips La IPS a actualizar
     * @return La IPS actualizada
     * @throws IOException Si ocurre un error al guardar la imagen
     */
    @Transactional
    public Ips actualizarIps(Ips ips) throws IOException {

        // Primero intenta guardar la ips actualizada.
        Ips ipsExistente = ipsRepository.save(ips);
        // Luego intenta guardar la imagen de la ips en el sistema de archivos.
        ipsExistente.setImagen(ips.getImagen());
        ipsExistente.saveImage();

        return ipsExistente;
    }

    /**
     * Busca las IPS que ofrecen un servicio médico específico.
     *
     * @param nombreServicio Nombre del servicio médico
     * @return Lista de IPS que ofrecen el servicio médico
     */
    public List<Ips> obtenerIpsPorServicio(String cupsServicio) {
        return ipsRepository.buscarIpsPorCupsServicio(cupsServicio);
    }

    /**
     * Busca los servicios médicos ofrecidos por una IPS específica.
     *
     * @param nombreIps Nombre de la IPS
     * @param idIps     ID de la IPS
     * @return Lista de servicios médicos ofrecidos por la IPS
     */
    public List<ServicioEnIpsDTO> obtenerServiciosPorNombreOIdIps(Integer idIps) {
        return ipsRepository.buscarServicioPorNombreOIdIps(idIps);
    }

    public Optional<IpsConServicios> obtenerIpsConServicios(Integer idIps) {
        Optional<Ips> optionalIps = findById(idIps);
        if (optionalIps.isPresent()) {
            Ips ips = optionalIps.get();
            List<ServicioEnIpsDTO> servicios = obtenerServiciosPorNombreOIdIps(idIps);

            return Optional.of(IpsConServicios.of(ips, servicios));
        }

        return Optional.empty();
    }
}
