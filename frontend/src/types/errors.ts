/**
 * Common error types for the application
 */

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      [key: string]: unknown;
    };
    status?: number;
    headers?: {
      [key: string]: string;
    };
  };
  request?: unknown;
  message?: string;
} 