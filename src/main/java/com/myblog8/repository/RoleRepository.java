package com.myblog8.repository;

import com.myblog8.entity.Role;
import com.myblog8.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<User> findByName(String roleName);
}
