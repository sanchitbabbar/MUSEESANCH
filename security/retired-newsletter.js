// The coming-soon signup is retired. No storage binding or email credential is needed.
export default {
  async fetch() {
    return new Response(JSON.stringify({error:'Newsletter signup is closed.'}),{
      status:410,
      headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
        'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY',
        'Content-Security-Policy':"default-src 'none'; frame-ancestors 'none'",'Referrer-Policy':'no-referrer'}
    });
  }
};
