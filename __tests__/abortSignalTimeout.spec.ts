import { delay } from 'msw';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { abortSignalTimeout } from '../src/abortSignalTimeout';
import { isTimeoutError } from '../src/isTimeoutError';

describe('abortSignalTimeout', () => {
  describe('native AbortSignal.timeout exists', () => {
    let originalTimeout: typeof AbortSignal.timeout | undefined;

    beforeEach(() => {
      originalTimeout = (AbortSignal as any).timeout;
    });

    afterEach(() => {
      (AbortSignal as any).timeout = originalTimeout;
    });

    it('should delegate to native AbortSignal.timeout', () => {
      const mockSignal = new AbortController().signal;

      const spy = vi.spyOn(AbortSignal as any, 'timeout').mockReturnValue(mockSignal);

      const result = abortSignalTimeout(1000);

      expect(spy).toHaveBeenCalledWith(1000);
      expect(result).toBe(mockSignal);

      spy.mockRestore();
    });
  });

  describe('fallback implementation (AbortSignal.timeout not exists)', () => {
    let originalTimeout: typeof AbortSignal.timeout | undefined;

    beforeEach(() => {
      originalTimeout = (AbortSignal as any).timeout;
      delete (AbortSignal as any).timeout;

      vi.useFakeTimers();
    });

    afterEach(() => {
      (AbortSignal as any).timeout = originalTimeout;
      vi.useRealTimers();
    });

    it('should abort after timeout', () => {
      const signal = abortSignalTimeout(1000);

      let aborted = false;
      signal.addEventListener('abort', () => {
        aborted = true;
      });

      expect(signal.aborted).toBe(false);

      vi.advanceTimersByTime(1000);

      expect(aborted).toBe(true);
      expect(signal.aborted).toBe(true);
      expect(signal.reason).toBeInstanceOf(DOMException);
      expect(signal.reason.name).toBe('TimeoutError');
    });

    it('should clear timer if aborted manually', () => {
      const signal = abortSignalTimeout(1000);

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      (signal as AbortSignal & { controller?: AbortController }).dispatchEvent(new Event('abort'));

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });
});

describe('abortSignalTimeout + isTimeoutError (native)', () => {
  it('native timeout produces a TimeoutError recognizable by isTimeoutError', async () => {
    const signal = abortSignalTimeout(300);
    await delay(300);
    expect(signal.aborted).toBe(true);
    expect(isTimeoutError(signal.reason)).toBe(true);
  });
});

describe('abortSignalTimeout + isTimeoutError integration', () => {
  let originalTimeout: typeof AbortSignal.timeout | undefined;

  beforeEach(() => {
    originalTimeout = (AbortSignal as any).timeout;
    delete (AbortSignal as any).timeout;
    vi.useFakeTimers();
  });

  afterEach(() => {
    (AbortSignal as any).timeout = originalTimeout;
    vi.useRealTimers();
  });

  it('produces a TimeoutError reason recognizable by isTimeoutError', () => {
    const signal = abortSignalTimeout(500);

    vi.advanceTimersByTime(500);

    expect(signal.aborted).toBe(true);
    expect(isTimeoutError(signal.reason)).toBe(true);
  });
});
