(() => {
// Artwork deep links open their existing detail view without an entry interruption.
if(!/\/artworks(?:\.html)?$/.test(location.pathname))return;
const grid=document.getElementById('artwork-grid');if(!grid)return;
document.documentElement.classList.add('collection-pending');
const entryStage=document.createElement('section');entryStage.className='collection-entry-stage';
const collectionHeader=document.getElementById('collection');collectionHeader.before(entryStage);
const scrollLink=document.querySelector('.prologue-scroll');
const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
let scrollFrame=0;
function glideTo(element){
 cancelAnimationFrame(scrollFrame);
 const start=scrollY,end=start+element.getBoundingClientRect().top;
 // Keep this explicitly requested glide smooth; reduced motion uses fading screens without spatial animation.
 const began=performance.now(),duration=3000;
 const cancel=()=>{cancelAnimationFrame(scrollFrame);cleanup();};
 const cleanup=()=>{removeEventListener('wheel',cancel);removeEventListener('touchstart',cancel);removeEventListener('keydown',cancel);};
 addEventListener('wheel',cancel,{passive:true});addEventListener('touchstart',cancel,{passive:true});addEventListener('keydown',cancel);
 function step(now){const t=Math.min(1,(now-began)/duration),e=t*t*t*(t*(t*6-15)+10);scrollTo({top:start+(end-start)*e,behavior:'instant'});if(t<1)scrollFrame=requestAnimationFrame(step);else cleanup();}
 scrollFrame=requestAnimationFrame(step);
}
function dissolveIn(){if(reducedMotion()){sheet.animate([{opacity:0},{opacity:1}],{duration:2800,easing:'ease-in-out'});return;}sheet.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:2800,easing:'cubic-bezier(.45,0,.55,1)'});}

