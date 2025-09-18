export interface Certificate {
  user: string;
  issuer: string;
  timestamp: Date;
  memo: string;
  uuid: string;
  revoke: boolean;
};

export interface CertificateRequest {
  userEmail: string;
  memo: string;
};