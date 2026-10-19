(() => {
 const key='musee-sanch:essential-cookies:v1';
 const banner=document.createElement('aside');banner.className='musee-cookie-banner';banner.hidden=true;
 banner.setAttribute('aria-label','Cookies');
 banner.innerHTML='<div class="musee-cookie-inner"><div class="musee-cookie-copy"><span class="musee-cookie-eyebrow"></span><p></p></div><div class="musee-cookie-actions"><a class="musee-cookie-link"></a><button type="button" class="musee-cookie-primary"></button></div></div>';
 const reopen=document.createElement('button');reopen.type='button';reopen.className='musee-cookie-reopen';reopen.textContent='COOKIES';
 document.body.append(banner);
 const footer=document.querySelector('footer');
 (footer || document.body).append(reopen);
 function translate(){const fr=document.documentElement.lang!=='en';
 banner.querySelector('.musee-cookie-eyebrow').textContent=fr?'Une expérience maîtrisée':'A considered experience';
 banner.querySelector('p').textContent=fr?'Seuls les cookies et stockages essentiels au fonctionnement et à la sécurité du musée sont utilisés. Aucun traceur publicitaire ou de mesure d’audience n’est activé.':'Only cookies and storage essential to the museum’s operation and security are used. No advertising or audience measurement trackers are enabled.';
 const link=banner.querySelector('a');link.textContent=fr?'Confidentialité':'Privacy';link.href=fr?'./privacy-policy.html':'./privacy-policy-en.html';
 banner.querySelector('button').textContent=fr?'Essentiels uniquement':'Essential only';}
 let stored=false;try{stored=localStorage.getItem(key)==='essential';}catch{}
 function show(){translate();banner.hidden=false;reopen.hidden=true;}
 function close(){try{localStorage.setItem(key,'essential');}catch{}banner.hidden=true;reopen.hidden=false;}
 banner.querySelector('button').addEventListener('click',()=>{close();reopen.focus();});reopen.addEventListener('click',()=>{show();banner.querySelector('button').focus();});
 window.addEventListener('musee:open-cookie-preferences',show);
 new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 translate();if(!stored||new URLSearchParams(location.search).has('previewCookies'))show();
})();
