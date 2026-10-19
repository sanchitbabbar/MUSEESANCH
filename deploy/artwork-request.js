(() => {
const panel=document.getElementById('request-preview'),form=document.getElementById('request-form'),button=document.getElementById('open-request'),submit=document.getElementById('send-request'),status=document.getElementById('request-note');
let pending=false,revision=0;
const copy={fr:{title:'Formuler une demande',name:'Nom complet',email:'Adresse e-mail',message:'Votre message',submit:'ENVOYER MA DEMANDE',sending:'ENVOI…',privacy:'Vos coordonnées sont transmises via Formspree pour répondre à votre demande.',policy:'Confidentialité',success:'Votre demande a bien été envoyée. Nous vous contacterons prochainement.',error:'Votre demande n’a pas pu être confirmée. Réessayez ou contactez contact@studiosanch.com.'},en:{title:'Place a request',name:'Full Name',email:'Email Address',message:'Your Message',submit:'PLACE YOUR REQUEST',sending:'SENDING…',privacy:'Your details are sent through Formspree so we can respond to your enquiry.',policy:'Privacy',success:'Your request has been sent. We will contact you shortly.',error:'Your request could not be confirmed. Please try again or contact contact@studiosanch.com.'}};
const lang=()=>document.documentElement.lang==='en'?'en':'fr';
let outcome='';
function translate(){const c=copy[lang()];button.textContent=document.getElementById('request-heading').textContent=c.title;for(const key of ['name','email','message'])panel.querySelector('[data-label='+key+']').textContent=c[key];submit.textContent=pending?c.sending:c.submit;status.textContent=outcome?c[outcome]:'';document.getElementById('request-privacy-text').textContent=c.privacy;const link=document.getElementById('request-policy');link.textContent=c.policy;link.href=lang()==='fr'?'./privacy-policy.html':'./privacy-policy-en.html';}
button.addEventListener('click',()=>{translate();panel.hidden=false;button.hidden=true;const title=document.getElementById('detail-title').textContent;form.elements.message.value=lang()==='en'?`I would like to enquire about “${title}”.`:`Je souhaite recevoir des informations sur l’œuvre « ${title} ».`;form.elements.name.focus();});
window.addEventListener('musee:artwork-selected',()=>{revision++;panel.hidden=true;button.hidden=false;form.hidden=false;form.reset();outcome='';translate();});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(pending||!form.reportValidity())return;
 const current=revision;const title=document.getElementById('detail-title').textContent;const price=document.getElementById('detail-price').textContent;
 const payload=new FormData(form);payload.append('artwork',title);payload.append('product',title);payload.append('price_from',price);payload.append('website','museesanch.com');payload.append('request_type','Artwork enquiry');payload.append('_subject','Musée Sanch — Artwork request: '+title);payload.append('_replyto',form.elements.email.value.trim());
 pending=true;outcome='';submit.disabled=true;form.setAttribute('aria-busy','true');translate();
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetch(form.action,{method:'POST',body:payload,headers:{Accept:'application/json'},signal:controller.signal});if(!response.ok)throw Error('Rejected');const data=await response.json();if(data.ok!==true)throw Error('Unconfirmed');if(current===revision){outcome='success';form.reset();form.hidden=true;}}
 catch{if(current===revision)outcome='error';}
 finally{clearTimeout(timeout);pending=false;submit.disabled=false;form.removeAttribute('aria-busy');translate();}
});
new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
})();
