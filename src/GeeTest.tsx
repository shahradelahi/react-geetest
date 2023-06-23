import React from 'react';
import { useGeeTest } from './hooks/useGeeTest';
import {
  GeeTestError,
  GeeTestEventCallbacks,
  GeeTestProduct,
  GeeTestRef,
  GeeTestValidateResult,
  InitConfig,
  OnErrorFn,
  OnFailFn,
  OnSuccessFn,
} from './interface';

export type GeeTestProps = GeeTestProduct &
  Omit<InitConfig, 'product' | 'onError'> &
  Partial<GeeTestEventCallbacks> & {
    captchaId: string;
    containerId?: string;
    container?: {
      width?: string;
      height?: string;
    };
    rootClassName?: string;
  };

const GeeTest = React.forwardRef<GeeTestRef, GeeTestProps>(function (props, ref): JSX.Element {
  const uniqueId = React.useId();
  const { container, containerId, rootClassName, product, ...rest } = props;
  const { onError, onReady, onNextReady, onSuccess, onClose, onFail, ...config } = rest;

  const { captcha, state } = useGeeTest(props.captchaId, {
    product: product as InitConfig['product'],
    ...config,
  });

  React.useImperativeHandle(ref, () => ({
    reset: () => captcha?.reset(),
    destroy: () => captcha?.destroy(),
    showCaptcha: () => captcha?.showCaptcha(),
    getValidate: () => captcha?.getValidate(),
  }));

  React.useEffect(() => {
    if (state === 'ready' && product !== 'bind') {
      captcha?.appendTo(`#${props.containerId || `captcha-${uniqueId}`}`);
    }
  }, [state]);

  React.useEffect(() => {
    if (captcha) {
      captcha.onReady(() => handleOnEvent('onReady'));
      captcha.onNextReady(() => handleOnEvent('onNextReady'));
      captcha.onSuccess(() => handleOnEvent('onSuccess'));
      captcha.onClose(() => handleOnEvent('onClose'));
      captcha.onFail((e) => handleOnEvent('onFail', e));
      captcha.onError((e) => handleOnEvent('onError', e));
    }
  }, [captcha]);

  const handleOnEvent = (event: string, arg?: GeeTestError | GeeTestValidateResult) => {
    const callback = props[event as keyof GeeTestEventCallbacks];
    if (!callback) {
      // callback is not registered
      return;
    }
    if (event === 'onSuccess') {
      (callback as OnSuccessFn)(captcha?.getValidate());
      return;
    }
    if (event === 'onError' || event === 'onFail') {
      (callback as OnErrorFn | OnFailFn)(arg as GeeTestError);
      return;
    }
    (callback as () => void)();
  };

  return (
    <div
      id={containerId || `captcha-${uniqueId}`}
      style={{
        width: container?.width || '100%',
        height: container?.height || 'auto',
      }}
      {...(rootClassName && { rootClassName })}
      {...(product === 'bind' && {
        onClick: () => captcha?.showCaptcha(),
        children: props.children,
      })}
    />
  );
});

export default GeeTest;
