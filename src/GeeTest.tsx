import React from 'react';
import { useGeeTest } from './hooks/useGeeTest';
import { GeeTestEventCallbacks, GeeTestProduct, GeeTestRef, InitConfig } from './interface';

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
      onReady && captcha.onReady(onReady);
      onNextReady && captcha.onNextReady(onNextReady);
      onSuccess && captcha.onSuccess(() => onSuccess(captcha.getValidate()));
      onClose && captcha.onClose(onClose);
      onFail && captcha.onFail(onFail);
      onError && captcha.onError(onError);
    }
  }, [captcha]);

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
