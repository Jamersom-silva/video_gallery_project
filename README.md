# Video Gallery Project (backend + simple frontend)

This package contains:
- `backend/` — Node.js + Express + SQLite backend with JWT auth
- `frontend/` — Minimal static frontend (index.html + app.js) to test the API locally

## Quick start (locally)
1. Open two terminals.
2. Terminal 1 — start backend:
   ```
   cd backend
   npm install
   npm start
   ```
   Backend runs on port 4000 by default.
3. Terminal 2 — open `frontend/index.html` in your browser (File -> Open) or serve it with a simple static server.
4. Register a user, login, upload files and test.

## Notes for Vercel / Deployment
- Vercel is intended for frontends. For backend you can deploy to Render, Railway, Fly, or use Vercel Serverless Functions (requires adaptation).
- Uploaded files are stored on disk (`uploads/`) — when deploying to serverless platforms, persistent disk storage is not guaranteed. For production use, prefer cloud storage (S3, Google Cloud Storage).
