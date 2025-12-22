import { initGeetest4 } from 'src/typings';

declare global {
  interface Window {
    initGeetest4: typeof initGeetest4;
  }
}
