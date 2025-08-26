const API = 'http://localhost:4000';
let token = localStorage.getItem('token');

function byId(id){ return document.getElementById(id); }

function logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}

// Upload
byId('btn-upload').onclick = async () => {
  const file = byId('file').files[0];
  if(!file) return alert('Selecione um arquivo');
  const fd = new FormData();
  fd.append('media', file);

  const res = await fetch(API + '/media/upload', {
    method:'POST', headers:{ 'Authorization':'Bearer ' + token }, body: fd
  });
  const data = await res.json();
  alert(data.message || 'Erro');
  loadList();
};

// Load gallery
async function loadList(){
  const res = await fetch(API + '/media/list', { headers:{ 'Authorization':'Bearer '+token }});
  const mediasDiv = byId('medias');
  mediasDiv.innerHTML = '';
  const list = await res.json();
  list.forEach(m=>{
    const div = document.createElement('div');
    const a = document.createElement('a');
    a.href = API + '/uploads/' + m.user_id + '/' + m.filename;
    a.textContent = m.originalname;
    a.target = '_blank';
    div.appendChild(a);
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = async ()=>{
      const res = await fetch(API + '/media/' + m.id, { method:'DELETE', headers:{ 'Authorization':'Bearer '+token }});
      const d = await res.json();
      alert(d.message || 'Erro');
      loadList();
    };
    div.appendChild(btn);
    mediasDiv.appendChild(div);
  });
}

if(!token) window.location.href = 'login.html';
window.onload = loadList;
byId('btn-logout').onclick = logout;
