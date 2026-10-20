const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const headers = require('./headers.cjs');
const root = path.resolve(__dirname,'..');

test('public deployment contains no credentials, subscriber files, archives or server sources', () => {
  function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }
  const files=walk(path.join(root,'dist')).map(f=>path.relative(path.join(root,'dist'),f));
  for(const file of files) {
    assert.ok(!/(?:^|\/)(?:node_modules|\.git|security|scripts)(?:\/|$)/.test(file),file);
    assert.ok(!/(?:emails\.txt|\.env|\.pages$|\.zip$|server\.js|package.*json)/.test(file),file);
  }
  assert.ok(files.includes('_headers'));
  assert.ok(files.includes('functions/_middleware.js'));
  assert.ok(files.includes('404.html'));
});

test('edge middleware rejects private paths and write methods without touching data', async () => {
  const source=fs.readFileSync(path.join(root,'dist/functions/_middleware.js'),'utf8');
  const {onRequest}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
  let nextCalls=0;
  const run=(pathname,method='GET')=>onRequest({request:new Request('https://www.museesanch.com'+pathname,{method}),next:async()=>{nextCalls++;return new Response('ok',{headers:{'Access-Control-Allow-Origin':'*'}});}});
  for(const url of ['/emails.txt','/.env','/.git/config','/package.json','/server.js','/deploy/index.html','/security/headers.cjs','/api/emails','/api/subscribe','/images/test.pages','/images/%2esecret.png','/unknown']) {
    assert.equal((await run(url)).status,404,url);
  }
  assert.equal(nextCalls,0);
  for(const url of ['/','/artworks.html','/artworks','/api/visitor-language.php']) {
    const response=await run(url);assert.equal(response.status,200,url);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'),null);
    assert.equal(await response.text(),'ok');
    for(const [name,value] of Object.entries(headers))assert.equal(response.headers.get(name),value,name);
  }
  assert.equal((await run('/artworks.html','POST')).status,405);
  const assets=source.match(/const PUBLIC_FILES = (.*);/)[1];
  for(const asset of JSON.parse(assets).filter(p=>p.startsWith('/images/')||p.startsWith('/fonts/'))) {
    assert.equal((await run(encodeURI(asset))).status,200,asset);
  }
});

test('local preview denies private files and preserves page and language access', async () => {
  const child=spawn(process.execPath,['server.js'],{cwd:root,env:{...process.env,PORT:'3198'},stdio:['ignore','pipe','pipe']});
  try {
    await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw new Error('Server exited');}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Server startup timeout')),5000).unref())]);
    for(const url of ['/emails.txt','/.env','/.git/config','/server.js','/package.json','/deploy/index.html']) assert.equal((await fetch('http://127.0.0.1:3198'+url)).status,404,url);
    for(const url of ['/','/artworks.html']) {
      const response=await fetch('http://127.0.0.1:3198'+url);assert.equal(response.status,200);
      assert.equal(response.headers.get('x-powered-by'),null);
      for(const [name,value] of Object.entries(headers))assert.equal(response.headers.get(name),value);
    }
    assert.equal((await fetch('http://127.0.0.1:3198/artworks.html',{method:'POST'})).status,405);
    const language=await fetch('http://127.0.0.1:3198/api/visitor-language.php',{headers:{'CF-IPCountry':'FR'}});
    assert.deepEqual(await language.json(),{language:'fr'});assert.match(language.headers.get('cache-control'),/no-store/);
  } finally { child.kill(); await once(child,'exit'); }
});
