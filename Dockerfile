# Sử dụng Node.js 20 với Alpine Linux làm base image
FROM node:20-alpine AS base

WORKDIR /app

#copy package files

COPY package*.json ./

#install depencies
RUN npm install 

# copy rest of the project
COPY . . 

#build app(next se tao .next folder)
RUN npm run build

EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]