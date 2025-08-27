const API = 'http://localhost:4000';
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

if(!token) window.location.href = 'login.html';
document.getElementById('me').textContent = username;


document.getElementById('btn-logout').onclick = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'login.html';
}


const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const titleInput = document.getElementById('title');
const descInput = document.getElementById('description');
const gallery = document.getElementById('gallery');
const countSpan = document.getElementById('count');
const emptyMsg = document.getElementById('emptyMsg');
const modal = document.getElementById('modal');
const modalVideo = document.getElementById('modalVideo');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const closeModal = document.getElementById('closeModal');

uploadForm.addEventListener('submit', async e => {
  e.preventDefault();
  const file = fileInput.files[0];
  if(!file){ alert('Escolha um arquivo'); return; }

  const formData = new FormData();
  formData.append('media', file); // Nome do campo esperado pelo backend
  formData.append('title', titleInput.value);
  formData.append('description', descInput.value);

  try {
    const res = await fetch(`${API}/media/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if(res.ok){
      titleInput.value=''; descInput.value=''; fileInput.value='';
      await renderGallery();
    } else {
      alert(data.message || 'Erro no upload');
    }
  } catch(err){
    alert('Erro ao conectar com o servidor');
    console.error(err);
  }
});


closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  modalVideo.pause();
  modalVideo.src = '';
  modalImage.src='';
});


async function renderGallery(){
  try {
    const res = await fetch(`${API}/media/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const items = await res.json();
    gallery.innerHTML='';
    countSpan.textContent = items.length;
    emptyMsg.style.display = items.length ? 'none' : 'block';
    const tpl = document.getElementById('cardTpl');

    items.forEach(item => {
      const el = tpl.content.cloneNode(true);
      const img = el.querySelector('img');
      const video = el.querySelector('video');
      const h4 = el.querySelector('h4');
      const p = el.querySelector('p');

      h4.textContent = item.title;
      p.textContent = item.description;

      const fileURL = `${API}/media/download/${item.id}`;

      if(item.type==='image'){
        img.src = fileURL;
        img.classList.remove('hidden');
      } else {
        video.src = fileURL;
        video.classList.remove('hidden');
      }

      el.querySelector('div.bg-slate-800').onclick = () => openModal(item, fileURL);
      gallery.appendChild(el);
    });
  } catch(err){
    alert('Erro ao carregar galeria');
    console.error(err);
  }
}

function openModal(item, url){
  modal.classList.remove('hidden');
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.description;
  if(item.type==='image'){
    modalImage.src = url;
    modalImage.classList.remove('hidden');
    modalVideo.classList.add('hidden');
  } else {
    modalVideo.src = url;
    modalVideo.classList.remove('hidden');
    modalImage.classList.add('hidden');
  }
}


renderGallery();
