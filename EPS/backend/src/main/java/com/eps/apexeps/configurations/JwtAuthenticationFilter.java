package com.eps.apexeps.configurations;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.eps.apexeps.services.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filtro de autenticación JWT que se ejecuta una vez por solicitud.
 * Este filtro verifica la validez del token JWT y establece la autenticación en el contexto de seguridad.
 * @author Amigoscode
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    /** Servicio para manejar la autenticación JWT */
    private final JwtService jwtService;
    /** Servicio para cargar los detalles del usuario */
    private final UserDetailsService userDetailsService;

    /**
     * Método que se ejecuta para filtrar las solicitudes HTTP.
     * Este método verifica si el token JWT es válido y establece la autenticación en el contexto de seguridad.
     * @param request La solicitud HTTP.
     * @param response La respuesta HTTP.
     * @param filterChain La cadena de filtros.
     * @throws ServletException Si ocurre un error durante el procesamiento del filtro.
     * @throws IOException Si ocurre un error de entrada/salida.
     */
    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String token = getTokenFromRequest(request);
        final String username;

        if(token == null){
            filterChain.doFilter(request, response);
            return;
        }

        username = jwtService.getEmailFromToken(token);

        if(    username != null
            && SecurityContextHolder.getContext().getAuthentication() == null
           ) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(token, userDetails)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Método para obtener el token JWT del encabezado de autorización de la solicitud.
     * @param request La solicitud HTTP.
     * @return El token JWT si está presente, o null si no lo está.
     */
    private String getTokenFromRequest(HttpServletRequest request){
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (org.springframework.util.StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer"))
            return authHeader.substring(7);

        return null;
    }
}
