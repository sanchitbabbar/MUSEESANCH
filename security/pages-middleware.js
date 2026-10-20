// Header and file allowlist constants are injected by scripts/build-secure.cjs.
export async function onRequest(context) {
  const request = context.request;
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url).pathname); }
  catch { return new Response('Bad request', {status:400,headers:SECURITY_HEADERS}); }
  const privatePath = pathname.split('/').some(segment => segment.startsWith('.') || segment === '..');
  const allowed = PUBLIC_FILES.includes(pathname);
  const headers = new Headers(SECURITY_HEADERS);
  if (privatePath || !allowed) {
    headers.set('Cache-Control','no-store');
    return new Response('Not found',{status:404,headers});
  }
  if (!['GET','HEAD'].includes(request.method)) {
    headers.set('Allow','GET, HEAD');headers.set('Cache-Control','no-store');
    return new Response(null,{status:405,headers});
  }
  const original = await context.next();
  const response = new Response(original.body, original);
  for(const [name,value] of Object.entries(SECURITY_HEADERS)) response.headers.set(name,value);
  response.headers.delete('Access-Control-Allow-Origin');
  response.headers.delete('X-Powered-By');
  return response;
}
