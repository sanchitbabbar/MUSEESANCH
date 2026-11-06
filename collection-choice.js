(() => {
// Artwork deep links open their existing detail view without an entry interruption.
if(!/\/artworks(?:\.html)?$/.test(location.pathname))return;
const grid=document.getElementById('artwork-grid');if(!grid)return;
document.documentElement.classList.add('collection-pending');
const entryStage=document.createElement('section');entryStage.className='collection-entry-stage';
const collectionHeader=document.getElementById('collection');collectionHeader.before(entryStage);
const scrollLink=document.querySelector('.prologue-scroll');
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollFrame=0,cancelGlide=()=>{};
function glideTo(element){
 cancelGlide();
 const root=document.documentElement,previousScroll=root.style.scrollBehavior;root.style.scrollBehavior='auto';
 if(reducedMotion()){try{element.scrollIntoView({behavior:'auto'});}finally{root.style.scrollBehavior=previousScroll;}return Promise.resolve(true);}
 const start=scrollY,end=start+element.getBoundingClientRect().top;
 return new Promise(resolve=>{
  const began=performance.now(),duration=3000;
  const cleanup=()=>{root.style.scrollBehavior=previousScroll;removeEventListener('wheel',cancel);removeEventListener('touchstart',cancel);removeEventListener('keydown',cancel);cancelGlide=()=>{};};
  const cancel=()=>{cancelAnimationFrame(scrollFrame);cleanup();resolve(false);};cancelGlide=cancel;
  addEventListener('wheel',cancel,{passive:true});addEventListener('touchstart',cancel,{passive:true});addEventListener('keydown',cancel);
  function step(now){const t=Math.min(1,(now-began)/duration),e=t*t*t*(t*(t*6-15)+10);scrollTo({top:start+(end-start)*e,behavior:'auto'});if(t<1)scrollFrame=requestAnimationFrame(step);else{cleanup();resolve(true);}}
  scrollFrame=requestAnimationFrame(step);
 });
}
// A cancelled or unavailable animation must never strand a collection behind its curtain.
async function curtain(element,frames,options){
 await window.museeMotion.animate(element,frames,Math.min(options.duration,850));
 return ()=>{};
}
function dissolveIn(){if(reducedMotion()){sheet.animate([{opacity:0},{opacity:1}],{duration:2800,easing:'ease-in-out'});return;}sheet.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:2800,easing:'cubic-bezier(.45,0,.55,1)'});}

