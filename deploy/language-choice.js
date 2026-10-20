(() => {
 const key='musee-sanch:language';let saved;try{saved=localStorage.getItem(key);}catch{}
 const valid=v=>v==='en'||v==='fr';
 let userSelected=false;
 const chooser=document.createElement('dialog');chooser.className='language-choice';chooser.setAttribute('aria-labelledby','language-title');
 chooser.innerHTML='<div class="language-choice-inner"><p class="language-brand" aria-label="Musée Sanch">MUS<span class="logo-acute">E</span>E SANCH</p><h2 id="language-title">Choisissez votre langue<span>Choose your language</span></h2><div class="language-options"><button type="button" lang="en" data-choice="en">English</button><span aria-hidden="true">/</span><button type="button" lang="fr" data-choice="fr">Français</button></div></div>';
 const reopen=document.createElement('button');reopen.type='button';reopen.className='language-reopen';reopen.textContent='EN / FR';reopen.setAttribute('aria-label','Choose language / Choisir la langue');
 document.body.append(chooser);
 if(!document.querySelector('.gallery-navigation')) document.body.append(reopen);
 function apply(lang,persist=false){
  if(persist){userSelected=true;try{localStorage.setItem(key,lang);}catch{}}
  const path=location.pathname;const base=path.split('/').pop();
  const policy=/^(privacy-policy|terms|legal-notice)(-en)?\.html$/.exec(base);
  if(policy){const target=policy[1]+(lang==='en'?'-en':'')+'.html';if(target!==base){location.replace('./'+target+location.hash);return;}}
  document.documentElement.lang=lang;
  const title=document.querySelector('.eyebrow.ode'),intro=document.querySelector('.intro'),entry=document.querySelector('.museum-entry');
  if(title)title.textContent=lang==='fr'?'Une Ode à la Féminité':'An Ode to Femininity';
  if(intro)intro.textContent=lang==='fr'?"Où se révèle la délicate interaction entre le masculin et le féminin, dans une résonance auréolée d'élégance.":'Revealing the delicate interplay between masculine and feminine, in a resonance imbued with elegance.';
  if(entry)entry.textContent=lang==='fr'?'Entrer dans l’univers':'Enter the universe';
  const links=document.querySelectorAll('footer nav a');
  ['privacy-policy','terms','legal-notice'].forEach((stem,i)=>{if(links[i]){links[i].href='./'+stem+(lang==='en'?'-en':'')+'.html';links[i].textContent=(lang==='fr'?['CONFIDENTIALITÉ','CONDITIONS','MENTIONS LÉGALES']:['PRIVACY','TERMS','LEGAL NOTICE'])[i];}});
  const copyright=document.querySelector('footer .mda-stamp + p');if(copyright){copyright.replaceChildren(document.createTextNode('ⓒ 2026 SANCHIT BABBAR'),document.createElement('br'),document.createTextNode(lang==='fr'?'TOUS DROITS RÉSERVÉS.':'ALL RIGHTS RESERVED.'));}
  window.dispatchEvent(new CustomEvent('musee:language',{detail:lang}));
 }
 chooser.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{chooser.close();apply(b.dataset.choice,true);}));
 reopen.addEventListener('click',()=>chooser.showModal());
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.language,true)));
 document.querySelectorAll('.policy-header nav a').forEach(a=>{if(a.textContent==='EN'||a.textContent==='FR')a.addEventListener('click',()=>{try{localStorage.setItem(key,a.textContent.toLowerCase());}catch{}});});
 if(valid(saved))apply(saved);else {
  // Country provides a default only; an explicit visitor choice always wins.
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),1800);
  fetch('./api/visitor-language.php',{cache:'no-store',headers:{Accept:'application/json'},signal:controller.signal})
   .then(response=>{if(!response.ok)throw new Error('Unavailable');return response.json();})
   .then(result=>{if(!userSelected)apply(valid(result.language)?result.language:'en');})
   .catch(()=>{if(!userSelected)apply('en');})
   .finally(()=>clearTimeout(timer));
  chooser.showModal();
 }
})();
