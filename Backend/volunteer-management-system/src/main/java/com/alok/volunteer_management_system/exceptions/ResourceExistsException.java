package com.alok.volunteer_management_system.exceptions;

public class ResourceExistsException extends RuntimeException {

    public ResourceExistsException(String message) {
        super(message);
    }

    public ResourceExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}