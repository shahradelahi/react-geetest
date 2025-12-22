import { Hono } from 'hono';
import { generateSignToken, validateCaptcha } from 'react-geetest-v4';

const app = new Hono();

app.post('/api/validate', async (c) => {
  const body = await c.req.json();
  const { captcha_output, gen_time, lot_number, pass_token } = body;

  if (!captcha_output || !gen_time || !lot_number || !pass_token) {
    return c.json({ error: 'Missing required parameters' }, 400);
  }
  console.log(import.meta.env.VITE_GEETEST_CAPTCHA_ID, import.meta.env.VITE_GEETEST_CAPTCHA_KEY);

  try {
    const result = await validateCaptcha({
      captcha_id: import.meta.env.VITE_GEETEST_CAPTCHA_ID,
      lot_number,
      captcha_output,
      pass_token,
      gen_time,
      sign_token: generateSignToken(lot_number, import.meta.env.VITE_GEETEST_CAPTCHA_KEY),
    });

    return c.json(result);
  } catch (err) {
    console.error(err);
    return c.json({ error: (err as Error).message }, 500);
  }
});

export default app;
