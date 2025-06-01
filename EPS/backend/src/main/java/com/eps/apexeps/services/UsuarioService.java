package com.eps.apexeps.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.auth.Usuario;
import com.eps.apexeps.repositories.UsuarioRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para la gestión de usuarios.
 * @author Nicolás Sabogal
 */
@Service
@RequiredArgsConstructor
public class UsuarioService {

    /** Repositorio de usuarios */
    private final UsuarioRepository usuarioRepository;

    /**
     * Carga un usuario a partir de su email.
     * @param email Email del usuario.
     * @return Usuario cargado en su forma UserDetails o null si no se encuentra.
     */
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario == null)
            throw new UsernameNotFoundException("Usuario no encontrado: " + email);

        return usuario;
    }
    
}
