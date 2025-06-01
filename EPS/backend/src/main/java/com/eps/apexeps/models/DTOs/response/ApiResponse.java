package com.eps.apexeps.models.DTOs.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    private int status;
    private boolean success;
    private String message;
    private Object data;
}
