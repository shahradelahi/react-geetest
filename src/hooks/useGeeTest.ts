import React from 'react';
import { GeeTest, GeeTestState, InitConfig } from '../interface';
import { GT4_JS } from '../Constants';

type UseGeeTestOptions = Omit<InitConfig, 'captchaId'>;

type UseGeeTestReturns = {
  captcha?: GeeTest;
  state: GeeTestState;
};

export function useGeeTest(captchaId: string, options: UseGeeTestOptions): UseGeeTestReturns {
  const [captchaObj, setCaptchaObj] = React.useState<GeeTest>();
  const [currentState, setCurrentSate] = React.useState<GeeTestState>('loading');
  const [scriptLoaded, setScriptLoaded] = React.useState<boolean>(false);
  const { script: staticScript, force = false, ...opts } = options;

  React.useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) {
      return;
    }

    if (force) {
      // downloads gt4 script and modifies the content
      fetch(GT4_JS)
        .then((res) => res.text())
        .then((text) => {
          const script = document.createElement('script');
          script.innerHTML = forceChange(opts, text);
          script.onload = () => {
            setScriptLoaded(true);
          };
        })
        .catch((err) => {
          console.error('Error when downloading gt4 script', err);
        });
    }

    // if force is false, it will use the origin
    else {
      const script = document.createElement('script');
      script.src = staticScript || GT4_JS;
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && !scriptLoaded) {
      const defaultOptions: Partial<InitConfig> = {
        protocol: 'https://',
      };

      window.initGeetest4({ captchaId: captchaId, ...defaultOptions, ...opts }, (captchaObj) => {
        setCaptchaObj(captchaObj);
      });
    }

    return () => {
      if (captchaObj) {
        captchaObj.destroy();
      }
    };
  }, [scriptLoaded, captchaId]);

  React.useEffect(() => {
    if (captchaObj) {
      captchaObj.onReady(() => {
        setCurrentSate('ready');
      });

      captchaObj.onSuccess(() => {
        setCurrentSate('success');
      });

      captchaObj.onError(() => {
        setCurrentSate('error');
      });

      captchaObj.onClose(() => {
        setCurrentSate('closed');
      });
    }
  }, [captchaObj]);

  return {
    captcha: captchaObj,
    state: currentState,
  };
}

function forceChange(config: UseGeeTestOptions, scriptTxt: string): string {
  let modifiedScript = scriptTxt;

  const newConfigReg = new RegExp(/var newConfig = camelizeKeys\(newConfig\);/);
  const newConfigStr = 'var newConfig = camelizeKeys(newConfig);';

  if (config.language) {
    modifiedScript.replace(
      newConfigReg,
      newConfigStr + `newConfig.language = '${config.language}';`,
    );
  }

  return modifiedScript;
}
