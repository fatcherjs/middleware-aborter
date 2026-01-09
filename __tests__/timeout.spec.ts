import { fatcher } from 'fatcher';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { isTimeoutError, timeout } from '../src';

const server = setupServer(
  http.get('https://foo.bar', async () => {
    await delay(1000);
    return new HttpResponse();
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Timeout', () => {
  it('Basic using', async () => {
    const response = await fatcher('https://foo.bar', {
      timeout: 1500,
      middlewares: [timeout],
    });
    expect(response.body).toBe(null);
  });

  it('Abort on timeout', async () => {
    try {
      await fatcher('https://foo.bar', { timeout: 500, middlewares: [timeout] });
    } catch (error) {
      expect(isTimeoutError(error)).toBe(true);
    }
  });

  it('Abort on timeout callback', async () => {
    let called = false;

    try {
      await fatcher('https://foo.bar', {
        timeout: 500,
        middlewares: [timeout],
        onTimeout: () => {
          called = true;
        },
      });
    } catch (error) {
      expect(isTimeoutError(error)).toBe(true);
    }

    expect(called).toBe(true);
  });

  it('Will not trigger timeout when aborted', async () => {
    const abortController = new AbortController();

    let called = false;

    try {
      const promise = fatcher('https://foo.bar', {
        timeout: 1000,
        middlewares: [timeout],
        onTimeout: () => {
          called = true;
        },
        signal: abortController.signal,
      });

      abortController.abort();

      await promise;
    } catch (error) {
      expect(isTimeoutError(error)).toBe(false);
      expect(error instanceof DOMException && error.name === 'AbortError');
    }

    expect(called).toBe(false);
  });
});
