package com.eps.apexeps.models.DTOs;

import com.eps.apexeps.models.DTOs.response.slotDisp;

import java.util.List;

public record SlotPageDTO(
        int totalPages,
        List<slotDisp> resultados
) { }
