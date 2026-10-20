(() => {
const panel=document.getElementById('request-preview'),form=document.getElementById('request-form'),button=document.getElementById('open-request'),submit=document.getElementById('send-request'),status=document.getElementById('request-note');
let pending=false,revision=0,successTimer;
const requestDialog=document.createElement('dialog');
requestDialog.className='request-dialog';
requestDialog.setAttribute('aria-labelledby','request-heading');
const closeRequest=document.createElement('button');
closeRequest.type='button';closeRequest.className='request-dialog-close';
closeRequest.textContent='×';
requestDialog.append(closeRequest,panel);document.body.append(requestDialog);
button.setAttribute('aria-controls','request-preview');button.setAttribute('aria-expanded','false');
function restoreRequest(){
 clearTimeout(successTimer);
 panel.hidden=true;button.hidden=false;
 button.setAttribute('aria-expanded','false');
 if(document.getElementById('artwork-detail').open)button.focus({preventScroll:true});
}
closeRequest.addEventListener('click',()=>requestDialog.close());
requestDialog.addEventListener('close',restoreRequest);
requestDialog.addEventListener('click',event=>{
 if(event.target!==requestDialog)return;
 const box=requestDialog.getBoundingClientRect();
 if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)requestDialog.close();
});
// Keep feedback visible after a successful submission hides the fields.
form.after(status);
const successPanel=document.createElement('div');
successPanel.className='request-success';successPanel.hidden=true;
successPanel.setAttribute('role','status');successPanel.setAttribute('aria-live','polite');
successPanel.tabIndex=-1;status.after(successPanel);


const copy={fr:{title:'Formuler une demande',name:'Nom complet',email:'Adresse e-mail',message:'Votre message',submit:'ENVOYER MA DEMANDE',sending:'ENVOI…',privacy:'Vos coordonnées sont transmises via Formspree pour répondre à votre demande.',policy:'Confidentialité',success:'Message envoyé avec succès.',followup:'Nous vous contacterons prochainement.',error:'Votre demande n’a pas pu être confirmée. Réessayez ou contactez contact@studiosanch.com.'},en:{title:'Place a request',name:'Full Name',email:'Email Address',message:'Your Message',submit:'PLACE YOUR REQUEST',sending:'SENDING…',privacy:'Your details are sent through Formspree so we can respond to your enquiry.',policy:'Privacy',success:'Message sent successfully.',followup:'We will contact you shortly.',error:'Your request could not be confirmed. Please try again or contact contact@studiosanch.com.'}};
const lang=()=>document.documentElement.lang==='en'?'en':'fr';
let outcome='';
function renderStatus(c){
 status.replaceChildren();successPanel.replaceChildren();successPanel.hidden=outcome!=='success';
 if(outcome!=='success'){status.textContent=outcome?c[outcome]:'';return;}
 const mark=document.createElement('span');mark.className='request-success-mark';mark.setAttribute('aria-hidden','true');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M5 13l4 4L19 7');
 svg.append(path);mark.append(svg);
 const title=document.createElement('span');title.className='request-success-title';title.textContent=c.success;
 const followup=document.createElement('span');followup.className='request-success-followup';followup.textContent=c.followup;
 successPanel.append(mark,title,followup);
}

function translate(){const c=copy[lang()];closeRequest.setAttribute('aria-label',lang()==='fr'?'Fermer le formulaire':'Close request form');button.textContent=document.getElementById('request-heading').textContent=c.title;for(const key of ['name','email','message']){panel.querySelector('[data-label='+key+']').textContent=c[key];form.elements[key].placeholder=c[key];}submit.textContent=pending?c.sending:c.submit;renderStatus(c);document.getElementById('request-privacy-text').textContent=c.privacy;const link=document.getElementById('request-policy');link.textContent=c.policy;link.href=lang()==='fr'?'./privacy-policy.html':'./privacy-policy-en.html';}
button.addEventListener('click',()=>{
 clearTimeout(successTimer);if(outcome==='success'){outcome='';form.hidden=false;}
 translate();panel.hidden=false;button.setAttribute('aria-expanded','true');
 const title=document.getElementById('detail-title').textContent;
 if(!form.elements.message.value)form.elements.message.value=lang()==='en'?`I would like to enquire about “${title}”.`:`Je souhaite recevoir des informations sur l’œuvre « ${title} ».`;
 requestDialog.showModal();requestDialog.scrollTop=0;
 const heading=document.getElementById('request-heading');heading.tabIndex=-1;heading.focus({preventScroll:true});
});
window.addEventListener('musee:artwork-selected',()=>{revision++;clearTimeout(successTimer);button.setAttribute('aria-expanded','false');if(requestDialog.open)requestDialog.close();panel.hidden=true;button.hidden=false;form.hidden=false;form.reset();outcome='';translate();});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(pending||!form.reportValidity())return;
 const current=revision;const title=document.getElementById('detail-title').textContent;const price=document.getElementById('detail-price').textContent;
 const payload=new FormData(form);payload.append('artwork',title);payload.append('product',title);payload.append('price_from',price);payload.append('website','museesanch.com');payload.append('request_type','Artwork enquiry');payload.append('_subject','Musée Sanch — Artwork request: '+title);payload.append('_replyto',form.elements.email.value.trim());
 pending=true;outcome='';submit.disabled=true;form.setAttribute('aria-busy','true');translate();
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetch(form.action,{method:'POST',body:payload,headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok)throw Error('Rejected');const data=await response.json();if(data.ok!==true)throw Error('Unconfirmed');if(current===revision){outcome='success';form.reset();form.hidden=true;
 renderStatus(copy[lang()]);successPanel.focus({preventScroll:true});
 successTimer=setTimeout(()=>{if(current!==revision)return;if(requestDialog.open)requestDialog.close();else restoreRequest();},5000);
}}
 catch{if(current===revision)outcome='error';}
 finally{clearTimeout(timeout);pending=false;submit.disabled=false;form.removeAttribute('aria-busy');translate();}
});
new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
})();

