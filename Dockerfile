# 👉 Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# 👉 Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# Chỉ cài dependencies cần cho runtime
RUN npm ci --omit=dev

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
