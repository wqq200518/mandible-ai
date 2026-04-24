# 后端Dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache python3 make g++ curl

# 安装pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json ./

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads/images uploads/models

# 暴露端口
EXPOSE 8000

# 启动服务
CMD ["node", "server.js"]
