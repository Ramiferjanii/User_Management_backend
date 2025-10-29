# Backend API

Express.js + TypeScript API for the Users & Permissions Management Dashboard (RBAC with JWT).

## Tech Stack

- Node.js 20, Express 5, TypeScript 5
- MongoDB 7, Mongoose 8
- Auth: JWT access + refresh tokens
- Security: Helmet, CORS, Rate limiting, bcrypt

## Quick Start

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Seed database: `npm run seed`
4. Start server: `npm run dev`

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
```

## Docker

Run with Docker Compose from repo root:

```bash
docker compose up -d --build backend mongo
```

Or build/run this service only:

```bash
docker build -t rbac-backend ./backend
docker run --rm -p 5000:5000 \
  -e MONGODB_URI=mongodb://localhost:27017/user-management \
  -e JWT_SECRET=change-me -e JWT_REFRESH_SECRET=change-me-too \
  rbac-backend
```

## Available Scripts

- `npm run dev` - Development with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run seed` - Seed database

## Deploy to Render

You can deploy the backend to Render using your GitHub repo `User_Management_backend`.

1) Push the backend code to GitHub (repo: `User_Management_backend`) and ensure the `Dockerfile` exists in repo root (or in a Docker service on Render, choose Docker). If not using Docker, select a Node service and use:

- Build Command: `npm install && npm run build`
- Start Command: `node dist/app.js`

2) Configure environment variables on Render:

- `PORT=5000`
- `MONGODB_URI` (Render-hosted Mongo or external)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `NODE_ENV=production`

3) Expose port 5000. Render will set the `PORT` env automatically; keep our app reading `process.env.PORT`.

4) After deployment, the API base will be: `https://<your-render-service>.onrender.com/api`.

GitHub repo you referenced: `https://github.com/Ramiferjanii/User_Management_backend.git`.

## API Base URL

- Default local: `http://localhost:5000/api`

## Folder Structure

```
backend/
├─ src/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ seeds/        # database seeding
│  └─ app.ts        # app entry (listens on PORT)
├─ Dockerfile
└─ package.json
```

