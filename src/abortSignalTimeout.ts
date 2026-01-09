export function abortSignalTimeout(timeout: number) {
  if (typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(timeout);
  }

  const abortController = new AbortController();

  const timer = setTimeout(() => {
    abortController.abort(new DOMException('The operation timed out.', 'TimeoutError'));
  }, timeout);

  abortController.signal.addEventListener('abort', () => clearTimeout(timer));

  return abortController.signal;
}
