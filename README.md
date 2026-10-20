# MUSÉE SANCH

Run `npm start` and open http://127.0.0.1:3001.

The entrance links directly to artworks.html. There is no countdown or email gate.
The gallery contains the 11 artworks copied from Studio Sanch, preserving order,
images, descriptions and prices. It includes artwork details and a framed preview.
Acquisition links lead to the Studio Sanch boutique.

The catalog is a snapshot in gallery.js; future catalog changes must be synchronized.
Build with `npm run build` and publish only `dist/`.
Older deploy/ folders are not authoritative security builds.

The local server binds only to localhost and serves only public site assets.
Legacy /api/subscribe and /api/emails return 410. Private files are not served.
Publish only the public deployment files, never the entire repository.


## Country-based language
Explicit stored language wins. Otherwise FR country = French, all other or unknown
countries = English. The first-visit language chooser remains available.
SiteGround serves api/visitor-language.php using Cloudflare's CF-IPCountry header.
Enable IP Geolocation and proxy museesanch.com through Cloudflare for that header.
Cloudflare Pages instead uses functions/api/visitor-language.php.js and request.cf.country.
Both endpoint variants return only the language and disable caching. Local preview
has no country information and defaults to English. Browser language is not used.

## Security and deployment
Run `npm run build` followed by `npm run test:security`. The public-file allowlist
excludes credentials, subscriber exports, server code and dependency files.
Cloudflare Pages build command: `npm run build`; output directory: `dist`.
Pages Functions middleware enforces the public-file allowlist, read-only methods
and security headers, including on generated responses. Do not dashboard-upload
this directory without compiling its Functions: use the Pages Git integration or Wrangler.
The generated .htaccess supplies Apache/SiteGround headers but the production
Cloudflare Pages deployment is the tested target.

The old coming-soon worker is retired with security/retired-newsletter.js. Its
Cloudflare KV namespace must be retained privately; do not delete its records.
Account MFA/passkeys, collaborator access, recovery settings, API key revocation,
provider-side form spam protection and ongoing monitoring still need account-level
review; the repository cannot guarantee those controls. No system is invulnerable.
