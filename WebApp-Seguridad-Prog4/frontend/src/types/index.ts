// Tipos para autenticación
export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

// Tipos para productos
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
}

// Tipos para transferencias
export interface TransferData {
  fromAccount: string;
  toAccount: string;
  amount: string;
}

// Tipos para CAPTCHA
export interface CaptchaData {
  captchaId: string;
  captcha: string;
  debug?: string;
}

// Tipos para resultados de vulnerabilidades
export interface BruteForceAttempt {
  attempt: number;
  username: string;
  password: string;
  success: boolean;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
  stack?: string;
}

// Tipos para archivos
export interface UploadResponse {
  message: string;
  filename: string;
  path: string;
}

// Enums para las vulnerabilidades
export enum VulnerabilityType {
  BRUTE_FORCE = 'brute-force',
  COMMAND_INJECTION = 'command-injection',
  CSRF = 'csrf',
  FILE_INCLUSION = 'file-inclusion',
  FILE_UPLOAD = 'file-upload',
  INSECURE_CAPTCHA = 'insecure-captcha',
  SQL_INJECTION = 'sql-injection',
  BLIND_SQL_INJECTION = 'blind-sql-injection'
}

export interface Vulnerability {
  id: VulnerabilityType;
  name: string;
  component: React.ComponentType;
}
