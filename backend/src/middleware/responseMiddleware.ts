export interface SuccessResponse<T> {
  success: true;
  data: T;
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
    timestamp: string;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export function successResponse<T>(
  data: T,
  metadata?: {
    page?: number;
    pageSize?: number;
    total?: number;
  }
): SuccessResponse<T> {
  return {
    success: true,
    data,
    metadata: metadata
      ? {
          ...metadata,
          timestamp: new Date().toISOString(),
        }
      : {
          timestamp: new Date().toISOString(),
        },
  };
}

export function errorResponse(
  message: string,
  code: string = 'ERROR',
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}
