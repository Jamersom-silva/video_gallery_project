const API = 'http://localhost:4000'; // backend

// Registrar
document.getElementById('btn-register').onclick = async () => {
  const username = document.getElementById('reg-username').value;
  const password = document.getElementById('reg-password').value;
  if(!username || !password){ alert("Preencha usuário e senha"); return; }

  const res = await fetch(API + '/auth/register', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username,password})
  });
  const data = await res.json();
  alert(data.message || 'Erro');
  if(data.token){
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
  }
};

// Login
document.getElementById('btn-login').onclick = async () => {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  if(!username || !password){ alert("Preencha usuário e senha"); return; }

  const res = await fetch(API + '/auth/login', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username,password})
  });
  const data = await res.json();
  alert(data.message || 'Erro');
  if(data.token){
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', username);
    window.location.href = 'index.html';
  }
};
