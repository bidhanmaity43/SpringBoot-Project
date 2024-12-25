package com.myblog8.service;

import com.myblog8.payload.CommentDto;

import java.util.*;

public interface CommentService {
    CommentDto createComment (long postId, CommentDto commentDto);
    List<CommentDto> getCommentsByPostId(long postId);

    CommentDto getCommentById(Long postId, Long commentId);

    List<CommentDto> getAllComments();


    void deletecommentById(long postId, long commentId);
}
