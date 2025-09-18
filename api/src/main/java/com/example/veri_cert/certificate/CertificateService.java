package com.example.veri_cert.certificate;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.veri_cert.contract.ContractService;
import com.example.veri_cert.user.User;
import com.example.veri_cert.user.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CertificateService {
  private final CertificateRepository certificateRepository;
  private final UserRepository userRepository;
  private final ContractService contractService;

  @Transactional
  public CertificateResponse issueCertificate(CertificateRequest request, Authentication authentication) {
    User user = userRepository.findByEmail(request.userEmail()).orElseThrow(
      () -> new EntityNotFoundException("User does not exists with email `%s`".formatted(request.userEmail()))
    );
    User issuer = (User) authentication.getPrincipal();
    Instant timestamp = Instant.now();

    String certificateHash = generateHash(user.getEmail(), issuer.getEmail(), request.memo(), timestamp);

    contractService.storeCertificate(user.getUname() ,issuer.getUname(), request.memo(), certificateHash);

    Certificate certificate = Certificate.builder()
      .memo(request.memo())
      .issuer(issuer)
      .user(user)
      .uuid(UUID.randomUUID().toString())
      .timestamp(timestamp)
      .revoke(false)
      .build();

    certificateRepository.save(certificate);

    return mapToResponse(certificate);
  }

  public boolean verifyCertificate(String uuid) {
    Certificate certificate = findCertificateById(uuid);

    String certHash = generateHash(
      certificate.getUser().getEmail(), 
      certificate.getIssuer().getEmail(), 
      certificate.getMemo(), 
      certificate.getTimestamp()
    );

    return contractService.verifyCertificate(certHash);
  }

  public CertificateResponse getCertificateById(String uuid) {
    Certificate certificate = findCertificateById(uuid);
    return mapToResponse(certificate);
  }

  public List<CertificateResponse> getCertificatesByIssuer(Authentication authentication) {
    User issuer = (User) authentication.getPrincipal();
    return certificateRepository.findByIssuer(issuer).stream()
      .map(c -> mapToResponse(c))
      .toList();
  }

  public List<CertificateResponse> getCertificateByUser(Authentication authentication) {
    User user = (User) authentication.getPrincipal();
    return certificateRepository.findByUser(user).stream()
      .map(c -> mapToResponse(c))
      .toList();
  }

  public CertificateResponse revokeCertificate(String uuid, Authentication authentication) {
    User issuer = (User) authentication.getPrincipal();
    Certificate certificate = findCertificateById(uuid);
    
    if (!certificate.getIssuer().getEmail().equals(issuer.getEmail())) {
      throw new RuntimeException("Operation nor permitted");
    }

    String certHash = generateHash(
      certificate.getUser().getEmail(), 
      certificate.getIssuer().getEmail(), 
      certificate.getMemo(), 
      certificate.getTimestamp()
    );

    contractService.revokeCertificate(certHash);
    certificate.setRevoke(true);
    certificateRepository.save(certificate);

    return mapToResponse(certificate);
  }

  private Certificate findCertificateById(String uuid) {
    return certificateRepository.findByUuid(uuid).orElseThrow(
      () -> new EntityNotFoundException("Certificate with ID `%s` does not exists")
    );
  }

  private CertificateResponse mapToResponse(Certificate certificate) {
    return new CertificateResponse(
      certificate.getUser().getUname(),
      certificate.getIssuer().getUname(), 
      certificate.getTimestamp(), 
      certificate.getMemo(), 
      certificate.getUuid(), 
      certificate.isRevoke()
    );
  }

  private String generateHash(String user, String issuer, String memo, Instant timestamp) {
    return SHA256Util.generateHash(
      "[User:%s|Issuer:%s|Memo:%s|Timestamp:%d|Provider:VeriCert]"
      .formatted(user, issuer, memo, Date.from(timestamp).getTime())
    );
  }
}
