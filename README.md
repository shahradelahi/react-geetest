# GeeTest integration for React

A very simple React component to
integrate [GeeTest captcha](https://docs.geetest.com/BehaviorVerification/overview/start/).

## Installation

```bash
npm install react-geetest-v4
```

## Usage

```tsx
import React from "react";
import GeeTest from "react-geetest";

export default function Home(): JSX.Element {
  return (
    <GeeTest
      captchaId="your captcha id"
      onSuccess={() => console.log("success")}
      onReady={() => console.log("ready")}
    />
  );
}
```
