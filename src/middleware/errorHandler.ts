import { ApiError } from '@common/httpErrors';
import { Request, Response, type NextFunction } from 'express';
import { constants } from 'http2';

export function errorHandler(err: any, _: Request, res: Response, _next: NextFunction) {
 if (err instanceof ApiError) {
    let parsedMessage: any;

    // check if error message a object/array
    try {
      // if parsing not error, return it later
      parsedMessage = JSON.parse(err.message);
    } catch {
      // if false, keep it original error message
      parsedMessage = err.message; 
    }

    res.status(err.status).json({
      status: 'error',
      code: err.code,
      message: parsedMessage,
    });
    return;
 }

  console.error('Unexpected error:', err);
  res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  });
  return;
}
