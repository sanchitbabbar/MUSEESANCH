const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
// Hash the static structured-data script; executable inline scripts remain blocked.
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const hashes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => "'sha256-" + crypto.createHash('sha256').update(match[1]).digest('base64') + "'");
module.exports = {
  'Content-Security-Policy': [
    "default-src 'none'", "base-uri 'none'", "object-src 'none'", "frame-ancestors 'none'",
    "script-src 'self' " + hashes.join(' '), "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com", "img-src 'self' data:",
    "connect-src 'self' https://formspree.io", "form-action https://formspree.io/f/mrpgkojw"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'Strict-Transport-Security': 'max-age=31536000',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin'
};
