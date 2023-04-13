import crypto from 'crypto-js';
import { VALIDATE_URL } from './Constants';
import { GeeTestValidateResult } from './interface';

export type GeeTestValidateParams = GeeTestValidateResult & {
  sign_token: string;
};

export async function validateCaptcha(params: GeeTestValidateParams): Promise<boolean> {
  const { captcha_id, ...postPrams } = params;

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
  if (res.status !== 200) {
    return true;
  }
  const response = await res.json();
  return response.status === 'success';
}

export function generateSignToken(lotNumber: string, captchaKey: string): string {
  return crypto.HmacSHA256(lotNumber, captchaKey).toString();
}
