// Initialize error codes
export const ErrorCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
export type ErrorCode = keyof typeof ErrorCodes;

export class ApiError extends Error {
  code: ErrorCode;
  status: number;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
    this.status = ErrorCodes[code];
  }
}
