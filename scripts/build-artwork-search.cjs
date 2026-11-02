const fs=require('fs'),path=require('path');
module.exports=function(root,out){
const source=fs.readFileSync(path.join(root,'gallery.js'),'utf8');
const designs=JSON.parse(source.match(/^const designs = (\[.*\]);/m)[1]);
const template=fs.readFileSync(path.join(root,'artworks.html'),'utf8');
const origin='https://www.museesanch.com',urls=[];
const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
for(const work of designs)for(const lang of ['en','fr']){
 const url=origin+'/artworks/'+lang+'/'+work.id+'.html';urls.push(url);
 const en=origin+'/artworks/en/'+work.id+'.html',fr=origin+'/artworks/fr/'+work.id+'.html';
 const description=lang==='fr'?work.descriptionFr:work.descriptionEn;
 const title=work.title+' — '+(lang==='fr'?'Art et poésie':'Art and poetry')+' | MUSÉE SANCH';
 const image=new URL(work.image,origin).href;
 const schema={'@context':'https://schema.org','@type':'VisualArtwork','@id':url+'#artwork',url,name:work.title,description,image,dateCreated:work.year,inLanguage:lang,creator:{'@type':'Person','@id':'https://sanchitbabbar.com/#person',name:'Sanchit Babbar',url:'https://sanchitbabbar.com/'}};
 let html=template.replace('<head>','<head><base href="/">').replace('<html lang="fr">','<html lang="'+lang+'">');
 html=html.replace(/<title>.*?<\/title>/,'<title>'+esc(title)+'</title>');
 html=html.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+esc(description)+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+url+'">');
 for(const [property,value]of Object.entries({'og:title':title,'og:description':description,'og:url':url,'og:image':image}))html=html.replace(new RegExp('<meta property="'+property+'" content="[^"]*">'),'<meta property="'+property+'" content="'+esc(value)+'">');
 html=html.replace('</head>','<link rel="alternate" hreflang="en" href="'+en+'"><link rel="alternate" hreflang="fr" href="'+fr+'"><link rel="alternate" hreflang="x-default" href="'+en+'"><script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script></head>');
 html=html.replace('<dialog id="artwork-detail"','<dialog open id="artwork-detail"');
 html=html.replace('<img id="detail-image" alt="">','<img id="detail-image" src="'+work.image+'" alt="'+esc(work.title)+'">');
 for(const [id,value]of Object.entries({'detail-title':work.title,'detail-description':description,'detail-year':work.year,'detail-price':(lang==='fr'?'À partir de €':'From €')+work.basePrice,'detail-sizes':work.sizes.map(s=>s.dimensions).join(' · ')}))html=html.replace(new RegExp('(<[^>]+id="'+id+'"[^>]*>).*?(<\\/[^>]+>)'),(_,a,b)=>a+esc(value)+b);
 // Reuse the real collection's viewer and enquiry form, not a separate design.
 html=html.replace('</body>','<script src="/artwork-search-entry.js" data-artwork="'+work.id+'" data-language="'+lang+'"></script></body>');
 const file=path.join(out,'artworks',lang,work.id+'.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);
}
fs.writeFileSync(path.join(out,'artwork-search-entry.js'),`(function(){const script=document.currentScript,id=script.dataset.artwork,lang=script.dataset.language;document.documentElement.lang=lang;window.addEventListener('load',()=>{window.dispatchEvent(new CustomEvent('musee:language',{detail:lang}));const workIndex=designs.findIndex(w=>w.id===id);const dialog=document.getElementById('artwork-detail');if(dialog.open)dialog.close();const card=document.querySelectorAll('.artwork-card')[workIndex];if(card)card.click();});})();`);
const imageEntries=designs.flatMap(work=>['en','fr'].map(lang=>'<url><loc>'+origin+'/artworks/'+lang+'/'+work.id+'.html</loc><image:image><image:loc>'+esc(new URL(work.image,origin).href)+'</image:loc><image:title>'+esc(work.title)+'</image:title></image:image></url>')).join('');
fs.writeFileSync(path.join(out,'image-sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+imageEntries+'</urlset>');
let sitemap=fs.readFileSync(path.join(out,'sitemap.xml'),'utf8');sitemap=sitemap.replace('</urlset>',designs.map(work=>'<url><loc>'+origin+'/artworks/en/'+work.id+'.html</loc></url><url><loc>'+origin+'/artworks/fr/'+work.id+'.html</loc></url>').join('')+'</urlset>');fs.writeFileSync(path.join(out,'sitemap.xml'),sitemap);
fs.appendFileSync(path.join(out,'robots.txt'),'\nSitemap: '+origin+'/image-sitemap.xml\n');
return [...urls.map(url=>url.replace(origin,'')),'/artwork-search-entry.js','/image-sitemap.xml'];
};