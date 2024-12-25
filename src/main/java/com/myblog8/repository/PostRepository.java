package com.myblog8.repository;

import com.myblog8.entity.Post;
import com.myblog8.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Boolean existsByTitle(String title);
}
