package com.eps.apexeps.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.eps.apexeps.models.auth.ERol;
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
     * Carga un usuario con sus roles correspondientes a partir de su email y una de sus contraseñas.
     * Ver mapa de contraseñas para cada rol en Usuario.
     * @param email Email del usuario.
     * @param password Contraseña del usuario.
     * @see Usuario.
     * @return Usuario cargado o null si no se encuentra.
     */
    public Usuario loadUserByEmailAndPassword(String email, String password) {

        // Cargar el usuario por email con sus contraseñas sin una contraseña en uso.
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null)
            return null;

        // Para cada rol, se verifica si la contraseña coincide con la almacenada.
        for (ERol rol : ERol.values()) {
            String iterPassword = usuario.getPasswordMap().get(rol);
            // Si la contraseña coincide, se asigna la contraseña codificada al usuario y se añade el rol.
            if (iterPassword != null && iterPassword.equals(password)) {
                usuario.setPassword(password);
                usuario.getRoles().add(rol);
            }
        }

        // Si no se ha asignado ningún rol, la contraseña no coincide con ninguna de las almacenadas.
        if (usuario.getRoles().isEmpty())
            return null;

        return usuario;
    }

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
