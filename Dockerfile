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

# Set environment variables for build
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID

# Export as environment variables for the build
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID

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
