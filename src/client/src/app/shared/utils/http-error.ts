import { HttpErrorResponse } from '@angular/common/http';

export function httpErrorMessage(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Something went wrong.';

  if (err.status === 0) return 'Network error. Check your connection.';

  const body = err.error;
  const serverMsg = typeof body === 'string' && body.trim()
    ? body.trim()
    : typeof body?.message === 'string'
      ? body.message.trim()
      : null;

  switch (err.status) {
    case 400: return serverMsg ?? 'Invalid request. Check your input.';
    case 401: return 'Session expired. Please log in again.';
    case 403: return 'You don\'t have permission to do this.';
    case 404: return serverMsg ?? 'Not found.';
    case 409: return serverMsg ?? 'A conflict occurred.';
    case 422: return serverMsg ?? 'Invalid data. Check your input.';
    case 429: return 'Too many requests. Please slow down.';
    default:  return err.status >= 500
      ? 'Server error. Please try again later.'
      : 'Something went wrong.';
  }
}
