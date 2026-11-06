const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../collection-choice.js'),'utf8');
const navigation=source.slice(source.indexOf('function showView(next){'),source.indexOf('async function revealEditions(){'));
for(const api of ['missing','cancelled','running'])test(`Originals appears immediately with ${api} animation support`,()=>{
 const classes=new Set();const root={style:{scrollBehavior:'smooth'}};let scrolled=false,focused=false;
 const sheet={classList:{add:c=>classes.add(c),remove:(...values)=>values.forEach(v=>classes.delete(v))},inert:true,offsetWidth:352};
 if(api!=='missing')sheet.getAnimations=()=>[{cancel(){if(api==='cancelled')throw Error('cancelled animation');}}];
 const context=vm.createContext({sheet,document:{documentElement:root},entryStage:{scrollIntoView(options){assert.equal(options.behavior,'auto');assert.equal(root.style.scrollBehavior,'auto');scrolled=true;}},dialog:{querySelector:()=>({focus(){focused=true;}})},cancelGlide(){},reducedMotion:()=>false});
 vm.runInContext('let changingView=false,view="choices";function applyView(next){view=next;}\n'+navigation,context);
 for(const next of ['preview','original','form','original','preview','choices','preview']){
  const result=vm.runInContext(`showView('${next}')`,context);
  assert.equal(result,undefined,'navigation must not wait on a fade promise');
  assert.equal(vm.runInContext('view',context),next);
  assert.equal(sheet.inert,false);assert.equal(root.style.scrollBehavior,'smooth');
 }
 assert.equal(scrolled,true);assert.equal(focused,true);
});