scrollLink?.addEventListener('click',event=>{event.preventDefault();glideTo(document.documentElement.classList.contains('collection-pending')?entryStage:collectionHeader);});
const work=designs.find(item=>item.title==='Celle qui se connaît');if(!work)return;
const dialog=document.createElement('dialog');dialog.className='collection-choice';dialog.dataset.view='choices';dialog.setAttribute('aria-label','Choisir une collection');
dialog.innerHTML=`<div class="choice-atmosphere" aria-hidden="true"><div class="prologue-art prologue-art-left"><img src="./images/art-prints/leden.webp" alt="" width="500" height="700"></div><div class="prologue-art prologue-art-right"><img src="./images/art-prints/murmure-des-petales-final-signed.webp" alt="" width="500" height="700"></div><div class="choice-atmosphere-veil"></div></div><button type="button" class="choice-back"></button><button type="button" class="choice-scroll-up"><span aria-hidden="true"></span><small>Scroll</small></button><div class="collection-choice-options"><button type="button" data-editions></button><span class="collection-choice-rule" aria-hidden="true"></span><button type="button" data-originals></button></div><section class="choice-auction-preview" hidden><button type="button" class="choice-attend"><span data-upcoming></span><span class="choice-preview-title"></span><span data-attend></span></button></section><section class="choice-original" hidden><figure><img src="./images/auctions/celle-qui-se-connait-original.webp" alt="Celle qui se connaît" width="1148" height="1800"></figure><div><p class="choice-auction-label"></p><h2></h2><p class="choice-year">2025</p><p class="choice-proposal"></p><p class="choice-poetry"></p><button type="button" class="choice-interest"></button></div></section><section class="choice-form-view" hidden><p class="choice-auction-label"></p><h2>Celle qui se connaît</h2><form action="https://formspree.io/f/mrpgkojw" method="POST"><label><span data-label="name"></span><input name="name" autocomplete="name" maxlength="150" required></label><label><span data-label="email"></span><input type="email" name="email" autocomplete="email" maxlength="254" required></label><label><span data-label="message"></span><textarea name="message" rows="4" maxlength="5000" required></textarea></label><p class="choice-privacy"></p><button type="submit" class="choice-submit"></button></form><p class="choice-status" role="status" aria-live="polite"></p></section>`;
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
const options=dialog.querySelector('.collection-choice-options'),original=dialog.querySelector('.choice-original'),formView=dialog.querySelector('.choice-form-view'),form=dialog.querySelector('form'),status=dialog.querySelector('.choice-status'),submit=dialog.querySelector('.choice-submit');
let returningIntro=false;
let view='choices',shown=false,pending=false,sent=false,failed=false,previousOverflow='',returnFocus;
const lang=()=>document.documentElement.lang==='en'?'en':'fr';
const copy={fr:{back:'← Retour',close:'Fermer',label:'Choisir une collection',editions:'Éditions d’Art',originals:'Œuvres Originales',auction:'Acquisition · Œuvre originale',interest:'Exprimer mon intérêt',name:'Nom complet',email:'Adresse e-mail',message:'Votre intérêt et votre proposition',submit:'ENVOYER MA DEMANDE',sending:'ENVOI…',defaultMessage:'Je souhaite manifester mon intérêt pour l’acquisition de « Celle qui se connaît » et vous soumettre la proposition suivante : [montant] EUR.',privacy:'Vos coordonnées sont transmises via Formspree pour répondre à votre demande.',policy:'Confidentialité',success:'Votre message a bien été envoyé. Nous vous recontacterons au sujet de votre proposition d’acquisition.',error:'Votre demande n’a pas pu être confirmée. Veuillez réessayer.'},en:{back:'← Back',close:'Close',label:'Choose a collection',editions:'Fine Art Editions',originals:'Originals',auction:'Acquisition · Original artwork',interest:'Express interest',name:'Full Name',email:'Email Address',message:'Your interest and proposed offer',submit:'PLACE YOUR REQUEST',sending:'SENDING…',defaultMessage:'I wish to express my interest in acquiring “Celle qui se connaît” and submit the following offer for your consideration: EUR [amount].',privacy:'Your details are sent through Formspree so we can respond to your enquiry.',policy:'Privacy',success:'Message sent successfully. We will be in touch regarding your acquisition proposal.',error:'Your request could not be confirmed. Please try again.'}};
function translate(){const c=copy[lang()];
collectionFooter.querySelector('.mda-stamp + p').replaceChildren(document.createTextNode('ⓒ 2026 SANCHIT BABBAR'),document.createElement('br'),document.createTextNode(lang()==='fr'?'TOUS DROITS RÉSERVÉS.':'ALL RIGHTS RESERVED.'));
collectionFooter.querySelectorAll('nav a').forEach((link,i)=>{link.href='./'+['privacy-policy','terms','legal-notice'][i]+(lang()==='en'?'-en':'')+'.html';link.textContent=(lang()==='fr'?['CONFIDENTIALITÉ','CONDITIONS','MENTIONS LÉGALES']:['PRIVACY','TERMS','LEGAL NOTICE'])[i];});
preview.querySelector('[data-upcoming]').textContent=lang()==='fr'?'Acquisition':'Acquisition';preview.querySelector('.choice-preview-title').textContent=work.title;preview.querySelector('[data-attend]').textContent=lang()==='fr'?'Se renseigner':'Enquire';dialog.setAttribute('aria-label',c.label);dialog.querySelector('.choice-scroll-up').hidden=view!=='choices';dialog.querySelector('.choice-scroll-up').setAttribute('aria-label',lang()==='fr'?'Remonter vers l’introduction':'Scroll up to the introduction');collectionHeader.querySelector('.back').setAttribute('aria-label',lang()==='fr'?'Retour aux collections':'Back to collections');dialog.querySelector('.choice-back').textContent=c.back;dialog.querySelector('.choice-back').hidden=view==='choices';dialog.querySelector('[data-editions]').textContent=c.editions;dialog.querySelector('[data-originals]').textContent=c.originals;dialog.querySelectorAll('.choice-auction-label').forEach(el=>el.textContent=c.auction);original.querySelector('h2').textContent=work.title;original.querySelector('.choice-year').textContent=work.year;original.querySelector('.choice-proposal').textContent=lang()==='fr'?'Proposition — à partir de 1 000 000 EUR':'Proposal — from 1,000,000 EUR';original.querySelector('.choice-poetry').textContent=lang()==='fr'?work.descriptionFr:work.descriptionEn;dialog.querySelector('.choice-interest').textContent=c.interest;for(const key of ['name','email','message'])dialog.querySelector('[data-label="'+key+'"]').textContent=c[key];submit.textContent=pending?c.sending:c.submit;status.textContent=sent?c.success:failed?c.error:'';const privacy=dialog.querySelector('.choice-privacy');privacy.replaceChildren(document.createTextNode(c.privacy+' '));const link=document.createElement('a');link.href=lang()==='fr'?'./privacy-policy.html':'./privacy-policy-en.html';link.textContent=c.policy;privacy.append(link);}
function showView(next){view=next;dialog.dataset.view=next;options.hidden=next!=='choices';preview.hidden=next!=='preview';original.hidden=next!=='original';formView.hidden=next!=='form';translate();dialog.scrollTop=0;(next==='choices'?dialog.querySelector('[data-editions]'):dialog.querySelector('.choice-back')).focus({preventScroll:true});if(reducedMotion()){sheet.animate([{opacity:0},{opacity:1}],{duration:2800,easing:'ease-in-out'});return;}sheet.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:2800,easing:'cubic-bezier(.45,0,.55,1)'});}
async function revealEditions(){
 const editions=dialog.querySelector('[data-editions]');if(editions.disabled)return;editions.disabled=true;
 if(reducedMotion())await sheet.animate([{opacity:1},{opacity:0}],{duration:2200,easing:'ease-in-out',fill:'forwards'}).finished;else await sheet.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-35px)'}],{duration:2200,easing:'cubic-bezier(.45,0,.55,1)',fill:'forwards'}).finished;
 document.documentElement.classList.remove('collection-pending');
 document.documentElement.classList.add('collection-revealing');
 entryStage.hidden=true;
 // Settle the document beneath the still-invisible curtain before removing it.
 cancelAnimationFrame(scrollFrame);
 scrollTo({top:scrollY+collectionHeader.getBoundingClientRect().top,behavior:'instant'});
 dialog.close();sheet.getAnimations().forEach(animation=>animation.cancel());
 document.getElementById('works-tab').focus({preventScroll:true});
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
 cancelAnimationFrame(scrollFrame);
 const galleryParts=[collectionHeader,grid,document.querySelector('body > footer')].filter(Boolean);
 const departures=galleryParts.map(element=>element.animate([{opacity:1},{opacity:0}],{duration:1800,easing:'cubic-bezier(.45,0,.55,1)',fill:'forwards'}));
 await Promise.all(departures.map(animation=>animation.finished));
 document.documentElement.classList.add('collection-pending');document.documentElement.classList.remove('collection-revealing');
 entryStage.hidden=false;dialog.querySelector('[data-editions]').disabled=false;
 
 showView('choices');if(!dialog.open)dialog.show();glideTo(entryStage);departures.forEach(animation=>animation.cancel());returningChoices=false;dialog.querySelector('[data-editions]').focus({preventScroll:true});
},true);
dialog.querySelector('[data-originals]').onclick=()=>showView('preview');
dialog.querySelector('.choice-attend').onclick=()=>showView('original');
dialog.querySelector('.choice-interest').onclick=()=>{if(!form.elements.message.value)form.elements.message.value=copy[lang()].defaultMessage;showView('form');};
dialog.querySelector('.choice-back').onclick=()=>showView(view==='form'?'original':view==='original'?'preview':'choices');
dialog.addEventListener('cancel',event=>{event.preventDefault();if(view!=='choices')showView(view==='form'?'original':view==='original'?'preview':'choices');});
dialog.addEventListener('close',()=>{returnFocus?.focus({preventScroll:true});});
form.addEventListener('submit',async event=>{event.preventDefault();if(pending||!form.reportValidity())return;const data=new FormData(form);data.set('artwork',work.title+' — original artwork');data.set('request_type','Acquisition enquiry and proposed offer');data.set('_subject','Acquisition enquiry: '+work.title+' — Original');data.set('_replyto',String(data.get('email')||''));data.set('language',lang());pending=true;failed=false;submit.disabled=true;translate();try{const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'}});if(!response.ok)throw new Error('Submission failed');sent=true;form.hidden=true;}catch{failed=true;}finally{pending=false;submit.disabled=false;translate();}});
// The collection curtain is in the document from the beginning: no observer,
// scroll lock, top-layer swap, or second scroll container at its threshold.
function maybeOpen(){}
shown=true;dialog.show();
new MutationObserver(()=>{translate();requestAnimationFrame(maybeOpen);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
translate();
if(location.hash==='#collection')requestAnimationFrame(()=>entryStage.scrollIntoView({behavior:'instant'}));

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
