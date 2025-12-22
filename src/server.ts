import crypto from 'crypto-js';
import { GeeTestValidateResult } from 'src/typings';

import { VALIDATE_URL } from './Constants';

export type GeeTestValidateParams = GeeTestValidateResult & {
  sign_token: string;
  validator_endpoint_url?: string;
};

export type GeeTestValidateResponse = { status: 'success' | 'error' } & {
  result: 'success' | 'fail';
  reason: string;
  captcha_args: {
    [key: string]: string;
    used_type: string;
    user_ip: string;
    lot_number: string;
    scene: string;
    referer: string;
  };
} & {
  code: string;
  msg: string;
  desc: object;
};

export async function validateCaptcha(
  params: GeeTestValidateParams
): Promise<GeeTestValidateResponse> {
  const { captcha_id, validator_endpoint_url, ...postPrams } = params;

  const url = new URL(validator_endpoint_url || VALIDATE_URL);
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
    throw new Error('server reposed with an error status code');
  }

  return await res.json();
}

export function generateSignToken(lotNumber: string, captchaKey: string): string {
  return crypto.HmacSHA256(lotNumber, captchaKey).toString();
}
