export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface TokenPayload {
  userId: string;
  username: string;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  statusCode: number;
}

export class AppError extends Error {
  statusCode: number;
  code?: string;
  field?: string;

  constructor(message: string, statusCode: number, code?: string, field?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
