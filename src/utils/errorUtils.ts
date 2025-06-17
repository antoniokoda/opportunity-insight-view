import { toast } from '@/hooks/use-toast';

export type AppError = {
  code: string;
  message: string;
  details?: unknown;
};

export const ErrorCodes = {
  AUTH: {
    INVALID_CREDENTIALS: 'auth/invalid-credentials',
    USER_NOT_FOUND: 'auth/user-not-found',
    EMAIL_NOT_CONFIRMED: 'auth/email-not-confirmed',
    SESSION_EXPIRED: 'auth/session-expired',
  },
  API: {
    NETWORK_ERROR: 'api/network-error',
    TIMEOUT: 'api/timeout',
    SERVER_ERROR: 'api/server-error',
  },
  VALIDATION: {
    INVALID_INPUT: 'validation/invalid-input',
    REQUIRED_FIELD: 'validation/required-field',
  },
} as const;

const ErrorMessages: Record<string, string> = {
  [ErrorCodes.AUTH.INVALID_CREDENTIALS]: 'Credenciales inválidas. Por favor verifica tu email y contraseña.',
  [ErrorCodes.AUTH.USER_NOT_FOUND]: 'Usuario no encontrado.',
  [ErrorCodes.AUTH.EMAIL_NOT_CONFIRMED]: 'Por favor confirma tu email antes de iniciar sesión.',
  [ErrorCodes.AUTH.SESSION_EXPIRED]: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  [ErrorCodes.API.NETWORK_ERROR]: 'Error de conexión. Por favor verifica tu conexión a internet.',
  [ErrorCodes.API.TIMEOUT]: 'La solicitud ha expirado. Por favor intenta nuevamente.',
  [ErrorCodes.API.SERVER_ERROR]: 'Ocurrió un error en el servidor. Por favor intenta más tarde.',
  [ErrorCodes.VALIDATION.INVALID_INPUT]: 'Los datos ingresados no son válidos.',
  [ErrorCodes.VALIDATION.REQUIRED_FIELD]: 'Este campo es requerido.',
};

export const sanitizeError = (error: unknown): AppError => {
  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: ErrorCodes.API.SERVER_ERROR,
      message: error,
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Map common error messages to our error codes
    if (message.includes('invalid login credentials')) {
      return {
        code: ErrorCodes.AUTH.INVALID_CREDENTIALS,
        message: ErrorMessages[ErrorCodes.AUTH.INVALID_CREDENTIALS],
      };
    }
    
    if (message.includes('email not confirmed')) {
      return {
        code: ErrorCodes.AUTH.EMAIL_NOT_CONFIRMED,
        message: ErrorMessages[ErrorCodes.AUTH.EMAIL_NOT_CONFIRMED],
      };
    }

    // Handle Supabase specific errors
    if (message.includes('supabase') || message.includes('sql')) {
      return {
        code: ErrorCodes.API.SERVER_ERROR,
        message: ErrorMessages[ErrorCodes.API.SERVER_ERROR],
      };
    }

    return {
      code: ErrorCodes.API.SERVER_ERROR,
      message: error.message,
    };
  }

  // Handle unknown error types
  return {
    code: ErrorCodes.API.SERVER_ERROR,
    message: ErrorMessages[ErrorCodes.API.SERVER_ERROR],
  };
};

export const handleError = (error: unknown, context?: string): void => {
  const sanitizedError = sanitizeError(error);
  
  // Log error with context if provided
  console.error(`[${context || 'App'}] Error:`, {
    code: sanitizedError.code,
    message: sanitizedError.message,
    details: sanitizedError.details,
  });

  // Show toast notification
  toast({
    title: 'Error',
    description: sanitizedError.message,
    variant: 'destructive',
  });
};

export const isAppError = (error: unknown): error is AppError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
};
