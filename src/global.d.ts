import { initGeetest4 } from './typings';

declare global {
  interface Window {
    initGeetest4: typeof initGeetest4;
  }
}
