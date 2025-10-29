# syntax=docker/dockerfile:1

# ---- Base builder image ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies first (leverages Docker layer cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Production runtime image ----
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output and necessary runtime files
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Expect MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET to be provided at runtime
CMD ["node", "dist/app.js"]


