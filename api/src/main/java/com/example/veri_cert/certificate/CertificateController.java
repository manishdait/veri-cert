package com.example.veri_cert.certificate;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
public class CertificateController {
  private final CertificateService certificateService;

  @GetMapping("/me")
  public ResponseEntity<List<CertificateResponse>> getCertificatesByUser(Authentication authentication) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.getCertificateByUser(authentication));
  }
  
  @GetMapping("/id/{uuid}")
  public ResponseEntity<CertificateResponse> getCertificateById(@PathVariable String uuid) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.getCertificateById(uuid));
  }

  @GetMapping("/issue-by/me")
  public ResponseEntity<List<CertificateResponse>> getCertificateByIssuer(Authentication authentication) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.getCertificatesByIssuer(authentication));
  }

  @PostMapping("/issue")
  public ResponseEntity<CertificateResponse> issueCertificate(@RequestBody CertificateRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.issueCertificate(request, authentication));
  }

  @PutMapping("/revoke/{uuid}")
  public ResponseEntity<CertificateResponse> revokeCertificate(@PathVariable String uuid, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.revokeCertificate(uuid, authentication));
  }

  @GetMapping("/verify/{uuid}")
  public ResponseEntity<Map<String, Boolean>> verifyCertificate(@PathVariable String uuid) {
    boolean bool = certificateService.verifyCertificate(uuid);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("verified", bool));
  }
}
