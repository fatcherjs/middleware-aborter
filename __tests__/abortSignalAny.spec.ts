import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { abortSignalAny } from '../src/abortSignalAny';

describe('abortSignalAny - Origin', () => {
  it('should abort when one of the signals is aborted', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    let aborted = false;
    combinedSignal.addEventListener('abort', () => {
      aborted = true;
    });

    controller1.abort();

    expect(aborted).toBe(true);
    expect(combinedSignal.aborted).toBe(true);
  });

  it('should not abort if none of the signals are aborted', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    expect(combinedSignal.aborted).toBe(false);
  });

  it('should abort immediately if one signal is already aborted', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    controller2.abort();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    expect(combinedSignal.aborted).toBe(true);
  });

  it('should cleanup and abort combined signal', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    let aborted = false;
    combinedSignal.addEventListener('abort', () => {
      aborted = true;
    });

    controller1.abort();

    expect(aborted).toBe(true);
    expect(combinedSignal.aborted).toBe(true);
  });
});

describe('abortSignalAny - Polyfill', () => {
  let originalAbortSignalAny: typeof AbortSignal.any | undefined;

  beforeEach(() => {
    originalAbortSignalAny = (AbortSignal as any).any;
    delete (AbortSignal as any).any;
  });

  afterEach(() => {
    (AbortSignal as any).any = originalAbortSignalAny;
  });

  it('should abort when one of the signals is aborted', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    let aborted = false;
    combinedSignal.addEventListener('abort', () => {
      aborted = true;
    });

    controller1.abort();

    expect(aborted).toBe(true);
    expect(combinedSignal.aborted).toBe(true);
  });

  it('should not abort if none of the signals are aborted', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    expect(combinedSignal.aborted).toBe(false);
  });

  it('should abort immediately if one signal is already aborted', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    controller2.abort();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    expect(combinedSignal.aborted).toBe(true);
  });

  it('should cleanup and abort combined signal', () => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();

    const combinedSignal = abortSignalAny([controller1.signal, controller2.signal]);

    let aborted = false;
    combinedSignal.addEventListener('abort', () => {
      aborted = true;
    });

    controller1.abort();

    expect(aborted).toBe(true);
    expect(combinedSignal.aborted).toBe(true);
  });
});
