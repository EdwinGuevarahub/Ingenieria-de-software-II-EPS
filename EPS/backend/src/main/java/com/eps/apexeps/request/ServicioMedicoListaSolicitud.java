package com.eps.apexeps.request;

import lombok.Data;

/**
 * Clase que representa una solicitud de servicio médico para listar servicios médicos.
 * Contiene información sobre el nombre o código CUPS del servicio médico a buscar,
 * el tamaño de la página y el número de la página.
 * @autor Nicolás Sabogal
 */
@Data
public class ServicioMedicoListaSolicitud {
    
    /** Parte del nombre o código CUPS del servicio médico a buscar (opcional). */
    private String cupsNombreLike;
    /** Tamaño de la página (por defecto, 10). */
    private Integer qSize = 10;
    /** Número de la página (por defecto, 0). */
    private Integer qPage = 0;

}
