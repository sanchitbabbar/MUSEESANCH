(() => {
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const ease='cubic-bezier(.22,1,.36,1)';
 // Always restore the visible base, even if an animation is interrupted or unavailable.
 async function animate(element,frames,duration=650){
  if(!element||reduced())return;
  let animation,timer;
  try{
   animation=element.animate(frames,{duration,easing:ease});
   await Promise.race([animation.finished.catch(()=>{}),new Promise(resolve=>{timer=setTimeout(resolve,duration+120);})]);
  }catch{}finally{clearTimeout(timer);animation?.cancel();}
 }
 const closing=new WeakSet();
 async function close(dialog){
  if(!dialog?.open||closing.has(dialog))return;
  closing.add(dialog);dialog.classList.add('museum-dialog-leaving');
  try{await animate(dialog,[{opacity:1},{opacity:0}],550);if(dialog.open)dialog.close();}
  finally{dialog.classList.remove('museum-dialog-leaving');closing.delete(dialog);}
 }
 async function swap(outgoing,update,incoming=()=>outgoing){
  await animate(outgoing,[{opacity:1},{opacity:0}],280);
  update();
  await animate(incoming(),[{opacity:0},{opacity:1}],650);
 }
 const changingDetails=new WeakSet();
 async function disclose(details){
  if(changingDetails.has(details))return;
  const content=Array.from(details.children).find(child=>child.tagName!=='SUMMARY');
  if(!content){details.open=!details.open;return;}
  changingDetails.add(details);const opening=!details.open,overflow=content.style.overflow;
  try{
   if(opening)details.open=true;
   const height=content.scrollHeight+'px';content.style.overflow='hidden';
   await animate(content,opening?[{height:'0px',opacity:0},{height,opacity:1}]:[{height,opacity:1},{height:'0px',opacity:0}],550);
   if(!opening)details.open=false;
  }finally{content.style.overflow=overflow;changingDetails.delete(details);}
 }
 let navigating=false,pageAnimation;
 function reset(){navigating=false;pageAnimation?.cancel();pageAnimation=undefined;document.body.classList.remove('museum-page-arriving');}
 async function navigate(url,replace=false){
  if(navigating)return;navigating=true;
  try{
   if(!reduced()){
    pageAnimation=document.body.animate([{opacity:1},{opacity:0}],{duration:420,easing:ease,fill:'forwards'});
    await Promise.race([pageAnimation.finished.catch(()=>{}),new Promise(resolve=>setTimeout(resolve,540))]);
   }
  }catch{}
  // Keep navigation functional even when animation is unsupported or cancelled.
  if(replace)location.replace(url);else location.assign(url);
  setTimeout(reset,1800);
 }
 window.museeMotion={animate,close,swap,navigate,disclose};
 document.documentElement.classList.add('museum-motion-ready');
 document.body.classList.add('museum-page-arriving');
 document.body.addEventListener('animationend',event=>{if(event.animationName==='museum-page-arrive')document.body.classList.remove('museum-page-arriving');});
 addEventListener('pageshow',event=>{if(event.persisted){reset();document.body.classList.add('museum-page-arriving');}});
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const summary=event.target.closest?.('summary');
  if(summary?.parentElement?.tagName==='DETAILS'){event.preventDefault();disclose(summary.parentElement);return;}
  const link=event.target.closest?.('a[href]');
  if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const url=new URL(link.href,location.href),current=new URL(location.href);
  if(url.origin!==current.origin||!/^https?:$/.test(url.protocol))return;
  if(url.pathname===current.pathname&&url.search===current.search)return;
  event.preventDefault();navigate(url.href);
 });
})();
