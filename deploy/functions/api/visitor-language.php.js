export function onRequestGet({ request }) {
 const country = String(request.cf?.country || '').toUpperCase();
 return new Response(JSON.stringify({language:country === 'FR' ? 'fr' : 'en'}), {
  headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}
 });
}
