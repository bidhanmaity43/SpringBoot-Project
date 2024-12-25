package com.myblog8.controller;

import com.myblog8.exception.DuplicatePostFound;
import com.myblog8.payload.PostDto;
import com.myblog8.payload.PostResponse;
import com.myblog8.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/api/post")

public class PostController {

    private PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // http://localhost:8080/api/post

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> savePost(@Valid @RequestBody PostDto postDto, BindingResult result) {
        // Check for duplicates before saving
        if (postService.isPostTitleDuplicate(postDto.getTitle())) {
            throw new DuplicatePostFound("Post with the same title already exists.");
        }

        if (result.hasErrors()) {
            return new ResponseEntity<>(result.getFieldError().getDefaultMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        PostDto dto = postService.savePost(postDto);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }


    // http://localhost:8080/api/post?pageNo=5&pageSize=6&sortBy=title&sortDir=dsc
    @GetMapping
    public PostResponse getPost(
            @RequestParam(value = "pageNo", defaultValue="0",required = false)int pageNo,
            @RequestParam(value = "pageSize", defaultValue="5",required = false)int pageSize,
            @RequestParam(value = "sortBy", defaultValue="id",required = false)String sortBy,
            @RequestParam(value = "sortDir", defaultValue="asc",required = false)String sortDir
    ) {
        PostResponse postResponse = postService.getPost(pageNo,pageSize,sortBy,sortDir);
        return postResponse;
    }
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable("postId") long id) {
        postService.deletePost(id);
        return new ResponseEntity<>("Post is deleted", HttpStatus.OK); //200
    }

    //http://localhost:8080/api/post/1
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{postId}")
    public ResponseEntity<PostDto> updatePost(@PathVariable("postId") long id, @RequestBody PostDto postDto) {
        PostDto dto = postService.updatePost(id, postDto);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    //http://localhost:8080/api/post/1
    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPostById(@PathVariable("postId") long id) {
        PostDto dto = postService.getPostById(id);
        return new ResponseEntity<>(dto, HttpStatus.OK);

    }

}