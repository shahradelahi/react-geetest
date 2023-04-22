import { describe, expect, it } from '@jest/globals';
import { generateSignToken, validateCaptcha } from 'react-geetest-v4';

describe('server validate captcha', () => {
  it('should throw error for invalid captcha_id', async function () {
    const result = await validateCaptcha({
      captcha_id: '',
      lot_number: '',
      gen_time: '',
      pass_token: '',
      sign_token: '',
      captcha_output: '',
    });

    console.log(result);
    expect(result.status).toBe('error');

    if (result.status === 'error') {
      expect(result.code).toBe('-50101');
      expect(result.msg).toBe('not captcha_id');
    }
  });
  it('should fail for invalid sign_token', async function () {
    const result = await validateCaptcha({
      captcha_id: '647f5ed2ed8acb4be36784e01556bb71',
      lot_number: 'c4c69a52999045aea1d34b57f1ef29f2',
      gen_time: '1682136049',
      pass_token: '',
      sign_token: generateSignToken('c4c69a52999045aea1d34b57f1ef29f2', ''),
      captcha_output: '',
    });

    console.log(result);
    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.result).toBe('fail');
      expect(result.reason).toBe('sign_token error');
    }
  });
  it('should fail for invalid pass_token', async function () {
    const result = await validateCaptcha({
      captcha_id: '647f5ed2ed8acb4be36784e01556bb71',
      lot_number: 'c4c69a52999045aea1d34b57f1ef29f2',
      gen_time: '1682136049',
      pass_token: '4b774095664ce55ad3ffe5c73b26af02430119056ec18bd5f25f21301bb19608',
      sign_token: generateSignToken(
        'c4c69a52999045aea1d34b57f1ef29f2',
        'b09a7aafbfd83f73b35a9b530d0337bf',
      ),
      captcha_output:
        'r-npFi9qNlfgy-zgvhB4k0519xpmbTQLGXBC19aY4E0ES20Xp1YUyWcx8mbeo0WHPYWCUNvyGcNcVQqInczQnHdbL1F472wKz3OVJKgwhUik2v2XSNdVZFdqGAnnHR7-zi_Wq5ozdMLv0J4vF9ruveeSSnRd0uYHSNw4EnySYKpmleNmlaAtivXRAIbAeUyCTXeTU60_lAKapXsobRaEgG3Qf39RlAdTbK9HD0ixB1w=',
    });

    console.log(result);
    expect(result.status).toBe('success');

    if (result.status === 'success') {
      expect(result.result).toBe('fail');
      expect(result.reason).toBe('pass_token error');
    }
  });
});
