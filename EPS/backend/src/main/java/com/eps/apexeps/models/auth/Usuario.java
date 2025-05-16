package com.eps.apexeps.models.auth;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Clase que representa un usuario en la aplicación.
 * Implementa la interfaz UserDetails de Spring Security.
 * Contiene un mapa de contraseñas para cada rol y una contraseña en uso.
 * También incluye los roles asociados a la contraseña en uso.
 * @author Nicolás Sabogal
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario implements UserDetails {

    /** Email del usuario */
    private String email;
    /** Password del usuario en uso */
    private String password;

    /** Mapa que contiene las contraseñas del usuario para cada rol */
    private Map<ERol, String> passwordMap;

    /** Lista de roles del usuario */
    @Builder.Default
    private Set<ERol> roles = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .toList();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
}
