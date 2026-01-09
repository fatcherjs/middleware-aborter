# @fatcherjs/middleware-aborter

<div align="center">
  <a href="https://codecov.io/github/fatcherjs/middleware-aborter" > 
    <img src="https://codecov.io/github/fatcherjs/middleware-aborter/graph/badge.svg?token=BEJA311FY2"/> 
 </a>
  <a href="https://www.jsdelivr.com/package/npm/@fatcherjs/middleware-aborter">
    <img src="https://data.jsdelivr.com/v1/package/npm/@fatcherjs/middleware-aborter/badge?style=rounded" alt="jsDelivr">
  </a>
  <a href="https://packagephobia.com/result?p=@fatcherjs/middleware-aborter">
    <img src="https://packagephobia.com/badge?p=@fatcherjs/middleware-aborter" alt="install size">
  </a>
  <a href="https://unpkg.com/@fatcherjs/middleware-aborter">
    <img src="https://img.badgesize.io/https://unpkg.com/@fatcherjs/middleware-aborter" alt="Size">
  </a>
  <a href="https://npmjs.com/package/@fatcherjs/middleware-aborter">
    <img src="https://img.shields.io/npm/v/@fatcherjs/middleware-aborter.svg" alt="npm package">
  </a>
  <a href="https://github.com/fatcherjs/middleware-aborter/actions/workflows/ci.yml">
    <img src="https://github.com/fatcherjs/middleware-aborter/actions/workflows/ci.yml/badge.svg?branch=master" alt="build status">
  </a>
</div>

## Tips

If you want to abort request manually, you should use `AbortController` and pass the signal to `fatcher`

```ts
import { fatcher } from 'fatcher';

const abortController = new AbortController();

fatcher('your-url', {
  signal: abortController.signal,
}).catch(error => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    // aborted.
    return;
  }

  // other
});

abortController.abort();
```

## Install

### NPM

```bash
>$ npm install @fatcherjs/middleware-aborter
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/fatcher/dist/fatcher.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@fatcherjs/middleware-aborter/dist/index.min.js"></script>

<script>
  Fatcher.fatcher('xxx', {
    middlewares: [FatcherMiddlewareAborter.timeout],
    onTimeout: () => {},
    timeout: 30000,
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      if (FatcherMiddlewareAborter.isTimeoutError(error)) {
        // do somethings
        return;
      }

      // do other thing
    });
</script>
```

## Usage

### Timeout

#### Types

```ts
declare module 'fatcher' {
  interface FatcherOptions {
    timeout?: number; // default 60 * 1000 (60s)
    onTimeout?: () => void;
  }
}
```

#### Basic

```ts
import { fatcher } from 'fatcher';
import { timeout } from '@fatcherjs/middleware-aborter';

const response = await fatcher('xxx', {
  middlewares: [timeout],
  timeout: 30 * 1000,
  onTimeout: () => {
    console.log('timeout!');
  },
});
```

### isTimeoutError

```ts
import { fatcher } from 'fatcher';
import { isTimeoutError, timeout } from '@fatcherjs/middleware-aborter';

fatcher('https://foo.bar', {
  timeout: 30 * 1000,
  middlewares: [timeout],
}).catch(error => {
  if (isTimeoutError(error)) {
    // do something..
    return;
  }
  // other error
});
```

## License

[MIT](https://github.com/fatcherjs/middleware-aborter/blob/master/LICENSE)
