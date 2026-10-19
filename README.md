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
