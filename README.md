# Video Gallery Project

Este projeto é uma **galeria de fotos e vídeos**, onde cada usuário pode se registrar, logar, enviar mídias e baixar seus arquivos. O backend é feito em **Node.js/Express** com **SQLite** e o frontend em **HTML/CSS/JS** com **TailwindCSS**. O projeto está pronto para deploy na **Vercel (frontend)** e **Render (backend)**.

---

## 🔹 Funcionalidades

* Registro e login de usuários com JWT.
* Upload de imagens e vídeos.
* Visualização da galeria pessoal.
* Download de mídias.
* Modal para exibição de imagens e vídeos.

---

## 🛠️ Tecnologias

* Node.js / Express
* SQLite
* JWT para autenticação
* Bcrypt para senhas
* Multer para upload de arquivos
* TailwindCSS para frontend

---

## 💻 Rodando localmente

### 1. Backend

1. Entre na pasta do backend:

   ```bash
   cd backend
   ```
2. Instale dependências:

   ```bash
   npm install
   ```
3. Crie pastas necessárias:

   ```bash
   mkdir uploads data
   ```
4. Rode o servidor:

   ```bash
   node server.js
   ```

   O backend rodará em `http://localhost:4000`.

### 2. Frontend

1. Abra o `index.html` no navegador.
2. Configure a URL do backend no `app.js`:

   ```js
   const API = 'http://localhost:4000';
   ```
3. Agora você pode registrar, logar, enviar e visualizar mídias.

---

## ☁️ Deploy

### Backend (Render)

1. Crie uma conta em [Render](https://render.com).
2. Crie um novo **Web Service** e conecte seu repositório Git.
3. Configure as variáveis de ambiente:

   * `PORT` (Render já define automaticamente)
   * `JWT_SECRET`
   * `BASE_URL` (URL pública do Render, ex: `https://meu-backend.onrender.com`)
4. Render instalará dependências e rodará automaticamente.

### Frontend (Vercel)

1. Crie uma conta em [Vercel](https://vercel.com).
2. Configure um novo projeto apontando para a pasta do frontend.
3. No `app.js`, atualize a URL do backend:

   ```js
   const API = 'https://SEU_BACKEND_NO_RENDER.onrender.com';
   ```
4. Deploy automático após push no GitHub.

---



---

## ⚡ Observações

* Cada usuário só pode ver suas próprias mídias.
* Uploads suportam imagens e vídeos.
* Download protegido por token JWT.
* Fácil de testar e demonstrar para recrutadores.
*deploy: https://video-gallery-project.vercel.app/login.html
---

