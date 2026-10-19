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
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
for (const file of ['styles.css', 'fonts.css', 'script.js', 'newsletter-handler.js', 'artworks.html', 'gallery.js', 'gallery.css', 'legal-notice.html', 'legal-notice-en.html']) {
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
