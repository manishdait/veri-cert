export interface User {
  uname: string;
  email: string;
  role: 'ISSUER' | 'USER';
};