import React from 'react';

export type GeeTestState = 'loading' | 'ready' | 'success' | 'closed' | 'error';

export type GeeTestBind = {
  product: 'bind';
  children: React.ReactNode;
};

export type GeeTestPopup = {
  product: 'popup';
};

export type GeeTestFlat = {
  product: 'flat';
};

export type GeeTestProduct = GeeTestBind | GeeTestPopup | GeeTestFlat;

export type GeeTestRef = {
  reset: () => void;
  destroy: () => void;
  showCaptcha: () => void;
  getValidate: () => GeeTestValidateResult | undefined;
};

export type InitConfig = {
  captchaId: string;
  product: 'float' | 'popup' | 'bind';
  nativeButton?: {
    width?: string;
    height?: string;
  };
  rem?: number;
  language?:
    | string
    | 'zho'
    | 'eng'
    | 'zho-tw'
    | 'zho-hk'
    | 'udm'
    | 'jpn'
    | 'ind'
    | 'kor'
    | 'rus'
    | 'ara'
    | 'spa'
    | 'pon'
    | 'por'
    | 'fra'
    | 'deu';
  protocol?: 'http://' | 'https://' | 'file://';
  script?: string;
  timeout?: number;
  hideBar?: string[];
  mask?: {
    outside?: boolean;
    bgColor?: string;
  };
  force?: boolean;
  apiServers?: string[];
  nextWidth?: string;
  riskType?: string;
  offlineCb?: () => void;
  onError?: (error: GeeTestError) => void;
  hideSuccess?: boolean;
  userInfo?: string;
};

export function initGeetest4(config: InitConfig, callback: (captchaObj: GeeTest) => void): void {
  if (typeof window === 'undefined') {
    throw new Error('initGeetest4 can only be called in browser');
  }
  return window.initGeetest4(config, callback);
}

export type GeeTest = GeeTestEvents & {
  appendTo: (element: HTMLElement | string) => void;
  getValidate: () => GeeTestValidateResult;
  reset: () => void;
  showCaptcha: () => void;
  destroy: () => void;
};

export type GeeTestValidateResult = {
  captcha_id: string;
  captcha_output: string;
  gen_time: string;
  lot_number: string;
  pass_token: string;
};

type GeeTestEvents = {
  onReady: (callback: OnReadyFn) => void;
  onNextReady: (callback: OnNextReadyFn) => void;
  onSuccess: (callback: OnSuccessFn) => void;
  onFail: (callback: OnFailFn) => void;
  onError: (callback: OnErrorFn) => void;
  onClose: (callback: OnCloseFn) => void;
};

export type OnReadyFn = () => void;
export type OnNextReadyFn = () => void;
export type OnSuccessFn = (result: GeeTestValidateResult) => void;
export type OnFailFn = (error: GeeTestError) => void;
export type OnErrorFn = (error: GeeTestError) => void;
export type OnCloseFn = () => void;

export type GeeTestEventCallbacks = {
  onReady: OnReadyFn;
  onNextReady: OnNextReadyFn;
  onSuccess: OnSuccessFn;
  onFail: OnFailFn;
  onError: OnErrorFn;
  onClose: OnCloseFn;
};

export type GeeTestEvent = keyof GeeTestEvents;

export type GeeTestError = {
  code: string;
  msg: string;
  desc: {
    detail: string;
  };
};

declare global {
  interface Window {
    initGeetest4: typeof initGeetest4;
  }
}
