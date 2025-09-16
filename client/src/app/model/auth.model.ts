export interface RegistrationRequest {
  uname: string;
  email: string;
  password: string; 
  role: 'ISSUER' | 'USER'
};

export interface AuthRequest {
  email: string;
  password: string;
};

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
};