<p align="center">
  <a href="https://www.geetest.com/en/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://www.geetest.com/wp-content/uploads/2025/08/%E5%8F%8D%E8%89%B2on-1.png" alt="GeeTest" width="300" height="auto">
      <img src="https://www.geetest.com/wp-content/uploads/2025/02/%E8%8B%B1%E6%96%87%E5%9F%BA%E7%A1%80%E7%BB%84%E5%90%88.png" alt="GeeTest" width="300" height="auto">
    </picture>
  </a>
</p>
<h1 align="center">
  <p>
    <a href="https://github.com/shahradelahi/node-stockfish/actions/workflows/ci.yml">
      <img src="https://github.com/shahradelahi/node-stockfish/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI">
    </a>
    <a href="https://www.npmjs.com/package/react-geetest-v4">
      <img src="https://img.shields.io/npm/v/react-geetest-v4.svg" alt="NPM Version">
    </a>
    <a href="/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License">
    </a>
    <img src="https://img.shields.io/bundlephobia/minzip/react-geetest-v4" alt="npm bundle size">
    <a href="https://packagephobia.com/result?p=react-geetest-v4">
      <img src="https://packagephobia.com/badge?p=react-geetest-v4" alt="Install Size">
    </a>
  </p>
</h1>

_react-geetest-v4_ is a library for React integration for [GeeTest Captcha v4](https://docs.geetest.com/BehaviorVerification/overview/start/).

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Demo](#-demo)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
npm install react-geetest-v4
```

<details>
<summary>Install using your favorite package manager</summary>

**pnpm**

```bash
pnpm install react-geetest-v4
```

**yarn**

```bash
yarn add react-geetest-v4
```

</details>

## 📖 Usage

### Component Usage

The simplest way to get started. Use the `GeeTest` component directly in your JSX.

```tsx
import React from 'react';
import GeeTest, { GeeTestRef } from 'react-geetest-v4';

export default function App() {
  const captchaRef = React.useRef<GeeTestRef | null>(null);

  return (
    <div>
      {/* Invisible bind mode */}
      <GeeTest
        ref={captchaRef}
        captchaId='YOUR_CAPTCHA_ID'
        product='bind'
        onSuccess={(result) => console.log('Success:', result)}
      >
        <button onClick={() => captchaRef.current?.showCaptcha()}>
          Submit Form
        </button>
      </GeeTest>

      {/* Popup mode */}
      <GeeTest
        captchaId='YOUR_CAPTCHA_ID'
        product='popup'
        onSuccess={(result) => console.log('Verified:', result)}
      />
    </div>
  );
}
```

### Hook Usage

For more advanced use cases, use the `useGeeTest` hook to manage the captcha state manually.

```tsx
import { useGeeTest } from 'react-geetest-v4';

export default function App() {
  const { captcha, state } = useGeeTest('YOUR_CAPTCHA_ID', {
    product: 'bind',
  });

  const handleAction = () => {
    if (state === 'ready') {
      captcha?.showCaptcha();
    }
  };

  return <button onClick={handleAction}>Verify</button>;
}
```

### Server-side Validation

Validate the captcha result on your server using the provided utilities.

```typescript
import { generateSignToken, validateCaptcha } from 'react-geetest-v4';

// In your API handler
async function handler(req, res) {
  const { captcha_output, gen_time, lot_number, pass_token } = req.body;

  const { result } = await validateCaptcha({
    captcha_id: process.env.GEETEST_ID,
    lot_number,
    captcha_output,
    pass_token,
    gen_time,
    sign_token: generateSignToken(lot_number, process.env.GEETEST_KEY),
  });

  if (result === 'success') {
    // Captcha passed
  }
}
```

## 🚀 Demo

Check out the [demo](./demo) directory for a complete full-stack example using **Hono** and **Vite**.

```bash
cd demo
pnpm install
pnpm dev
```

## 📚 Documentation

For detailed configuration options, visit the [API Documentation](https://www.jsdocs.io/package/react-geetest-v4).

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/react-geetest).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/react-geetest/graphs/contributors).
