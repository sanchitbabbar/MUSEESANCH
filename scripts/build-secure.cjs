const fs = require('node:fs');
const path = require('node:path');
const headers = require('../security/headers.cjs');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
// Rebuild only the generated directory; never upload the repository root.
fs.rmSync(out, {recursive:true, force:true});
fs.mkdirSync(out, {recursive:true});
const files = ['index.html','artworks.html','404.html','styles.css','fonts.css','gallery.js','gallery.css',
  'artwork-request.css','artwork-request.js','collection-intro.css','collection-intro.js',
  'language-choice.js','language-choice.css','cookie-consent.js','cookie-consent.css',
  'legal.css','legal-notice.html','legal-notice-en.html','privacy-policy.html','privacy-policy-en.html',
  'terms.html','terms-en.html','robots.txt','sitemap.xml'];
for (const file of files) fs.copyFileSync(path.join(root,file),path.join(out,file));
for (const directory of ['images','fonts']) {
  const source = path.join(root,directory);
  function copy(dir,relative='') {
    for (const item of fs.readdirSync(dir,{withFileTypes:true})) {
      if (item.isSymbolicLink() || item.name.startsWith('.')) continue;
      const rel=path.join(relative,item.name), dest=path.join(out,directory,rel);
      if(item.isDirectory()) copy(path.join(dir,item.name),rel);
      else if (/\.(?:png|jpe?g|webp|avif|gif|ico|svg|woff2?|ttf|otf|mp4|webm)$/i.test(item.name)) {
        fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(dir,item.name),dest);
      }
    }
  }
  copy(source);
}
fs.cpSync(path.join(root,'functions'),path.join(out,'functions'),{recursive:true});
const assetPaths = [];
function listAssets(dir) { for (const item of fs.readdirSync(dir,{withFileTypes:true})) { const absolute=path.join(dir,item.name); if(item.isDirectory()) listAssets(absolute); else assetPaths.push('/'+path.relative(out,absolute).split(path.sep).join('/')); } }
for (const directory of ['images','fonts']) listAssets(path.join(out,directory));
const publicPaths = ['/', ...assetPaths, ...files.map(file=>'/'+file), ...files.filter(file=>file.endsWith('.html')).map(file=>'/'+file.slice(0,-5)), '/api/visitor-language.php'];
const middleware = 'const SECURITY_HEADERS = '+JSON.stringify(headers)+';\nconst PUBLIC_FILES = '+JSON.stringify(publicPaths)+';\n'+fs.readFileSync(path.join(root,'security/pages-middleware.js'),'utf8');
fs.writeFileSync(path.join(out,'functions/_middleware.js'),middleware);
fs.writeFileSync(path.join(out,'_routes.json'),JSON.stringify({version:1,include:['/*'],exclude:[]},null,2));
fs.mkdirSync(path.join(out,'api'),{recursive:true});
fs.copyFileSync(path.join(root,'api/visitor-language.php'),path.join(out,'api/visitor-language.php'));
fs.writeFileSync(path.join(out,'_headers'),'/*\n'+Object.entries(headers).map(([k,v])=>`  ${k}: ${v}`).join('\n')+'\n  ! Access-Control-Allow-Origin\n');
// Apache/SiteGround equivalent. Do not preload HSTS or affect other subdomains.
const apache = `<IfModule mod_headers.c>\n${Object.entries(headers).map(([k,v])=>`Header always set ${k} "${v}"`).join('\n')}\nHeader always unset Access-Control-Allow-Origin\n</IfModule>\nOptions -Indexes\n<FilesMatch "(^\\.|\\.(?:txt|json|zip|pages|env|log|sql|bak)$)">\nRequire all denied\n</FilesMatch>\n<Files "robots.txt">\nRequire all granted\n</Files>\n`;
fs.writeFileSync(path.join(out,'.htaccess'),apache);
fs.copyFileSync(path.join(out,'_headers'),path.join(root,'_headers'));
console.log('Built dist/ from an explicit public-file allowlist, with security headers.');
