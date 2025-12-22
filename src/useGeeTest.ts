import React from 'react';
import { GT4_JS } from 'src/Constants';
import { GeeTest, GeeTestOverrideParams, GeeTestState, InitConfig } from 'src/typings';

export type UseGeeTestOptions = Omit<InitConfig, 'captchaId'>;

type UseGeeTestReturns = {
  captcha?: GeeTest;
  state: GeeTestState;
};

export function useGeeTest(captchaId: string, options: UseGeeTestOptions): UseGeeTestReturns {
  const [captchaObj, setCaptchaObj] = React.useState<GeeTest>();
  const [currentState, setCurrentSate] = React.useState<GeeTestState>('loading');
  const [scriptLoaded, setScriptLoaded] = React.useState<boolean>(false);
  const { script: staticScript, overrideWithForce, ...opts } = options;

  React.useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) {
      return;
    }

    if (overrideWithForce) {
      // downloads gt4 script and modifies the content
      fetch(GT4_JS)
        .then((res) => res.text())
        .then((text) => {
          const script = document.createElement('script');
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
      script.src = staticScript || GT4_JS;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && scriptLoaded) {
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

type ForceChangeConfig = Omit<UseGeeTestOptions, 'overrideWithForce'> & {
  overrideWithForce: GeeTestOverrideParams;
};

function forceChange(config: ForceChangeConfig, scriptTxt: string): string {
  let modifiedScript = scriptTxt;

  const newConfigStr = 'var newConfig = camelizeKeys(newConfig);';

  if (config.overrideWithForce) {
    Object.keys(config.overrideWithForce).forEach((key: any) => {
      const rowData: string | number | boolean = config.overrideWithForce[key];
      const data = typeof rowData === 'string' ? `'${rowData}'` : rowData;
      modifiedScript = modifiedScript.replaceAll(
        newConfigStr,
        newConfigStr + `newConfig.${key} = ${data};`
      );
    });
  }

  return modifiedScript;
}
