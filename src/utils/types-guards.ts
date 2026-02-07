import { TErrorResponse } from './types';

/** TYPE GUARD ДЛЯ ОТВЕТА СЕРВЕРА С ОШИБКОЙ */
export function isErrorResponse(error: unknown): error is TErrorResponse {
  return (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}
