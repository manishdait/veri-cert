package com.example.veri_cert.security;

import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {
  @Value("${spring.security.jwt.secret-key}")
  private String secretKey;

  @Value("${spring.security.jwt.expiration}")
  private Integer expiration;

  public String generateToken(String username) {
    return generateToken(username,  this.expiration);
  }

  public String generateToken(String username, Integer expiration) {
    return Jwts.builder()
      .subject(username)
      .issuedAt(Date.from(Instant.now()))
      .expiration(Date.from(Instant.now().plusSeconds(expiration)))
      .signWith(secretKey())
      .compact();
  }

  public Claims extractAllClaims(String token) {
    return Jwts.parser()
      .verifyWith(secretKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }

  public String getUsername(String token) {
    try {
      return extractAllClaims(token).getSubject();
    } catch (Exception e) {
      throw new JwtException("JWT token is invalid or has been expired");
    }
  }

  public boolean expiredToken(String token) {
    return extractAllClaims(token).getExpiration().before(new Date());
  }

  public boolean validToken(UserDetails userDetails, String token) {
    return userDetails.getUsername().equals(getUsername(token)) 
      && !expiredToken(token);
  }

  private SecretKey secretKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
  }
}
