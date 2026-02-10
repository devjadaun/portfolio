/* TYPING EFFECT */
const words=["Full Stack Developer","Python • Flask • JavaScript","Building Real Projects"];
let i=0,j=0,cur="",del=false;

function type(){
  const el=document.getElementById("typing");
  if(!el)return;

  if(!del && j<=words[i].length) cur=words[i].substring(0,j++);
  if(del && j>=0) cur=words[i].substring(0,j--);

  el.textContent=cur;

  if(j===words[i].length) del=true;
  if(j===0 && del){del=false;i=(i+1)%words.length;}

  setTimeout(type,del?60:120);
}
setTimeout(type,600);
