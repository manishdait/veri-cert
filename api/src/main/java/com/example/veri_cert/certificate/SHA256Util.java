package com.example.veri_cert.certificate;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class SHA256Util {
  public static String generateHash(String str) {
    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] hash = digest.digest(str.getBytes());

      StringBuilder sb = new StringBuilder();
      for (byte b : hash) {
        sb.append(String.format("%02x", b));
      }

      return sb.toString();
    } catch (NoSuchAlgorithmException e) {
      e.printStackTrace();
      throw new RuntimeException("Error generating SHA-256 hash");
    }
  }

  public static byte[] toBytes(String hex) {
    byte[] bytes = new byte[32];

    for (int i = 0; i < hex.length(); i+=2) {
      bytes[i/2] = (byte) (
        (Character.digit(hex.charAt(i), 16) * 16) +
        Character.digit(hex.charAt(i + 1), 16)
      );
    }

    return bytes;
  }
}
