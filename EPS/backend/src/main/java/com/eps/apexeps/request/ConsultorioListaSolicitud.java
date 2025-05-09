package com.eps.apexeps.request;

import lombok.Data;

/**
 * Clase que representa una solicitud de servicio médico para listar servicios médicos.
 * Contiene información sobre el nombre o código CUPS del servicio médico a buscar,
 * el tamaño de la página y el número de la página.
 * @autor Nicolás Sabogal
 */
@Data
public class ConsultorioListaSolicitud {
    
    /** El CUPS del servicio médico asociado a los consultorios (opcional). */
    private String cupsServicioMedico;
    /** Número que se usará para filtrar los consultorios por su id (opcional). */
    private Integer idConsultorioLike;
    /** Tamaño de la página (por defecto, 10). */
    private Integer qSize = 10;
    /** Número de la página (por defecto, 0). */
    private Integer qPage = 0;

}
