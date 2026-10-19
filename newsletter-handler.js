// Only a confirmed backend response may acknowledge a subscription.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    if (form.dataset.subscriptionBound) return;
    form.dataset.subscriptionBound = 'true';
    let pending = false;
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (pending || !form.reportValidity()) return;
      const email = form.querySelector('input[type="email"]');
      if (!email) return;
      const button = form.querySelector('[type="submit"], .send-text');
      const original = button ? button.textContent : '';
      let status = form.querySelector('.newsletter-status');
      if (!status) {
        status = document.createElement('p');
        status.className = 'newsletter-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        form.appendChild(status);
      }
      const french = document.documentElement.lang === 'fr';
      pending = true;
      form.setAttribute('aria-busy', 'true');
      if (button) { button.disabled = true; button.textContent = french ? 'Envoi…' : 'Sending…'; }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch('https://formspree.io/f/mrpgkojw', {
          method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({
            email: email.value.trim(),
            _replyto: email.value.trim(),
            _subject: 'MUSEÉ SANCH launch notification request',
            request_type: 'Launch notification subscription', website: 'MUSEÉ SANCH'
          }), signal: controller.signal
        });
        if (!response.ok || !(response.headers.get('content-type') || '').includes('application/json')) throw new Error('Unavailable');
        const result = await response.json();
        if (result.ok !== true) throw new Error('Not confirmed');
        status.textContent = french ? 'Demande reçue. Merci pour votre intérêt pour MUSEÉ SANCH.' : 'Request received. Thank you for your interest in MUSEÉ SANCH.';
        form.reset();
      } catch {
        status.textContent = french ? 'Inscription indisponible. Votre demande n’a pas été confirmée. Contactez contact@studiosanch.com.' : 'Subscription unavailable. Your request was not confirmed. Please contact contact@studiosanch.com.';
      } finally {
        clearTimeout(timeout); pending = false; form.removeAttribute('aria-busy');
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  });
});
