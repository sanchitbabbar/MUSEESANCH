# MUSÉE SANCH

Run `npm start` and open http://127.0.0.1:3001.

The entrance links directly to artworks.html. There is no countdown or email gate.
The gallery contains the 11 artworks copied from Studio Sanch, preserving order,
images, descriptions and prices. It includes artwork details and a framed preview.
Acquisition links lead to the Studio Sanch boutique.

The catalog is a snapshot in gallery.js; future catalog changes must be synchronized.
Root, deploy/ and cloudflare-deploy/ have matching gallery files and image assets.
The previous Formspree handler is retained but is no longer loaded on the entrance.

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
