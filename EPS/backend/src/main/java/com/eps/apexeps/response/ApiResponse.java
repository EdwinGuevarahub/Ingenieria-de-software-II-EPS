package com.eps.apexeps.response;

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
