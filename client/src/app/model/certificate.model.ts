export interface Certificate {
  issuer: string;
  timestamp: Date;
  memo: string;
  pubKey: string;
};