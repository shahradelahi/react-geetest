/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEETEST_CAPTCHA_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