scrollLink?.addEventListener('click',event=>{event.preventDefault();glideTo(document.documentElement.classList.contains('collection-pending')?entryStage:collectionHeader);});
const acquisitionWorks=[...['Celle qui se connaît','Deepa'].map(title=>designs.find(item=>item.title===title)),{"title": "Instar", "year": "2025", "descriptionEn": "Present now in this moment—breathing, vulnerable, efflorescing like a flower, sharing life... Is what is shared felt deep within, yet what makes a sudden fog appear, luring towards past or future to compare or define? Does yielding to that sway mean crushing the blossoming rose right in front, or admiring a fallen leaf which is not even here? The curiosity in the source remains open, continuing for the feminine to be.", "descriptionFr": "Présente ici, en cet instant—respirante, vulnérable, s’épanouissant comme une fleur, offrant la vie… Ce qui est partagé est-il ressenti au plus profond, et pourtant, qu’est-ce qui fait apparaître une brume soudaine, attirant vers le passé ou l’avenir pour comparer ou définir ? Glisser dans ce penchant signifie-t-il écraser la rose en fleur juste devant soi, ou admirer une feuille morte qui n’est même pas là ? Demeure au cœur la curiosité ouverte, pour que le féminin continue d’être.", "image": "/images/auctions/instar-original.webp"}];if(acquisitionWorks.some(work=>!work))return;let work=acquisitionWorks[0];
const dialog=document.createElement('dialog');dialog.className='collection-choice';dialog.dataset.view='choices';dialog.setAttribute('aria-label','Choisir une collection');
dialog.innerHTML=`<div class="choice-atmosphere" aria-hidden="true"><div class="prologue-art prologue-art-left"><img src="./images/art-prints/leden.webp" alt="" width="500" height="700"></div><div class="prologue-art prologue-art-right"><img src="./images/art-prints/murmure-des-petales-final-signed.webp" alt="" width="500" height="700"></div><div class="choice-atmosphere-veil"></div></div><button type="button" class="choice-back"></button><button type="button" class="choice-scroll-up"><span aria-hidden="true"></span><small>Scroll</small></button><div class="collection-choice-options"><button type="button" data-editions></button><span class="collection-choice-rule" aria-hidden="true"></span><button type="button" data-originals></button></div><section class="choice-auction-preview" hidden><button type="button" class="choice-attend"><span data-upcoming></span><span class="choice-preview-title"></span><span data-attend></span></button></section><section class="choice-original" hidden><figure><img src="./images/auctions/celle-qui-se-connait-original.webp" alt="Celle qui se connaît" width="1148" height="1800"></figure><div><p class="choice-auction-label"></p><h2></h2><p class="choice-year">2025</p><p class="choice-medium"><span data-medium></span><span class="choice-provenance"></span></p><p class="choice-proposal"></p><p class="choice-poetry"></p><button type="button" class="choice-interest"></button></div></section><section class="choice-form-view" hidden><p class="choice-auction-label"></p><h2>Celle qui se connaît</h2><form action="https://formspree.io/f/mrpgkojw" method="POST"><label><span data-label="name"></span><input name="name" autocomplete="name" maxlength="150" required></label><label><span data-label="email"></span><input type="email" name="email" autocomplete="email" maxlength="254" required></label><label><span data-label="message"></span><textarea name="message" rows="4" maxlength="5000" required></textarea></label><p class="choice-privacy"></p><button type="submit" class="choice-submit"></button></form><p class="choice-status" role="status" aria-live="polite"></p></section>`;
// Keep content and footer in one uninterrupted scroll surface.
const sheet=document.createElement('div');sheet.className='choice-sheet';
[...dialog.children].filter(element=>!element.classList.contains('choice-atmosphere')).forEach(element=>sheet.append(element));
dialog.append(sheet);
const collectionFooter=document.querySelector('body > footer').cloneNode(true);
collectionFooter.classList.add('choice-footer');
collectionFooter.querySelector('.musee-cookie-reopen')?.addEventListener('click',()=>{const banner=document.querySelector('.musee-cookie-banner');if(banner)dialog.append(banner);document.querySelector('body > footer .musee-cookie-reopen')?.click();});
dialog.append(collectionFooter);
const languageSwitch=document.createElement('button');languageSwitch.type='button';languageSwitch.className='choice-language';languageSwitch.textContent='EN / FR';languageSwitch.setAttribute('aria-label','Choose language / Choisir la langue');languageSwitch.onclick=()=>document.querySelector('.language-choice').showModal();dialog.append(languageSwitch);
entryStage.append(dialog);
const preview=dialog.querySelector('.choice-auction-preview');
const originalInvitation=preview.querySelector('.choice-attend');
acquisitionWorks.slice(1).forEach(()=>preview.append(originalInvitation.cloneNode(true)));
const acquisitionHeading=document.createElement('p');acquisitionHeading.className='choice-acquisition-heading';acquisitionHeading.textContent='Acquisition';preview.prepend(acquisitionHeading);
const invitationList=document.createElement('div');invitationList.className='choice-invitation-scroll';invitationList.setAttribute('role','group');
preview.querySelectorAll('.choice-attend').forEach(button=>invitationList.append(button));preview.append(invitationList);
const moreOriginals=document.createElement('button');moreOriginals.type='button';moreOriginals.className='choice-more-originals';moreOriginals.innerHTML='<span class="originals-scroll-light" aria-hidden="true"></span>';preview.append(moreOriginals);
function updateOriginalsHint(){const more=invitationList.scrollHeight-invitationList.clientHeight-invitationList.scrollTop>5;invitationList.dataset.more=String(more);moreOriginals.dataset.visible=String(more);moreOriginals.tabIndex=more?0:-1;moreOriginals.setAttribute('aria-hidden',String(!more));}
invitationList.addEventListener('scroll',updateOriginalsHint,{passive:true});new ResizeObserver(updateOriginalsHint).observe(invitationList);
moreOriginals.onclick=()=>invitationList.scrollBy({top:180,behavior:'smooth'});

