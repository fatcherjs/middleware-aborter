import { fatcher } from 'fatcher';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { isAbortError, timeout } from '../src';

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
      console.log(error);
      expect(isAbortError(error)).toBe(true);
    }
  });
});
