package com.myblog8.security;

import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
@Component
public class TokenBlacklist {
    private final ConcurrentMap<String, Long> invalidatedTokens = new ConcurrentHashMap<>();

    public void invalidateToken(String token) {
        invalidatedTokens.put(token, System.currentTimeMillis());
    }

    public boolean isTokenInvalid(String token) {
        Long invalidatedTime = invalidatedTokens.get(token);
        return invalidatedTime != null;
    }
}
