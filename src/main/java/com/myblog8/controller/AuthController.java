package com.myblog8.controller;


import com.myblog8.config.CustomUserDetails;
import com.myblog8.entity.User;
import com.myblog8.exception.BlogAPIException;
import com.myblog8.payload.JWTAuthResponse;
import com.myblog8.payload.LoginDto;
import com.myblog8.payload.SignUpDto;
import com.myblog8.repository.RoleRepository;
import com.myblog8.repository.UserRepository;
import com.myblog8.security.JwtTokenProvider;
import com.myblog8.security.TokenBlacklist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


@RestController
@RequestMapping("/api/auth")

public class AuthController {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private TokenBlacklist tokenBlacklist;


    //localhost:8080/api/auth/signin
    @PostMapping("/signin")
    public ResponseEntity<JWTAuthResponse> authenticateUser(@RequestBody LoginDto
                                                                    loginDto) {
        Authentication authentication = authenticationManager.authenticate(new
                UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

// get token form tokenProvider
        String token = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JWTAuthResponse(token));
    }

    //http://localhost:8080/api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpDto signUpDto) {
        Boolean emailExists = userRepo.existsByEmail(signUpDto.getEmail());
        if (emailExists) {
            return new ResponseEntity<>("Email id already exists", HttpStatus.BAD_REQUEST);
        }
        Boolean usernameExists = userRepo.existsByUsername(signUpDto.getUsername());
        if (usernameExists) {
            return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
        }
        User user = new User();
        user.setName(signUpDto.getName());
        user.setEmail(signUpDto.getEmail());
        user.setUsername(signUpDto.getUsername());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
        userRepo.save(user);

        return new ResponseEntity<>("User is Registered", HttpStatus.CREATED);
    }

    @GetMapping("/currentUser")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        User currentUser = new User();
        currentUser.setUsername(customUserDetails.getUsername());
        currentUser.setName(customUserDetails.getName()); // Get the user's name using the getName() method
        return ResponseEntity.ok(currentUser);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // Extract the JWT token from the Authorization header
            String token = tokenProvider.resolveToken(request);

            // Check if the token is valid
            if (token != null && tokenProvider.validateToken(token)) {
                // Invalidate the token by adding it to the blacklist
                tokenBlacklist.invalidateToken(token);
            }
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return new ResponseEntity<>("Error logging out", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}