preview.querySelectorAll('.choice-attend').forEach((button,index)=>button.onclick=()=>{if(changingView)return;work=acquisitionWorks[index];resetOriginalRequest();showView('original');});
const options=dialog.querySelector('.collection-choice-options'),original=dialog.querySelector('.choice-original'),formView=dialog.querySelector('.choice-form-view'),form=dialog.querySelector('form'),status=dialog.querySelector('.choice-status'),submit=dialog.querySelector('.choice-submit');
let requestRevision=0;
function resetOriginalRequest(){
 requestRevision++;pending=false;sent=false;failed=false;
 form.reset();form.hidden=false;submit.disabled=false;
}
let returningIntro=false;
let view='choices',shown=false,pending=false,sent=false,failed=false,previousOverflow='',returnFocus;
const lang=()=>document.documentElement.lang==='en'?'en':'fr';
const copy={fr:{back:'← Retour',close:'Fermer',label:'Choisir une collection',editions:'Éditions d’Art',originals:'Œuvres Originales',auction:'Acquisition · Œuvre originale',interest:'Exprimer mon intérêt',name:'Nom complet',email:'Adresse e-mail',message:'Votre intérêt et votre proposition',submit:'ENVOYER MA DEMANDE',sending:'ENVOI…',defaultMessage:'Je souhaite manifester mon intérêt pour l’acquisition de « Celle qui se connaît » et vous soumettre la proposition suivante : [montant] EUR.',privacy:'Vos coordonnées sont transmises via Formspree pour répondre à votre demande.',policy:'Confidentialité',success:'Votre message a bien été envoyé. Nous vous recontacterons au sujet de votre proposition d’acquisition.',error:'Votre demande n’a pas pu être confirmée. Veuillez réessayer.'},en:{back:'← Back',close:'Close',label:'Choose a collection',editions:'Fine Art Editions',originals:'Originals',auction:'Acquisition · Original artwork',interest:'Express interest',name:'Full Name',email:'Email Address',message:'Your interest and proposed offer',submit:'PLACE YOUR REQUEST',sending:'SENDING…',defaultMessage:'I wish to express my interest in acquiring “Celle qui se connaît” and submit the following offer for your consideration: EUR [amount].',privacy:'Your details are sent through Formspree so we can respond to your enquiry.',policy:'Privacy',success:'Message sent successfully. We will be in touch regarding your acquisition proposal.',error:'Your request could not be confirmed. Please try again.'}};
function translate(){const c=copy[lang()];moreOriginals.setAttribute('aria-label',lang()==='fr'?'Voir les autres œuvres originales':'View more original artworks');invitationList.setAttribute('aria-label',lang()==='fr'?'Œuvres originales disponibles':'Available original artworks');
collectionFooter.querySelector('.mda-stamp + p').replaceChildren(document.createTextNode('ⓒ 2026 SANCHIT BABBAR'),document.createElement('br'),document.createTextNode(lang()==='fr'?'TOUS DROITS RÉSERVÉS.':'ALL RIGHTS RESERVED.'));
collectionFooter.querySelectorAll('nav a').forEach((link,i)=>{link.href='./'+['privacy-policy','terms','legal-notice'][i]+(lang()==='en'?'-en':'')+'.html';link.textContent=(lang()==='fr'?['CONFIDENTIALITÉ','CONDITIONS','MENTIONS LÉGALES']:['PRIVACY','TERMS','LEGAL NOTICE'])[i];});
preview.querySelectorAll('.choice-attend').forEach((button,index)=>{button.querySelector('[data-upcoming]').hidden=true;button.querySelector('.choice-preview-title').textContent=acquisitionWorks[index].title;button.querySelector('[data-attend]').textContent=lang()==='fr'?'Se renseigner':'Enquire';});original.querySelector('img').src=work.title==='Instar'?'./images/auctions/instar-original.webp':work.title==='Deepa'?'./images/auctions/deepa-original.webp':'./images/auctions/celle-qui-se-connait-original.webp';original.querySelector('img').alt=work.title;formView.querySelector('h2').textContent=work.title;dialog.setAttribute('aria-label',c.label);dialog.querySelector('.choice-scroll-up').hidden=view!=='choices';dialog.querySelector('.choice-scroll-up').setAttribute('aria-label',lang()==='fr'?'Remonter vers l’introduction':'Scroll up to the introduction');collectionHeader.querySelector('.back').setAttribute('aria-label',lang()==='fr'?'Retour aux collections':'Back to collections');dialog.querySelector('.choice-back').textContent=c.back;dialog.querySelector('.choice-back').hidden=view==='choices';dialog.querySelector('[data-editions]').textContent=c.editions;dialog.querySelector('[data-originals]').textContent=c.originals;dialog.querySelectorAll('.choice-auction-label').forEach(el=>el.textContent=c.auction);original.querySelector('h2').textContent=work.title;original.querySelector('.choice-year').textContent=work.year;original.querySelector('[data-medium]').textContent=lang()==='fr'?'Encre sur papier':'Ink on paper';original.querySelector('.choice-provenance').textContent=lang()==='fr'?'Créée à la main à Montmartre, Paris.':'Created by hand in Montmartre, Paris.';original.querySelector('.choice-proposal').textContent=lang()==='fr'?'Proposition — à partir de 1 000 000 EUR':'Proposal — from 1,000,000 EUR';original.querySelector('.choice-poetry').textContent=lang()==='fr'?work.descriptionFr:work.descriptionEn;dialog.querySelector('.choice-interest').textContent=c.interest;for(const key of ['name','email','message']){dialog.querySelector('[data-label="'+key+'"]').textContent=c[key];form.elements[key].placeholder=c[key];}submit.textContent=pending?c.sending:c.submit;status.textContent=sent?c.success:failed?c.error:'';const privacy=dialog.querySelector('.choice-privacy');privacy.replaceChildren(document.createTextNode(c.privacy+' '));const link=document.createElement('a');link.href=lang()==='fr'?'./privacy-policy.html':'./privacy-policy-en.html';link.textContent=c.policy;privacy.append(link);}
const collectionTitle=document.title;
const originalSlugs=['celle-qui-se-connait','deepa','instar'];
function syncOriginalAddress(){const url=new URL(location.href);if(view==='original'||view==='form'){url.searchParams.set('original',originalSlugs[acquisitionWorks.indexOf(work)]);document.title=work.title+' — '+(lang()==='fr'?'Œuvre originale':'Original artwork')+' | MUSÉE SANCH';}else{url.searchParams.delete('original');document.title=collectionTitle;}try{history.replaceState(history.state,'',url);}catch{} }
const warmOriginals=()=>{for(const slug of originalSlugs){const image=new Image();image.src='./images/auctions/'+slug+'-original.webp';image.decode?.().catch(()=>{});}};
if('requestIdleCallback' in window)window.requestIdleCallback(warmOriginals,{timeout:1200});else setTimeout(warmOriginals,700);
let changingView=false;
function applyView(next){
 view=next;syncOriginalAddress();dialog.dataset.view=next;
 options.hidden=next!=='choices';preview.hidden=next!=='preview';original.hidden=next!=='original';formView.hidden=next!=='form';
 translate();requestAnimationFrame(updateOriginalsHint);
}
function showView(next){
 if(changingView||next===view)return;
 const release=typeof window!=='undefined'&&window.museeMotion?.hold?window.museeMotion.hold(sheet):()=>{};
 cancelGlide();
 // Navigation must never wait for a fade or leave the incoming collection transparent.
 try{sheet.getAnimations?.().forEach(animation=>animation.cancel());}catch{}
 sheet.classList.remove('museum-curtain-leaving','museum-curtain-arriving','collection-view-arriving');
 sheet.inert=false;
 applyView(next);
 // Older mobile Safari accepts auto/smooth, but can reject instant. Override CSS smooth scrolling for this handover.
 const root=document.documentElement,previousScroll=root.style.scrollBehavior;
 root.style.scrollBehavior='auto';
 try{entryStage.scrollIntoView({behavior:'auto',block:'start'});}finally{root.style.scrollBehavior=previousScroll;}
 const target=next==='choices'?dialog.querySelector('[data-editions]'):dialog.querySelector('.choice-back');
 target.focus({preventScroll:true});
 if(!reducedMotion()){
  void sheet.offsetWidth;
  sheet.classList.add('collection-view-arriving');
 }
 release();
}
async function revealEditions(){
 const editions=dialog.querySelector('[data-editions]');if(editions.disabled||changingView)return;editions.disabled=true;changingView=true;sheet.inert=true;
 let clear=()=>{};
 try{
  clear=await curtain(sheet,reducedMotion()?[{opacity:1},{opacity:0}]:[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-35px)'}],{duration:550,easing:'cubic-bezier(.45,0,.55,1)'});
  document.documentElement.classList.remove('collection-pending');document.documentElement.classList.add('collection-revealing');
  entryStage.hidden=true;cancelGlide();
  const root=document.documentElement,previousScroll=root.style.scrollBehavior;root.style.scrollBehavior='auto';
  try{scrollTo({top:scrollY+collectionHeader.getBoundingClientRect().top,behavior:'auto'});}finally{root.style.scrollBehavior=previousScroll;}
  dialog.close();document.getElementById('works-tab').focus({preventScroll:true});
 }finally{clear();sheet.inert=false;editions.disabled=false;changingView=false;}
}
dialog.querySelector('[data-editions]').onclick=revealEditions;
function returnToIntro(){
 if(view!=='choices')return;
 glideTo(document.querySelector('.collection-prologue'));
}
dialog.querySelector('.choice-scroll-up').onclick=returnToIntro;
let returningChoices=false;
collectionHeader.querySelector('.back').addEventListener('click',async event=>{
 event.preventDefault();event.stopImmediatePropagation();
 if(returningChoices)return;returningChoices=true;
 cancelGlide();
 const galleryParts=[collectionHeader,grid,document.querySelector('body > footer')].filter(Boolean);
 const departures=await Promise.all(galleryParts.map(element=>curtain(element,[{opacity:1},{opacity:0}],{duration:1800,easing:'cubic-bezier(.45,0,.55,1)'})));
 document.documentElement.classList.add('collection-pending');document.documentElement.classList.remove('collection-revealing');
 entryStage.hidden=false;dialog.querySelector('[data-editions]').disabled=false;
 
 applyView('choices');if(!dialog.open)dialog.show();dissolveIn();departures.forEach(clear=>clear());await glideTo(entryStage);returningChoices=false;dialog.querySelector('[data-editions]').focus({preventScroll:true});
},true);
dialog.querySelector('[data-originals]').onclick=()=>showView('preview');

dialog.querySelector('.choice-interest').onclick=()=>{if(!form.elements.message.value)form.elements.message.value=copy[lang()].defaultMessage.replace('Celle qui se connaît',work.title);showView('form');};
dialog.querySelector('.choice-back').onclick=()=>showView(view==='form'?'original':view==='original'?'preview':'choices');
dialog.addEventListener('cancel',event=>{event.preventDefault();if(view!=='choices')showView(view==='form'?'original':view==='original'?'preview':'choices');});
dialog.addEventListener('close',()=>{returnFocus?.focus({preventScroll:true});});
form.addEventListener('submit',async event=>{event.preventDefault();if(pending||!form.reportValidity())return;const revision=requestRevision;const data=new FormData(form);data.set('artwork',work.title+' — original artwork');data.set('product',work.title+' — Original artwork');data.set('website',location.hostname);data.set('request_type','Acquisition enquiry and proposed offer');data.set('_subject','Purchase Inquiry: '+work.title+' — Original artwork');data.set('_replyto',String(data.get('email')||''));data.set('language',lang());pending=true;failed=false;submit.disabled=true;translate();try{const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Submission failed');const result=await response.json();if(result.ok!==true)throw new Error('Submission not confirmed');if(revision===requestRevision){sent=true;form.hidden=true;}}catch{if(revision===requestRevision)failed=true;}finally{if(revision===requestRevision){pending=false;submit.disabled=false;translate();}}});
// The collection curtain is in the document from the beginning: no observer,
// scroll lock, top-layer swap, or second scroll container at its threshold.
function maybeOpen(){}
shown=true;dialog.show();
new MutationObserver(()=>{translate();syncOriginalAddress();requestAnimationFrame(maybeOpen);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
translate();
const requestedOriginal=originalSlugs.indexOf(new URLSearchParams(location.search).get('original'));if(requestedOriginal>=0){work=acquisitionWorks[requestedOriginal];applyView('original');dissolveIn();requestAnimationFrame(()=>entryStage.scrollIntoView({behavior:'auto'}));}
if(location.hash==='#collection')requestAnimationFrame(()=>entryStage.scrollIntoView({behavior:'auto'}));

// Scroll cues guide the next movement; their labels never pulse.
const downCue=document.querySelector('.prologue-scroll'),upCue=dialog.querySelector('.choice-scroll-up');
let cueFrame=0;
function updateScrollCues(){
 cueFrame=0;
 const downOpacity=Math.max(0,1-scrollY/100);
 if(downCue){downCue.style.opacity=String(downOpacity);downCue.style.pointerEvents=downOpacity>.1?'':'none';}
 const entryTop=entryStage.getBoundingClientRect().top;
 const upOpacity=view==='choices'?Math.max(0,1-Math.abs(entryTop)/120):0;
 upCue.style.opacity=String(upOpacity);upCue.style.pointerEvents=upOpacity>.1?'':'none';
}
function queueScrollCues(){if(!cueFrame)cueFrame=requestAnimationFrame(updateScrollCues);}
addEventListener('scroll',queueScrollCues,{passive:true});addEventListener('resize',queueScrollCues);
new MutationObserver(queueScrollCues).observe(dialog,{attributes:true,attributeFilter:['data-view']});
updateScrollCues();
})();
