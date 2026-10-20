(() => {
 const section=document.querySelector('.collection-prologue');if(!section)return;
 const copy=section.querySelector('.prologue-copy'),left=section.querySelector('.prologue-art-left'),right=section.querySelector('.prologue-art-right'),hint=section.querySelector('.prologue-scroll');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let ticking=false;
 function render(){ticking=false;if(reduced.matches){for(const el of [copy,left,right,hint]){el.style.removeProperty('transform');el.style.removeProperty('opacity');}return;}
 const rect=section.getBoundingClientRect();const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,section.offsetHeight-innerHeight)));
 const mobile=innerWidth<=700;
 copy.style.transform=`translateY(${-progress*65}px)`;copy.style.opacity=String(1-Math.max(0,progress-.35)/.65);
 left.style.transform=`translate(${-progress*110}px,${-progress*50}px) rotate(${-9-progress*6}deg)`;
 right.style.transform=`translate(${progress*110}px,${-progress*90}px) rotate(${9+progress*6}deg)`;
 left.style.opacity=right.style.opacity=String((mobile?.3:1)*(1-progress*.75));hint.style.opacity=String(Math.max(0,1-progress*4));}
 function queue(){if(!ticking){ticking=true;requestAnimationFrame(render);}}
 addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);reduced.addEventListener('change',queue);render();
 const translations={fr:{kicker:'La collection',title:["Là où le cœur s'épanouit :","l'origine délicate du masculin et du féminin."],description:'Découvrez les œuvres de Sanchit Babbar, en éditions limitées, signées et numérotées.',note:'',scroll:'Scroll'},en:{kicker:'The collection',title:['Where the heart unfolds,','the silken origin of masculine and feminine.'],description:'Discover works by Sanchit Babbar in signed, numbered limited editions.',note:'',scroll:'Scroll'}};
 function translate(){const t=translations[document.documentElement.lang==='en'?'en':'fr'];for(const key of ['kicker','description','note'])section.querySelector('[data-prologue="'+key+'"]').textContent=t[key];const h=section.querySelector('[data-prologue="title"]');h.replaceChildren(document.createTextNode(t.title[0]),document.createElement('br'),document.createTextNode(t.title[1]));section.querySelector('[data-prologue="note"]').hidden=!t.note;hint.firstChild.textContent=t.scroll;}
 new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});translate();
})();
