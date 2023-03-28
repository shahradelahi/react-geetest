import { GeeTestValidateResult } from "./types";
import crypto from "crypto-js";

const VALIDATE_URL = "https://gcaptcha4.geetest.com/validate";

export type GeeTestValidateParams = GeeTestValidateResult & {
  sign_token: string;
};

export async function validateCaptcha({
  captcha_id,
  ...post
}: GeeTestValidateParams): Promise<boolean> {
  const res = await fetch(`${VALIDATE_URL}?captcha_id=${captcha_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(post).toString(),
  });
  // When the request geetest service interface is abnormal, it shall be released to avoid blocking normal business.
  if (res.status !== 200) {
    return true;
  }
  const response = await res.json();
  return response.status === "success";
}

export function generateSignToken(
  lotNumber: string,
  captchaKey: string
): string {
  return crypto.HmacSHA256(lotNumber, captchaKey).toString();
}
