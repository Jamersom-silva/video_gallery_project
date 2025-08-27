
const API = 'https://video-gallery-project-1.onrender.com';

const loginForm = document.getElementById('loginForm');
const msg = document.getElementById('msg');

loginForm.addEventListener('submit', async e => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!data.success) {
      msg.textContent = data.message;
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    window.location.href = 'index.html';
  } catch (err) {
    msg.textContent = 'Erro ao conectar ao servidor';
  }
});
