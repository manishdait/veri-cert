package com.example.veri_cert.handler;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.veri_cert.exceptions.DuplicateEntityException;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler({DuplicateEntityException.class, IllegalArgumentException.class})
  public ResponseEntity<ErroResponse> handelBadRequestException(Exception e, HttpServletRequest request) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
      .body(new ErroResponse(
        Instant.now(),
        HttpStatus.BAD_REQUEST.value(),
        "Bad Request",
        e.getMessage(),
        request.getRequestURI()
      )
    );
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<ErroResponse> handelNotFoundException(EntityNotFoundException e, HttpServletRequest request) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
      .body(new ErroResponse(
        Instant.now(),
        HttpStatus.NOT_FOUND.value(),
        "Not Found",
        e.getMessage(),
        request.getRequestURI()
      )
    );
  }

  @ExceptionHandler(BadCredentialsException.class)
  public ResponseEntity<ErroResponse> handelBadCredentialException(BadCredentialsException e, HttpServletRequest request) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN)
      .body(new ErroResponse(
        Instant.now(),
        HttpStatus.FORBIDDEN.value(),
        "Invalid Credentials",
        e.getMessage(),
        request.getRequestURI()
      )
    );
  }

  @ExceptionHandler({JwtException.class, ExpiredJwtException.class})
  public ResponseEntity<ErroResponse> handelJwtException(Exception e, HttpServletRequest request) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
      .body(new ErroResponse(
        Instant.now(),
        HttpStatus.UNAUTHORIZED.value(),
        "Unauthorize Request",
        e.getMessage(),
        request.getRequestURI()
      )
    );
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErroResponse> handelException(Exception e, HttpServletRequest request) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(new ErroResponse(
        Instant.now(),
        HttpStatus.INTERNAL_SERVER_ERROR.value(),
        "Internal Server Error",
        "Something went wrong",
        request.getRequestURI()
      )
    );
  }
}
