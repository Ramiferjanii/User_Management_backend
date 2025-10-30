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
- `MONGODB_URI` (MongoDB Atlas connection string)
- `JWT_SECRET` (generate a random secure string)
- `JWT_REFRESH_SECRET` (generate a different random secure string)
- `NODE_ENV=production`

**For MongoDB Atlas connection string, use this format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**Important:** URL-encode special characters in your password. For example:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- `/` becomes `%2F`

3) Expose port 5000. Render will set the `PORT` env automatically; keep our app reading `process.env.PORT`.

4) After deployment, the API base will be: `https://<your-render-service>.onrender.com/api`.

### MongoDB Atlas Connection Issues

If you encounter "bad auth: authentication failed" error:

1. **Verify credentials** in your MongoDB Atlas connection string
2. **URL-encode special characters** in your password (see above)
3. **Check IP whitelist** - In MongoDB Atlas Dashboard → Network Access, add:
   - `0.0.0.0/0` (allow all IPs - for development)
   - Or Render's static IP if you have one
4. **Verify database user permissions** - Ensure your Atlas user has read/write access
5. **Check database name** - Make sure the database exists or the user can create it

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

