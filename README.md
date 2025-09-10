# @fatcherjs/middleware-aborter

<div align="center">
  <a href="https://codecov.io/github/fatcherjs/middleware-aborter" > 
    <img src="https://codecov.io/github/fatcherjs/middleware-aborter/graph/badge.svg?token=BEJA311FY2"/> 
 </a>
  <a href="https://www.jsdelivr.com/package/npm/@fatcherjs/middleware-aboter">
    <img src="https://data.jsdelivr.com/v1/package/npm/@fatcherjs/middleware-aboter/badge?style=rounded" alt="jsDelivr">
  </a>
  <a href="https://packagephobia.com/result?p=@fatcherjs/middleware-aboter">
    <img src="https://packagephobia.com/badge?p=@fatcherjs/middleware-aboter" alt="install size">
  </a>
  <a href="https://unpkg.com/@fatcherjs/middleware-aboter">
    <img src="https://img.badgesize.io/https://unpkg.com/@fatcherjs/middleware-aboter" alt="Size">
  </a>
  <a href="https://npmjs.com/package/@fatcherjs/middleware-aboter">
    <img src="https://img.shields.io/npm/v/@fatcherjs/middleware-aboter.svg" alt="npm package">
  </a>
  <a href="https://github.com/fatcherjs/middleware-aboter/actions/workflows/ci.yml">
    <img src="https://github.com/fatcherjs/middleware-aboter/actions/workflows/ci.yml/badge.svg?branch=master" alt="build status">
  </a>
</div>

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
    middlewares: [FatcherMiddlewareAborter.aborter, FatcherMiddlewareAborter.timeout],
    onAbort: () => {},
    onTimeout: () => {},
    timeout: 30000,
  })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      if (FatcherMiddlewareAborter.isAbortError(error)) {
        // do somethings
        return;
      }

      // do other thing
    });
</script>
```

## Usage

### Aborter

#### Types

```ts
declare module 'fatcher' {
  interface FatcherOptions {
    onAbort?: (reason?: string) => void;
  }

  interface FatcherContext {
    abort: (reason?: string) => void;
  }

  interface FatcherResponse {
    abort: (reason?: string) => void;
  }
}
```

#### Basic

```ts
import { fatcher } from 'fatcher';
import { aborter } from '@fatcherjs/middleware-aborter';

const response = await fatcher('xxx', {
  onAbort: () => {
    console.log('Aborted!');
  },
  middlewares: [aborter],
});

response.abort(); // stop reading body
```

#### Custom Signal

```ts
import { fatcher } from 'fatcher';
import { aborter } from '@fatcherjs/middleware-aborter';

const aborterController = new AbortController();

const response = await fatcher('xxx', {
  signal: aborterController.signal,
  onAbort: () => {
    console.log('Aborted!');
  },
  middlewares: [aborter],
});

aborterController.abort();
```

#### Abort In Middleware

```ts
import { fatcher } from 'fatcher';
import { aborter } from '@fatcherjs/middleware-aborter';

const response = await fatcher('xxx', {
  onAbort: () => {
    console.log('Aborted!');
  },
  middlewares: [
    aborter,
    (context, next) => {
      context.abort();
      return next();
    },
  ],
});

console.log(response);
```

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

### isAbortError

```ts
import { fatcher } from 'fatcher';
import { aborter, isAbortError, timeout } from '@fatcherjs/middleware-aborter';

const abortController = new AbortController();

fatcher('https://foo.bar', {
  onAbort: () => console.log('aborted'),
  signal: abortController.signal,
  timeout: 30 * 1000,
  middlewares: [aborter, timeout],
}).catch(error => {
  if (isAbortError(error)) {
    // do something..
    return;
  }
  // other error
});

abortController.abort();
```

## License

[MIT](https://github.com/fatcherjs/middleware-aborter/blob/master/LICENSE)
