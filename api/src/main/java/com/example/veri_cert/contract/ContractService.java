package com.example.veri_cert.contract;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.veri_cert.certificate.SHA256Util;
import com.hedera.hashgraph.sdk.ContractId;
import com.openelements.hiero.base.HieroException;
import com.openelements.hiero.base.SmartContractClient;
import com.openelements.hiero.base.data.ContractCallResult;
import com.openelements.hiero.base.data.ContractParam;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContractService {
  private final SmartContractClient smartContractClient;

  @Value("${spring.hiero.contract_address}")
  private String contractId;

  public Instant storeCertificate(String issuer, String memo, String certHash) {
    try {
      ContractCallResult result = smartContractClient.callContractFunction(
        ContractId.fromString(contractId), 
        "storeCertificate", 
        ContractParam.string(issuer),
        ContractParam.string(memo),
        ContractParam.bytes32(SHA256Util.toBytes(certHash))
      );

      return Instant.ofEpochSecond(result.getUint256(0).longValue());
    } catch (HieroException e) {
      e.printStackTrace();
      throw new RuntimeException(e.getMessage());
    }
  }

  public boolean verifyCertificate(String certHash) {
    try {
      ContractCallResult result = smartContractClient.callContractFunction(
        ContractId.fromString(contractId), 
        "verifyCertificate", 
        ContractParam.bytes32(SHA256Util.toBytes(certHash))
      );
      
      return result.getBool(0);
    } catch (HieroException e) {
      e.printStackTrace();
      throw new RuntimeException(e.getMessage());
    }
  }

  public void getCertificate(String certHash) {
    try {
      smartContractClient.callContractFunction(
        ContractId.fromString(contractId), 
        "getCertificate", 
        ContractParam.bytes32(SHA256Util.toBytes(certHash))
      );

      // String issuer = result.getString(0);
      // String memo = result.getString(1);
      // boolean revoke = result.getBool(2);
    } catch (HieroException e) {
      e.printStackTrace();
      throw new RuntimeException(e.getMessage());
    }
  }
}
