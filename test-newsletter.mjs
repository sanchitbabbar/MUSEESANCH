import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = await readFile('newsletter-handler.js', 'utf8');
for (const scenario of ['success', 'rejected', 'html', 'network', 'unconfirmed']) {
  test(`newsletter: ${scenario}`, async () => {
    let submit, reset = false;
    const status = { textContent: '' };
    const button = { textContent: 'Send', disabled: false };
    const form = {
      dataset: {}, reportValidity: () => true,
      addEventListener: (_, fn) => { submit = fn; },
      querySelector: selector => selector.includes('email') ? { value: 'test@example.com' } : selector === '.newsletter-status' ? status : button,
      setAttribute() {}, removeAttribute() {}, reset() { reset = true; },
    };
    vm.runInNewContext(source, {
      document: { documentElement: { lang: 'en' }, querySelectorAll: () => [form], addEventListener: (_, fn) => fn() },
      AbortController, setTimeout, clearTimeout,
      fetch: async (url) => {
        assert.equal(url, 'https://formspree.io/f/mrpgkojw');
        if (scenario === 'network') throw new Error('offline');
        return { ok: scenario !== 'rejected', headers: { get: () => scenario === 'html' ? 'text/html' : 'application/json' }, json: async () => ({ ok: scenario !== 'unconfirmed' }) };
      },
    });
    await submit({ preventDefault() {} });
    assert.equal(reset, scenario === 'success');
    assert.match(status.textContent, scenario === 'success' ? /Request received/ : /not confirmed/);
    assert.equal(button.disabled, false);
  });
}
