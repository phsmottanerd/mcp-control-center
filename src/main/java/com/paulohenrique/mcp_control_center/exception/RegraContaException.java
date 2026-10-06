package com.paulohenrique.mcp_control_center.exception;

import org.springframework.http.HttpStatus;

public class RegraContaException extends RuntimeException {
    private final HttpStatus status;

    public RegraContaException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() { return status; }
}
