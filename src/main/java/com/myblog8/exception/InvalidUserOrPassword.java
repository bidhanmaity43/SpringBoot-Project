package com.myblog8.exception;

import org.springframework.security.core.AuthenticationException;

public class InvalidUserOrPassword extends AuthenticationException {
    public InvalidUserOrPassword(String message) {
        super(message);
    }
}