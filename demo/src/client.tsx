import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GeeTest, { GeeTestValidateResult } from 'react-geetest-v4';

const CAPTCHA_ID = import.meta.env.VITE_GEETEST_CAPTCHA_ID!;

function App() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onSuccess = async (data: GeeTestValidateResult | undefined) => {
    if (!data) return;

    setLoading(true);
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      setResult(json);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>GeeTest React Demo</h1>
      <p>Click the captcha below to verify:</p>

      <GeeTest captchaId={CAPTCHA_ID} onSuccess={onSuccess} product='popup' />

      {loading && <p>Validating...</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Validation Result:</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
