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

    String certificateHash = SHA256Util.generateHash(
      "[User:%s|Issuer:%s|Memo:%s|Timestamp:%d|Provider:VeriCert]"
      .formatted(user.getEmail(), issuer.getEmail(), request.memo(), Date.from(timestamp).getTime())
    );

    System.out.println("[User:%s|Issuer:%s|Memo:%s|Timestamp:%d|Provider:VeriCert]"
      .formatted(user.getEmail(), issuer.getEmail(), request.memo(), Date.from(timestamp).getTime()));

    contractService.storeCertificate(issuer.getName(), request.memo(), certificateHash);

    System.out.println(certificateHash);

    Certificate certificate = Certificate.builder()
      .memo(request.memo())
      .issuer(issuer)
      .user(user)
      .pubId(UUID.randomUUID().toString())
      .timestamp(timestamp)
      .build();

    certificateRepository.save(certificate);

    return new CertificateResponse(issuer.getName(), timestamp, request.memo(), certificateHash);
  }

  public boolean verifyCertificate(String pubId) {
    Certificate certificate = certificateRepository.findByPubId(pubId).orElseThrow(
      () -> new EntityNotFoundException("Certificate not exists")
    );

    String certHash = SHA256Util.generateHash(
      "[User:%s|Issuer:%s|Memo:%s|Timestamp:%d|Provider:VeriCert]"
      .formatted(certificate.getUser().getEmail(), certificate.getIssuer().getEmail(), certificate.getMemo(), Date.from(certificate.getTimestamp()).getTime())
    );

    System.out.println("[User:%s|Issuer:%s|Memo:%s|Timestamp:%d|Provider:VeriCert]"
      .formatted(certificate.getUser().getEmail(), certificate.getIssuer().getEmail(), certificate.getMemo(), Date.from(certificate.getTimestamp()).getTime()));

    System.out.println(certHash);

    boolean bool = contractService.verifyCertificate(certHash);
    return bool;
  }

  public List<CertificateResponse> getIsseuedCertificated(Authentication authentication) {
    User user = (User) authentication.getPrincipal();
    return certificateRepository.findByUser(user).stream()
      .map(c -> new CertificateResponse(c.getIssuer().getUname(), c.getTimestamp(), c.getMemo(), c.getPubId()))
      .toList();
  }
}
