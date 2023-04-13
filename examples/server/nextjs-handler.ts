import type { NextApiRequest, NextApiResponse } from 'next';
import { validateCaptcha, generateSignToken } from 'react-geetest-v4';

// geetest public key
const CAPTCHA_ID = '647f5ed2ed8acb4be36784e01556bb71';

// geetest secret key
const CAPTCHA_KEY = 'b09a7aafbfd83f73b35a9b530d0337bf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { captcha_output, gen_time, lot_number, pass_token } = req.body;
  if (!captcha_output || !gen_time || !lot_number || !pass_token) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  const validate = await validateCaptcha({
    captcha_id: CAPTCHA_ID,
    lot_number,
    captcha_output,
    pass_token,
    gen_time,
    sign_token: generateSignToken(lot_number, CAPTCHA_KEY),
  });
  return res.status(200).json({ ok: validate });
}
