export function isTimeoutError(value: unknown): value is DOMException {
  return value instanceof DOMException && value.name === 'TimeoutError';
}
