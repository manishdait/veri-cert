package com.example.veri_cert.auth;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.veri_cert.exceptions.DuplicateEntityException;
import com.example.veri_cert.security.JwtProvider;
import com.example.veri_cert.user.User;
import com.example.veri_cert.user.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtProvider jwtProvider;

  @Transactional
  public AuthResponse registerUser(RegistrationRequest request) {
    userRepository.findByEmail(request.email()).ifPresent(u -> {
      throw new DuplicateEntityException("User already exists with email `%s`".formatted(u.getEmail()));
    });

    User user = userRepository.save(
      User.builder()
        .uname(request.uname())
        .email(request.email())
        .password(passwordEncoder.encode(request.password()))
        .role(request.role())
        .build()
    );

    return generateAuthResponse(user.getUsername());
  }

  public AuthResponse authenticateUser(AuthRequest request) {
    try {
      Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password())
      );
      User user = (User) authentication.getPrincipal();
      
      return generateAuthResponse(user.getUsername());
    } catch (Exception e) {
      throw new BadCredentialsException("Invalid email or password");
    }
  }

  public AuthResponse refreshToken(HttpServletRequest request) {
    String token = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (token == null || !token.startsWith("Bearer ")) {
      throw new RuntimeException();
    }

    token = token.substring(7);
    String username = jwtProvider.getUsername(token);
  
    UserDetails userDetails = userRepository.findByEmail(username)
      .orElseThrow(() -> new RuntimeException());

    if (!jwtProvider.validToken(userDetails, token)) {
      throw new RuntimeException();
    }

    String accessToken = jwtProvider.generateToken(username);

    return new AuthResponse(accessToken, token);
  } 

  private AuthResponse generateAuthResponse(String username) {
    String accessToken = jwtProvider.generateToken(username);
    String refreshToken = jwtProvider.generateToken(username, 7*24*60*60);

    return new AuthResponse(accessToken, refreshToken);
  }
}
