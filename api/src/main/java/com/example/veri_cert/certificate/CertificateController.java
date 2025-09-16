package com.example.veri_cert.certificate;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/v1/certificates")
@RequiredArgsConstructor
public class CertificateController {
  private final CertificateService certificateService;

  @GetMapping()
  public ResponseEntity<List<CertificateResponse>> getIsseuedCertificated(Authentication authentication) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.getIsseuedCertificated(authentication));
  }
  

  @PostMapping("/issue")
  public ResponseEntity<CertificateResponse> issueCertificate(@RequestBody CertificateRequest request, Authentication authentication) {
    return ResponseEntity.status(HttpStatus.OK).body(certificateService.issueCertificate(request, authentication));
  }

  @GetMapping("/verify/{pubKey}")
  public ResponseEntity<Map<String, Boolean>> verifyCertificate(@PathVariable String pubKey) {
    boolean bool = certificateService.verifyCertificate(pubKey);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("verified", bool));
  }
}