(() => { const notes={"en": ["All prints are shipped unframed and include a certificate of authenticity", "Archival-Grade Framing is available upon request.", "Effective September 1, 2026, Sanchit Babbar’s original works, artistic services and personalized creations have been presented and offered through Studio Sanch. Each enquiry is entrusted to the relevant department.", "Sales are concluded and invoiced by Studio Sanch.", "Fine art print: A numbered, limited-edition work, custom-printed, hand-signed, and inscribed with a personalized poetic dedication on the reverse. Pursuant to Article L.221-28 of the French Consumer Code, this bespoke creation is permanently excluded from the right of withdrawal, exchange, or refund.", "Shipments within and outside France will incur additional delivery charges based on current FedEx rates."], "fr": ["Tous les tirages sont livrés sans cadre et accompagnés d’un certificat d’authenticité.", "L’encadrement de qualité musée est disponible sur demande.", "Depuis le 1er septembre 2026, les œuvres originales, les prestations artistiques et les créations personnalisées de Sanchit Babbar sont présentées et proposées par Studio Sanch. Chaque demande est confiée au service concerné.", "Les ventes sont conclues et facturées par Studio Sanch.", "Tirage d’art : Édition limitée et numérotée, imprimée sur commande, signée à la main et parée d’une dédicace poétique nominative au dos. Conformément à l’article L.221-28 du Code de la consommation, cette œuvre personnalisée est définitivement exclue du droit de rétractation, d’échange ou de remboursement.", "Les expéditions en France et à l’étranger entraînent des frais de livraison supplémentaires selon les tarifs FedEx en vigueur."]};function render(){const container=document.getElementById('artwork-purchase-notes');if(!container)return;container.replaceChildren(...notes[document.documentElement.lang==='en'?'en':'fr'].map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));}new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();})();
