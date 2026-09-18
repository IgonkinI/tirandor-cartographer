// ---------- modal/util ----------
function showModal(html){closeModal();const back=document.createElement('div');back.className='modal-backdrop';back.id='modalRoot';back.innerHTML=html;document.body.appendChild(back);back.addEventListener('pointerdown',e=>{if(e.target===back)closeModal()});back.querySelectorAll('.modal-close').forEach(x=>x.onclick=closeModal)}
function closeModal(){document.querySelector('#modalRoot')?.remove()}
let toastTimer;function toast(text){document.querySelector('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.remove(),1800)}
function $(q,root=document){return root.querySelector(q)} function $$(q,root=document){return [...root.querySelectorAll(q)]}

// ---------- bootstrap ----------
window.addEventListener('unhandledrejection',e=>{console.error(e.reason);toast('Ошибка: '+(e.reason?.message||'неизвестная'))})
renderHome()

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) { window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {})) }
