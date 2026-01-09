// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'fatcher';

declare module 'fatcher' {
  interface FatcherOptions {
    timeout?: number;
    onTimeout?: () => void;
  }
}

export {};
