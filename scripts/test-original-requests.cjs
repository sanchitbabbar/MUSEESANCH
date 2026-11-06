const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const source=readFileSync(require('node:path').join(__dirname,'../collection-choice.js'),'utf8');
function setup(){
 const callbacks={};const buttons=[{},{},{}];let resolve;
 const form={hidden:false,action:'https://formspree.io/f/mrpgkojw',elements:{message:{value:''}},reset(){this.elements.message.value='';},reportValidity:()=>true,addEventListener:(name,fn)=>callbacks[name]=fn};
 const context=vm.createContext({form,buttons,callbacks,submit:{disabled:false},preview:{querySelectorAll:()=>buttons},FormData:class extends Map{constructor(){super();this.set('email','test@example.com');}},fetch:()=>new Promise(r=>resolve=r),location:{hostname:'museesanch.com'},lang:()=> 'en',translate:()=>{},showView:()=>{},changingView:false,acquisitionWorks:[{title:'Celle qui se connaît'},{title:'Deepa'},{title:'Instar'}]});
 vm.runInContext(`let pending=false,sent=false,failed=false,work=acquisitionWorks[0];`+source.slice(source.indexOf('let requestRevision=0;'),source.indexOf('let returningIntro=false;'))+'\n'+source.split('\n').find(l=>l.startsWith("preview.querySelectorAll('.choice-attend').forEach((button,index)=>button.onclick="))+'\n'+source.split('\n').find(l=>l.startsWith("form.addEventListener('submit',async event=>")),context);
 return {context,form,buttons,send:()=>callbacks.submit({preventDefault(){}}),complete:()=>resolve({ok:true,json:async()=>({ok:true})}),state:()=>vm.runInContext('({pending,sent,failed,title:work.title})',context)};
}
test('each subsequent original opens a fresh form after a successful request',async()=>{
 const h=setup();
 for(let index=0;index<3;index++){
  h.buttons[index].onclick();assert.equal(h.form.hidden,false);assert.equal(h.state().sent,false);assert.equal(h.form.elements.message.value,'');
  const request=h.send();h.complete();await request;assert.equal(h.form.hidden,true);assert.equal(h.state().sent,true);
 }
});
test('a previous response cannot hide the next artwork request form',async()=>{
 const h=setup();const first=h.send();h.buttons[1].onclick();h.complete();await first;
 assert.equal(h.state().title,'Deepa');assert.equal(h.form.hidden,false);assert.equal(h.state().sent,false);assert.equal(h.state().pending,false);
 const second=h.send();h.complete();await second;assert.equal(h.state().sent,true);
});
