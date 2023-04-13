import React from 'react';
import GeeTest from 'react-geetest-v4';

export default function GeeTestPage() {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('handleSubmit', event);
  };

  const onSuccess = async (result: any) => {
    console.log('onSuccess: result: ', result);
    const res = await fetch('/api/geetest/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pass_token: result.pass_token,
        captcha_output: result.captcha_output,
        gen_time: result.gen_time,
        lot_number: result.lot_number,
      }),
    });
    console.log('onSuccess: validate: ', await res.json());
  };

  return (
    <form id={'form'} onSubmit={handleSubmit}>
      <div>
        <label htmlFor={'username'}>Username:</label>
        <input className={'inp'} id={'username'} defaultValue={'username'} />
      </div>
      <br />
      <div>
        <label htmlFor={'password'}>Password:</label>
        <input className={'inp'} id={'password'} type={'password'} defaultValue={'123456'} />
      </div>
      <br />
      <GeeTest
        captchaId={'5decacd0f70bf10222f6bb144f1278b9'}
        product={'popup'}
        onSuccess={onSuccess}
      />
      <br />
      <div>
        <button type={'submit'}>Submit</button>
      </div>
    </form>
  );
}
