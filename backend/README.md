🎥 Video Gallery Project

Uma aplicação web para upload, visualização e download de imagens e vídeos, com autenticação de usuários.

🚀 Funcionalidades

Autenticação de usuários: Login e registro com JWT.

Upload de arquivos: Envio de imagens e vídeos.

Visualização em modal: Exibição de mídias em tela cheia.

Download de arquivos: Opção para baixar mídias.

Interface responsiva: Design adaptável para dispositivos móveis e desktop.

🛠 Tecnologias

Frontend: HTML, CSS (Tailwind CSS), JavaScript

Backend: Node.js, Express.js, SQLite

Hospedagem:

Frontend: Vercel

Backend: Render
 (ou Railway
 como alternativa)

📦 Como rodar localmente
1. Clone o repositório
git clone https://github.com/Jamersom-silva/video_gallery_project.git
cd video_gallery_project

2. Backend
Instale as dependências
cd backend
npm install

Configure o banco de dados
node src/config/initDb.js

Inicie o servidor
npm start


O backend estará disponível em http://localhost:4000.

3. Frontend
Instale as dependências
cd frontend
npm install

Inicie o servidor
npm start


O frontend estará disponível em http://localhost:3000.

🌐 Deploy na Vercel
1. Frontend

Acesse https://vercel.com
 e faça login com sua conta GitHub.

Clique em "New Project" e selecione o repositório do frontend.

Vercel detectará automaticamente o framework e configurará o deploy.

Após o deploy, o frontend estará disponível em um domínio como https://video-gallery-project.vercel.app.

2. Backend
Render

Acesse https://render.com
 e crie uma conta.

Clique em "New Web Service" e selecione o repositório do backend.

Configure o ambiente (Node.js) e as variáveis de ambiente necessárias.

Render criará um endpoint para o backend, como https://video-gallery-backend.onrender.com.

Railway (Alternativa)

Acesse https://railway.app
 e crie uma conta.

Clique em "New Project" e selecione o repositório do backend.

Configure o ambiente (Node.js) e as variáveis de ambiente necessárias.

Railway criará um endpoint para o backend, como https://video-gallery-backend.up.railway.app.

🔐 Variáveis de ambiente

No backend, configure as seguintes variáveis de ambiente:

JWT_SECRET: Chave secreta para assinatura de tokens JWT.

DB_PATH: Caminho para o banco de dados SQLite (exemplo: ./db.sqlite).

📸 Capturas de tela


Tela de login da aplicação.


Tela principal com a galeria de mídias.


Modal de visualização de imagem ou vídeo.

📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE
 para mais detalhes.