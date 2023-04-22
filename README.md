# GeeTest integration for React

A very simple React component to integrate [GeeTest captcha](https://docs.geetest.com/BehaviorVerification/overview/start/).

## Installation

```bash
npm install react-geetest-v4
```

## Usage

#### Normal practice

```tsx
import React from 'react';
import GeeTest, { GeeTestRef } from 'react-geetest-v4';

export default function Home(): JSX.Element {
  const captchaRef = React.useRef<GeeTestRef | null>(null); // Access: showCaptcha, reset, ...
  return (
    <div>
      <GeeTest
        captchaId={'your captcha id'}
        containerId={'geetest-captcha'} // Optional
        onSuccess={() => console.log('success')}
        onReady={() => console.log('ready')}
      />
      <br />
      <GeeTest
        ref={captchaRef}
        captchaId={'your captcha id'}
        product={'bind'}
        onSuccess={() => console.log('success')}
      >
        <button>Submit</button>
      </GeeTest>
    </div>
  );
}
```

#### Using hooks

```tsx
import React from 'react';
import { useGeeTest } from 'react-geetest-v4';

export default function Home(): JSX.Element {
  const { captcha, state } = useGeeTest('your captcha id', {
    product: 'bind',
    protocol: 'https://',
    containerId: 'geetest-captcha',
  });

  const onClick = () => {
    captcha?.showCaptcha();
  };

  return (
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
  );
}
```

#### Server validation

On this example we're using Next.JS handlers, but you can use any other framework.

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { validateCaptcha, generateSignToken } from 'react-geetest-v4';

const CAPTCHA_ID = '647f5ed2ed8acb4be36784e01556bb71';
const CAPTCHA_KEY = 'b09a7aafbfd83f73b35a9b530d0337bf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { captcha_output, gen_time, lot_number, pass_token } = req.body;
  if (!captcha_output || !gen_time || !lot_number || !pass_token) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const { result } = await validateCaptcha({
    captcha_id: CAPTCHA_ID,
    lot_number,
    captcha_output,
    pass_token,
    gen_time,
    sign_token: generateSignToken(lot_number, CAPTCHA_KEY),
  });

  return res.status(200).json({ ok: result === 'success' });
}
```
