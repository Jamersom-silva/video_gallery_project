// Substitua pela URL do seu backend no Render
const API = 'https://video-gallery-project-1.onrender.com';
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
  formData.append('file', file);
  formData.append('title', titleInput.value);

  try {
    const res = await fetch(`${API}/media/upload`, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${token}`},
      body: formData
    });
    const data = await res.json();
    if(data.success){
      titleInput.value=''; fileInput.value='';
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
    const res = await fetch(`${API}/media/list`, { headers: {'Authorization': `Bearer ${token}`} });
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
      p.textContent = '';

      if(item.type==='image'){
        img.src = item.url;
        img.classList.remove('hidden');
      } else {
        video.src = item.url;
        video.classList.remove('hidden');
      }

      const downloadBtn = document.createElement('button');
      downloadBtn.textContent = 'Baixar';
      downloadBtn.className = 'mt-2 bg-blue-500 px-3 py-1 rounded text-sm';
      downloadBtn.onclick = (e) => {
        e.stopPropagation();
        window.open(`${API}/media/download/${item.id}?token=${token}`, '_blank');
      };
      el.querySelector('.p-3').appendChild(downloadBtn);

      el.querySelector('div.bg-slate-800').onclick = () => openModal(item);

      gallery.appendChild(el);
    });
  } catch(err){
    alert('Erro ao carregar galeria');
    console.error(err);
  }
}

function openModal(item){
  modal.classList.remove('hidden');
  modalTitle.textContent = item.title;
  modalDesc.textContent = '';
  if(item.type==='image'){
    modalImage.src = item.url;
    modalImage.classList.remove('hidden');
    modalVideo.classList.add('hidden');
  } else {
    modalVideo.src = item.url;
    modalVideo.classList.remove('hidden');
    modalImage.classList.add('hidden');
  }
}

renderGallery();
