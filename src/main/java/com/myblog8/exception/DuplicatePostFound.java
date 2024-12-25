package com.myblog8.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DuplicatePostFound extends RuntimeException{
    public DuplicatePostFound(String msg){
        super(msg);
    }
}
