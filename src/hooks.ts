import React from "react";
import { GeeTest, InitConfig } from "./types";
import { GeeTestState } from "./index";

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

    const defaultOptions: Partial<InitConfig> = {
      protocol: "https://",
    };

    window.initGeetest4(
      { captchaId: captchaId, ...defaultOptions, ...options },
      (captchaObj) => {
        setCaptchaObj(captchaObj);
      }
    );

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
