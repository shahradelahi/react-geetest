import React from 'react';

import { GT4_JS } from './constants';
import type { GeeTest, GeeTestOverrideParams, GeeTestState, InitConfig } from './typings';

export type UseGeeTestOptions = Omit<InitConfig, 'captchaId'>;

type UseGeeTestReturns = {
  captcha?: GeeTest;
  state: GeeTestState;
};

export function useGeeTest(captchaId: string, options: UseGeeTestOptions): UseGeeTestReturns {
  const [captchaObj, setCaptchaObj] = React.useState<GeeTest>();
  const [currentState, setCurrentState] = React.useState<GeeTestState>('loading');
  const [scriptLoaded, setScriptLoaded] = React.useState<boolean>(false);
  const { script: staticScript, overrideWithForce, ...opts } = options;

  React.useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) {
      return;
    }

    const scriptId = 'geetest-v4-script';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      if (typeof window.initGeetest4 !== 'undefined') {
        setScriptLoaded(true);
      } else {
        existingScript.addEventListener('load', () => setScriptLoaded(true));
      }
      return;
    }

    if (overrideWithForce) {
      // downloads gt4 script and modifies the content
      fetch(GT4_JS)
        .then((res) => res.text())
        .then((text) => {
          const script = document.createElement('script');
          script.id = scriptId;
          script.innerHTML = forceChange({ ...opts, overrideWithForce }, text);
          script.type = 'text/javascript';
          document.head.appendChild(script);
          setScriptLoaded(true);
        })
        .catch((err) => {
          console.error('Error when downloading gt4 script', err);
        });
    }

    // if force is false, it will use the origin
    else {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = staticScript || GT4_JS;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        setScriptLoaded(true);
      };
      script.onerror = (err) => {
        console.error('Error when loading gt4 script', err);
      };
      document.head.appendChild(script);
    }
  }, []);

  const optionsString = JSON.stringify(opts);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && scriptLoaded) {
      const defaultOptions: Partial<InitConfig> = {
        protocol: 'https://',
      };

      window.initGeetest4!(
        { captchaId: captchaId, ...defaultOptions, ...opts },
        (captchaObj: GeeTest) => {
          setCaptchaObj(captchaObj);
        }
      );
    }
  }, [scriptLoaded, captchaId, optionsString]);

  React.useEffect(() => {
    return () => {
      if (captchaObj) {
        captchaObj.destroy();
      }
    };
  }, [captchaObj]);

  React.useEffect(() => {
    if (captchaObj) {
      captchaObj.onReady(() => {
        setCurrentState('ready');
      });

      captchaObj.onSuccess(() => {
        setCurrentState('success');
      });

      captchaObj.onError(() => {
        setCurrentState('error');
      });

      captchaObj.onClose(() => {
        setCurrentState('closed');
      });
    }
  }, [captchaObj]);

  return {
    captcha: captchaObj,
    state: currentState,
  };
}

type ForceChangeConfig = Omit<UseGeeTestOptions, 'overrideWithForce'> & {
  overrideWithForce: GeeTestOverrideParams;
};

function forceChange(config: ForceChangeConfig, scriptTxt: string): string {
  let modifiedScript = scriptTxt;

  const newConfigStr = 'var newConfig = camelizeKeys(newConfig);';

  if (config.overrideWithForce) {
    Object.keys(config.overrideWithForce).forEach((key: any) => {
      const val = config.overrideWithForce[key];
      const data = typeof val === 'string' ? `'${val}'` : `${val}`;
      modifiedScript = modifiedScript.replaceAll(
        newConfigStr,
        newConfigStr + `newConfig.${key} = ${data};`
      );
    });
  }

  return modifiedScript;
}
