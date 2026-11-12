// Chat UI helpers: open/close panel, unread badge, pop-up toast for new messages.
(function(){
  const box=document.getElementById('chat-container');
  const list=document.getElementById('lista-mensajes');
  const badge=document.getElementById('chat-badge');
  const toast=document.getElementById('chat-toast');
  let unread=0,prev=null,timer=null;

  function open(v){
    box.classList.toggle('open',v);
    if(v){unread=0;badge.style.display='none';toast.classList.remove('show');
      list.scrollTop=list.scrollHeight;document.getElementById('inputChat').focus();}
  }
  document.getElementById('chat-fab').onclick=()=>open(!box.classList.contains('open'));
  document.getElementById('chat-close').onclick=()=>open(false);
  toast.onclick=()=>open(true);

  new MutationObserver(()=>{
    const n=list.children.length;
    if(prev===null){prev=n;return;}
    if(n>prev){
      const last=list.lastElementChild;
      const mine=last.textContent.trim().startsWith('TÚ');
      if(!mine&&!box.classList.contains('open')){
        unread+=n-prev;badge.textContent=unread;badge.style.display='block';
        toast.textContent='💬 '+last.textContent;toast.classList.add('show');
        clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),4000);
      }
    }
    prev=n;
  }).observe(list,{childList:true});
})();

// Safer chat: escapes HTML before sending, so nobody can break the page with <tags>.
// This replaces enviarMensaje() from app.js (ui.js is loaded after it).
function enviarMensaje() {
  const input = document.getElementById("inputChat");
  let texto = input.value.trim().slice(0, 200);
  if (!texto || !partidaId) return;
  texto = texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  db.ref(`partidas/${partidaId}/mensajes`).push({
    autor: jugadorId,
    texto: texto,
    timestamp: Date.now()
  });
  input.value = "";
}
