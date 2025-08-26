# Video Gallery - Backend

## Overview
Node.js + Express backend using SQLite. Provides:
- User registration and login (JWT)
- Upload media (files stored under `uploads/<userId>/`)
- List / download / delete user's media

## Setup
1. Install dependencies:
   ```
   cd backend
   npm install
   ```
2. (Optional) Set `JWT_SECRET` env var:
   ```
   export JWT_SECRET="change_this_to_a_strong_secret"
   ```
3. Start server:
   ```
   npm start
   ```
4. Server will create `gallery.db` and `uploads/` automatically.

## API
- `POST /auth/register` { username, password } -> { token, user }
- `POST /auth/login` { username, password } -> { token, user }
- `POST /media/upload` (multipart form `media`, authorization Bearer token) -> upload file
- `GET /media/list` (Bearer token) -> list user's media
- `GET /media/download/:id` (Bearer token) -> download file if owner
- `DELETE /media/:id` (Bearer token) -> delete file if owner

Notes:
- Files are saved on disk in `uploads/<userId>/`.
- Database file is `gallery.db` at project root.
