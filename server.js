const express = require('express');
const path = require('path');
const app = express();
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});
// Cloudflare supplies the country in production; unknown/local requests default to English.
app.get('/api/visitor-language.php', (req,res) => {
 const country=String(req.get('CF-IPCountry') || '').trim().toUpperCase();
 res.set('Cache-Control','private, no-store').set('Vary','CF-IPCountry');
 res.json({language:country==='FR'?'fr':'en'});
});
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
for (const file of ['styles.css', 'fonts.css', 'script.js', 'newsletter-handler.js', 'artworks.html', 'gallery.js', 'gallery.css', 'artwork-request.css', 'artwork-request.js', 'collection-intro.css', 'collection-intro.js', 'legal-notice.html', 'legal-notice-en.html', 'legal.css', 'language-choice.js', 'language-choice.css', 'cookie-consent.js', 'cookie-consent.css', 'privacy-policy.html', 'privacy-policy-en.html', 'terms.html', 'terms-en.html']) {
    app.get('/' + file, (req, res) => res.sendFile(path.join(__dirname, file)));
}
for (const directory of ['images', 'fonts']) {
    app.use('/' + directory, express.static(path.join(__dirname, directory), { dotfiles: 'deny', index: false }));
}
// Retire unsafe legacy storage and listing endpoints.
app.all(['/api/subscribe', '/api/emails'], (req, res) => {
    res.status(410).json({ error: 'Subscriptions are temporarily unavailable.' });
});
app.use((req, res) => res.status(404).send('Not found'));
const port = process.env.PORT || 3001;
app.listen(port, '127.0.0.1', () => console.log(`MUSEÉ SANCH: http://127.0.0.1:${port}`));
