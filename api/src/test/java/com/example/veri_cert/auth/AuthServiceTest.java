package com.example.veri_cert.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.veri_cert.exceptions.DuplicateEntityException;
import com.example.veri_cert.security.JwtProvider;
import com.example.veri_cert.user.Role;
import com.example.veri_cert.user.User;
import com.example.veri_cert.user.UserRepository;
import com.github.dockerjava.zerodep.shaded.org.apache.hc.core5.http.HttpHeaders;

import jakarta.servlet.http.HttpServletRequest;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
  @Captor
  ArgumentCaptor<User> userCaptor;

  @Mock
  private UserRepository userRepository;
  @Mock
  private PasswordEncoder passwordEncoder;
  @Mock
  private AuthenticationManager authenticationManager;
  @Mock
  private JwtProvider jwtProvider;

  private AuthService authService;

  @BeforeEach
  void setup() {
    authService = new AuthService(userRepository, passwordEncoder, authenticationManager, jwtProvider);
  }

  @AfterEach
  void purge() {
    authService = null;
  }

  @Test
  void shouldRegisterUser_ifUserAlreadyNotExists_andReturnAuthResponse() {
    final User mockUser = Mockito.mock(User.class);
    final String encodedPassword = "encoded-password";
    final String accessToken = "access-token";
    final String refreshToken = "refresh-token";

    final RegistrationRequest request = new RegistrationRequest("Jhon Doe", "jhon@test.in", "Password", Role.USER);

    when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
    when(passwordEncoder.encode(request.password())).thenReturn(encodedPassword);
    when(jwtProvider.generateToken(request.email())).thenReturn(accessToken);
    when(jwtProvider.generateToken(eq(request.email()), eq(7 * 24 * 60 * 60))).thenReturn(refreshToken);
    when(userRepository.save(any(User.class))).thenReturn(mockUser);
    when(mockUser.getUsername()).thenReturn(request.email());

    final AuthResponse result = authService.registerUser(request);

    verify(userRepository, times(1)).findByEmail(request.email());
    verify(passwordEncoder, times(1)).encode(request.password());
    verify(jwtProvider, times(1)).generateToken(request.email());
    verify(jwtProvider, times(1)).generateToken(eq(request.email()), eq(7 * 24 * 60 * 60));
    verify(userRepository, times(1)).save(userCaptor.capture());

    User capture = userCaptor.getValue();
    Assertions.assertThat(capture).isNotNull();
    Assertions.assertThat(capture.getUname()).isEqualTo(request.uname());
    Assertions.assertThat(capture.getEmail()).isEqualTo(request.email());
    Assertions.assertThat(capture.getRole()).isEqualTo(request.role());
    Assertions.assertThat(capture.getPassword()).isEqualTo(encodedPassword);

    Assertions.assertThat(result).isNotNull();
    Assertions.assertThat(result.accessToken()).isEqualTo(accessToken);
    Assertions.assertThat(result.refreshToken()).isEqualTo(refreshToken);
  }

  @Test
  void shouldThrow_duplicateEntityException_ifUserAlreadyExists_withGiverEmail() {
    final User mockUser = Mockito.mock(User.class);
    final RegistrationRequest request = new RegistrationRequest("Kate Doe", "kate@test.in", "Password", Role.USER);

    when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(mockUser));
    when(mockUser.getEmail()).thenReturn(request.email());

    Assertions.assertThatThrownBy(() -> authService.registerUser(request))
      .isInstanceOf(DuplicateEntityException.class)
      .hasMessage("User already exists with email `kate@test.in`");

    verify(userRepository, times(1)).findByEmail(request.email());
  }

  @Test 
  void shouldReturn_authResponse_whenUserLogin_withValidCredentials() {
    final User mockUser = Mockito.mock(User.class);
    final Authentication mockAuthentication = Mockito.mock(Authentication.class);
    final String accessToken = "access-token";
    final String refreshToken = "refresh-token";
    
    final AuthRequest request = new AuthRequest("jhon@test.in", "Password");

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuthentication);
    when(jwtProvider.generateToken(request.email())).thenReturn(accessToken);
    when(jwtProvider.generateToken(eq(request.email()), eq(7 * 24 * 60 * 60))).thenReturn(refreshToken);
    when(mockAuthentication.getPrincipal()).thenReturn(mockUser);
    when(mockUser.getUsername()).thenReturn(request.email());
    
    final AuthResponse result = authService.authenticateUser(request);

    verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    verify(jwtProvider, times(1)).generateToken(request.email());
    verify(jwtProvider, times(1)).generateToken(eq(request.email()), eq(7 * 24 * 60 * 60));

    Assertions.assertThat(result).isNotNull();
    Assertions.assertThat(result.accessToken()).isEqualTo(accessToken);
    Assertions.assertThat(result.refreshToken()).isEqualTo(refreshToken);
  }

  @Test 
  void shouldThrow_badCredentialException_whenUserLogin_withInvalidCredentials() {
    final AuthRequest request = new AuthRequest("kate@test.in", "Password");

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
      .thenThrow(new BadCredentialsException("Invalid username or password"));
    
    Assertions.assertThatThrownBy(() -> authService.authenticateUser(request))
      .isInstanceOf(BadCredentialsException.class);
  }

  @Test
  void shouldReturn_authResponse_withNewAccessToken_forValidRefreshToken() {
    final HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
    final String refreshToken = "refresh-token";
    final String newAccessToken = "new-access-token";
    final String username = "jhon@test.in";

    final User user = User.builder().email(username).build();

    when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + refreshToken);
    when(jwtProvider.getUsername(refreshToken)).thenReturn(username);
    when(userRepository.findByEmail(username)).thenReturn(Optional.of(user));
    when(jwtProvider.validToken(eq(user), eq(refreshToken))).thenReturn(true);
    when(jwtProvider.generateToken(username)).thenReturn(newAccessToken);

    AuthResponse response = authService.refreshToken(request);
      
    verify(jwtProvider, times(1)).getUsername(refreshToken);
    verify(userRepository, times(1)).findByEmail(username);
    verify(jwtProvider, times(1)).validToken(eq(user), eq(refreshToken));
    verify(jwtProvider, times(1)).generateToken(username);

    Assertions.assertThat(response).isNotNull();
    Assertions.assertThat(response.accessToken()).isEqualTo(newAccessToken);
    Assertions.assertThat(response.refreshToken()).isEqualTo(refreshToken);
  }

  @Test
  void shouldThrow_runtimeException_whenAuthorizationHeaderIsMissing() {
    final HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
    when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn(null);

    Assertions.assertThatThrownBy(() -> authService.refreshToken(request))
      .isInstanceOf(RuntimeException.class);
      
    verify(jwtProvider, times(0)).getUsername(any(String.class));
  }
  
  @Test
  void shouldThrow_runtimeException_whenTokenDoesNotStartWithBearer() {
    final HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
    when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Token refreshToken");

    Assertions.assertThatThrownBy(() -> authService.refreshToken(request))
      .isInstanceOf(RuntimeException.class);

    verify(jwtProvider, times(0)).getUsername(any(String.class));
  }

  @Test
  void shouldThrowException_whenUserIsNotFound() {  
    final HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
    final String refreshToken = "invalid-token";
    final String username = "nonexistent-user@test.in";

    when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + refreshToken);
    when(jwtProvider.getUsername(refreshToken)).thenReturn(username);
    when(userRepository.findByEmail(username)).thenReturn(Optional.empty());

    Assertions.assertThatThrownBy(() -> authService.refreshToken(request))
      .isInstanceOf(RuntimeException.class);
      
    verify(userRepository, times(1)).findByEmail(username);
    verify(jwtProvider, times(0)).validToken(any(), any());
  }

  @Test
  void shouldThrow_runtimeException_whenRefreshTokenIsInvalid() {
    final HttpServletRequest request = Mockito.mock(HttpServletRequest.class);
    final String refreshToken = "expired-token";
    final String username = "jhon@test.in";
    final User user = User.builder().email(username).build();

    when(request.getHeader(HttpHeaders.AUTHORIZATION)).thenReturn("Bearer " + refreshToken);
    when(jwtProvider.getUsername(refreshToken)).thenReturn(username);
    when(userRepository.findByEmail(username)).thenReturn(Optional.of(user));
    when(jwtProvider.validToken(eq(user), eq(refreshToken))).thenReturn(false);

      // Act & Assert
    Assertions.assertThatThrownBy(() -> authService.refreshToken(request))
      .isInstanceOf(RuntimeException.class);

    verify(jwtProvider, times(1)).validToken(eq(user), eq(refreshToken));
    verify(jwtProvider, times(0)).generateToken(any(String.class));
  }
}
