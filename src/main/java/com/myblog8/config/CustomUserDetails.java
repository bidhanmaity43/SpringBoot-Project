package com.myblog8.config;

import com.myblog8.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {
    private final User user;
    private final List<String> roles;

    public CustomUserDetails(User user, List<String> roles) {
        this.user = user;
        this.roles = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Map roles to authorities
        return roles.stream()
                .map(role -> (GrantedAuthority) () -> role) // Assuming roles are in the format "ROLE_XXX"
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    // Additional method to get user's name
    public String getName() {
        return user.getName();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Adjust as needed based on account expiration policy
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Adjust as needed based on account locking policy
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Adjust as needed based on credentials expiration policy
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
