import React from "react";

export function useGeeTest(
  captchaId: string,
  options: Omit<InitConfig, "captchaId">
): {
  captcha?: GeeTest;
  state: GeeTestState;
} {
  const [captchaObj, setCaptchaObj] = React.useState<GeeTest>();
  const [currentState, setCurrentSate] =
    React.useState<GeeTestState>("loading");
  const [scriptLoaded, setScriptLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || scriptLoaded) {
      return;
    }
    const script = document.createElement("script");
    script.src = "https://static.geetest.com/v4/gt4.js";
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || !scriptLoaded) {
      return;
    }

    window.initGeetest4({ captchaId: captchaId, ...options }, (captchaObj) => {
      setCaptchaObj(captchaObj);
    });

    return () => {
      if (captchaObj) {
        captchaObj.destroy();
      }
    };
  }, [scriptLoaded, captchaId]);

  React.useEffect(() => {
    if (captchaObj) {
      captchaObj.onReady(() => {
        setCurrentSate("ready");
      });

      captchaObj.onSuccess(() => {
        setCurrentSate("success");
      });

      captchaObj.onError(() => {
        setCurrentSate("error");
      });

      captchaObj.onClose(() => {
        setCurrentSate("closed");
      });
    }
  }, [captchaObj]);

  return {
    captcha: captchaObj,
    state: currentState,
  };
}

const GeeTest = React.forwardRef<GeeTestRef, GeeTestProps>(function (
  props,
  ref
): JSX.Element {
  const uniqueId = React.useId();
  const { containerId, product, ...rest } = props;
  const {
    onError,
    onReady,
    onNextReady,
    onSuccess,
    onClose,
    onFail,
    ...config
  } = rest;

  const { captcha, state } = useGeeTest(props.captchaId, {
    product: (product as any) || "popup",
    ...config,
  });

  React.useImperativeHandle(ref, () => ({
    reset: () => captcha?.reset(),
    destroy: () => captcha?.destroy(),
  }));

  React.useEffect(() => {
    if (state === "ready") {
      captcha?.appendTo(`#${props.containerId || `captcha-${uniqueId}`}`);
    }
  }, [state]);

  React.useEffect(() => {
    if (captcha) {
      onReady && captcha.onReady(onReady);
      onNextReady && captcha.onNextReady(onNextReady);
      onSuccess && captcha.onSuccess(onSuccess);
      onClose && captcha.onClose(onClose);
      onFail && captcha.onFail(onFail);
      onError && captcha.onError(onError);
    }
  }, [captcha]);

  return <div id={containerId || `captcha-${uniqueId}`} />;
});

export default GeeTest;

export type InitConfig = {
  captchaId: string;
  product?: "float" | "popup" | "bind";
  nativeButton?: string;
  rem?: number;
  language?:
    | "zho"
    | "eng"
    | "zho-tw"
    | "zho-hk"
    | "udm"
    | "jpn"
    | "ind"
    | "kor"
    | "rus"
    | "ara"
    | "spa"
    | "pon"
    | "por"
    | "fra"
    | "deu";
  protocol?: "http://" | "https://" | "file://";
  timeout?: number;
  hideBar?: string[];
  mask?: {
    outside?: boolean;
    bgColor?: string;
  };
  apiServers?: string[];
  nextWidth?: string;
  riskType?: string;
  offlineCb?: () => void;
  onError?: (error: GeeTestError) => void;
  hideSuccess?: boolean;
  userInfo?: string;
};

export declare function initGeetest4(
  config: InitConfig,
  callback: (captchaObj: GeeTest) => void
): void;

export type GeeTest = GeeTestEvents & {
  appendTo: (element: HTMLElement | string) => void;
  getValidate: () => Promise<{
    geetest_challenge: string;
    geetest_validate: string;
    geetest_seccode: string;
  }>;
  reset: () => void;
  showCaptcha: () => void;
  destroy: () => void;
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
export type OnSuccessFn = () => void;
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

type GeeTestError = {
  code: string;
  msg: string;
  desc: {
    detail: string;
  };
};

export type GeeTestState = "loading" | "ready" | "success" | "closed" | "error";

export type GeeTestProps = Omit<InitConfig, "product" | "onError"> &
  Partial<GeeTestEventCallbacks> & {
    captchaId: string;
    product?: "popup" | "flat";
    containerId?: string;
  };

export type GeeTestRef = {
  reset: () => void;
  destroy: () => void;
};

declare global {
  interface Window {
    initGeetest4: typeof initGeetest4;
  }
}
