import { fatcher } from 'fatcher';
import { delay, http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { aborter, isAbortError } from '../src';

const server = setupServer(
  http.get('https://foo.bar', async () => {
    await delay(1000);
    return new HttpResponse();
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Basic', () => {
  it('Basic Using', async () => {
    const response = await fatcher('https://foo.bar', {
      onAbort: () => console.log('aborted'),
      middlewares: [aborter],
    });
    expect(response.body).toBe(null);
  });

  it('User cancelable', async () => {
    const abortController = new AbortController();
    fatcher('https://foo.bar', {
      signal: abortController.signal,
      onAbort: () => {
        expect(true).toBe(true);
      },
      middlewares: [aborter],
    }).catch(async error => {
      expect(isAbortError(error)).toBe(true);
    });

    abortController.abort();
    await delay(1000);
  });
});
