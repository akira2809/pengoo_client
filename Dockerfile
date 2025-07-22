# 👉 Stage 1: Install dependencies and build the app
FROM node:20-alpine AS builder

# Tạo thư mục làm việc
WORKDIR /app

# Copy file package để cài dependencies
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source vào
COPY . .

# Build ứng dụng Next.js (tạo ra .next)
RUN npm run build

# 👉 Stage 2: Create lightweight production image
FROM node:20-alpine AS runner



# Tạo thư mục làm việc mới
WORKDIR /app

# Chỉ copy những thứ cần thiết cho runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# App lắng nghe ở port 3000
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["npm", "start"]
