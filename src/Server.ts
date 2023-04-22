import crypto from 'crypto-js';
import { VALIDATE_URL } from './Constants';
import { GeeTestValidateResult } from './interface';

export type GeeTestValidateParams = GeeTestValidateResult & {
  sign_token: string;
  skip_server_fail?: boolean;
};

export type GeeTestValidateResponse = {
  status: 'success' | 'fail';
  validate: boolean;
};

export async function validateCaptcha(
  params: GeeTestValidateParams,
): Promise<GeeTestValidateResponse> {
  const { captcha_id, skip_server_fail, ...postPrams } = params;

  const url = new URL(VALIDATE_URL);
  url.searchParams.set('captcha_id', captcha_id);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(postPrams).toString(),
  });

  // When the request geetest service interface is abnormal, it shall be released to avoid blocking normal business.
  if (!res.status.toString().startsWith('2')) {
    return {
      status: 'fail',
      validate: skip_server_fail || false,
    };
  }

  const response = await res.json();

  return {
    status: 'success',
    validate: response.status === 'success',
  };
}

export function generateSignToken(lotNumber: string, captchaKey: string): string {
  return crypto.HmacSHA256(lotNumber, captchaKey).toString();
}
