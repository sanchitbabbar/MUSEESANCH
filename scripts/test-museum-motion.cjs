const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(reduced=false){
 const classes=new Set();const handlers={};
 const context={window:{},matchMedia:()=>({matches:reduced}),setTimeout,clearTimeout,URL,
  location:{href:'https://museesanch.com/artworks',assign(){},replace(){}},
  document:{body:{classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},addEventListener(){}},documentElement:{classList:{add(){}}},addEventListener:(name,fn)=>handlers[name]=fn},addEventListener:(name,fn)=>handlers[name]=fn};
 vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../museum-motion.js'),'utf8'),context);
 return {motion:context.window.museeMotion,handlers,classes};
}
test('cancelled and unavailable animations still complete the screen change',async()=>{
 for(const behavior of ['cancelled','unavailable']){
  const {motion}=setup();let updates=0,cancelled=0;
  const element={animate(){if(behavior==='unavailable')throw Error('unavailable');return {finished:Promise.reject(Error('cancelled')),cancel(){cancelled++;}};}};
  await motion.swap(element,()=>updates++);
  assert.equal(updates,1);if(behavior==='cancelled')assert.equal(cancelled,2);
 }
});
test('stalled animations time out and release their visual state',async()=>{
 const {motion}=setup();let cancelled=false;
 await motion.animate({animate:()=>({finished:new Promise(()=>{}),cancel(){cancelled=true;}})},[],1);
 assert.equal(cancelled,true);
});
test('repeated close presses close a dialog once and clear its closing class',async()=>{
 const {motion}=setup();const classes=new Set();let closes=0,finish;
 const dialog={open:true,classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},animate:()=>({finished:new Promise(r=>finish=r),cancel(){}}),close(){closes++;this.open=false;}};
 const first=motion.close(dialog);await motion.close(dialog);finish();await first;
 assert.equal(closes,1);assert.equal(classes.size,0);
});
test('reduced motion changes content and closes dialogs without animation',async()=>{
 const {motion}=setup(true);let updated=false,closed=false;
 const element={open:true,classList:{add(){},remove(){}},animate(){throw Error('should not animate');},close(){closed=true;}};
 await motion.swap(element,()=>updated=true);await motion.close(element);
 assert.equal(updated,true);assert.equal(closed,true);
});
test('initial page arrival is not cut short by the first pageshow event',()=>{
 const {handlers,classes}=setup();handlers.pageshow({persisted:false});assert.equal(classes.has('museum-page-arriving'),true);
});

test('legal contents expand and collapse without leaving clipped content',async()=>{
 const {motion}=setup(true);const content={style:{overflow:'visible'},scrollHeight:120,tagName:'NAV'};
 const details={open:false,children:[{tagName:'SUMMARY'},content]};
 await motion.disclose(details);assert.equal(details.open,true);assert.equal(content.style.overflow,'visible');
 await motion.disclose(details);assert.equal(details.open,false);assert.equal(content.style.overflow,'visible');
});
