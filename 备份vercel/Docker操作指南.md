# CBCT影像诊断系统 Docker部署指南

## 目录
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [常见问题](#常见问题)
- [管理命令](#管理命令)
- [生产环境部署建议](#生产环境部署建议)

---

## 系统要求

### 硬件要求
- CPU: 2核或以上
- 内存: 4GB或以上
- 硬盘: 至少20GB可用空间

### 软件要求
- Docker 20.10或更高版本
- Docker Compose 2.0或更高版本

### 安装Docker

#### Windows系统
1. 下载并安装Docker Desktop for Windows
2. 确保Docker Desktop正在运行
3. 验证安装：
   ```bash
   docker --version
   docker-compose --version
   ```

#### macOS系统
1. 下载并安装Docker Desktop for Mac
2. 确保Docker Desktop正在运行
3. 验证安装：
   ```bash
   docker --version
   docker-compose --version
   ```

#### Linux系统
1. 安装Docker Engine和Docker Compose
2. 启动Docker服务
3. 验证安装：
   ```bash
   docker --version
   docker-compose --version
   ```

---

## 快速开始

### 1. 准备工作

```bash
# 进入项目目录
cd 网页项目

# 确保AI模型目录存在
mkdir -p ai-models

# 确保上传目录存在
mkdir -p backend/uploads/images backend/uploads/models
```

### 2. 配置环境变量（可选）

编辑 `.env` 文件，根据需要修改配置：

```env
# JWT配置（生产环境请修改为强密码）
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h

# 前端API地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. 启动系统

```bash
# 构建并启动所有容器
docker-compose up -d

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 4. 访问系统

系统启动成功后，通过以下地址访问：

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:8000

### 5. 测试账号

- **管理员**: admin / admin123
- **医生**: doctor / doctor123
- **研究员**: researcher / researcher123

---

## 详细部署步骤

### 第一步：项目结构检查

确保项目目录结构如下：

```
网页项目/
├── backend/              # 后端服务
│   ├── Dockerfile        # 后端Dockerfile
│   ├── server.js         # 后端入口
│   ├── package.json      # 后端依赖
│   ├── models/           # 数据模型
│   ├── routes/           # API路由
│   └── uploads/          # 上传文件目录
├── src/                  # 前端源代码
├── public/               # 静态资源
├── ai-models/            # AI模型目录
├── .env                  # 环境变量配置
├── Dockerfile            # 前端Dockerfile
├── docker-compose.yml    # Docker Compose配置
└── Docker操作指南.md    # 本文档
```

### 第二步：AI模型准备（可选）

如果您有AI模型文件，请将其放入 `ai-models/` 目录：

```bash
# 复制AI模型文件
cp /path/to/your/model/* ai-models/
```

### 第三步：构建和启动

#### 首次部署

```bash
# 构建镜像并启动容器
docker-compose up -d --build

# 等待服务启动（约1-2分钟）
docker-compose ps
```

#### 查看启动日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 只看后端日志
docker-compose logs -f backend

# 只看前端日志
docker-compose logs -f frontend
```

#### 验证服务健康

```bash
# 检查后端健康状态
curl http://localhost:8000/health

# 应该返回：{"status":"ok"}
```

### 第四步：系统验证

1. 打开浏览器访问 http://localhost:3000
2. 使用测试账号登录
3. 尝试访问各个功能模块
4. 测试上传功能（可选）

---

## 常见问题

### 1. 端口被占用

**问题**: `Bind for 0.0.0.0:3000 failed: port is already allocated`

**解决方案**:
```bash
# 查找占用端口的进程
# Windows
netstat -ano | findstr :3000
# Linux/macOS
lsof -i :3000

# 停止占用端口的进程，或修改docker-compose.yml中的端口映射
```

### 2. 容器启动失败

**问题**: 容器不断重启或启动失败

**解决方案**:
```bash
# 查看详细日志
docker-compose logs backend
docker-compose logs frontend

# 检查目录权限
ls -la backend/uploads
ls -la ai-models
```

### 3. 权限问题

**问题**: 文件上传失败或权限错误

**解决方案**:
```bash
# 设置正确的权限
chmod -R 755 backend/uploads
chmod -R 755 ai-models

# 如果在Docker Compose中，确保volumes配置正确
```

### 4. 前端无法连接后端

**问题**: 前端显示"服务不可用"

**解决方案**:
```bash
# 检查后端是否正常运行
docker-compose ps

# 检查后端日志
docker-compose logs backend

# 验证健康检查
curl http://localhost:8000/health

# 检查NEXT_PUBLIC_API_URL环境变量是否正确
```

### 5. 内存不足

**问题**: Docker运行时内存不足

**解决方案**:
- 增加Docker Desktop的内存限制（Windows/macOS）
- 关闭其他占用内存的应用
- 使用轻量级的基础镜像

### 6. 镜像构建失败

**问题**: `docker-compose build` 失败

**解决方案**:
```bash
# 清理构建缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache

# 查看详细构建日志
docker-compose build --progress=plain
```

---

## 管理命令

### 容器管理

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose stop

# 重启所有服务
docker-compose restart

# 停止并删除所有容器
docker-compose down

# 停止并删除所有容器和数据卷
docker-compose down -v
```

### 查看状态

```bash
# 查看容器状态
docker-compose ps

# 查看资源使用情况
docker stats

# 查看容器详细信息
docker inspect cbct-backend
docker inspect cbct-frontend
```

### 日志管理

```bash
# 查看所有服务日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 查看最近100行日志
docker-compose logs --tail=100

# 查看特定服务日志
docker-compose logs backend
docker-compose logs frontend
```

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh

# 在容器中执行命令
docker-compose exec backend ls -la
docker-compose exec backend pnpm list
```

### 数据备份

```bash
# 备份上传文件
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz backend/uploads/

# 备份AI模型
tar -czf ai-models-backup-$(date +%Y%m%d).tar.gz ai-models/

# 从容器复制文件到主机
docker cp cbct-backend:/app/uploads ./uploads-backup
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build

# 查看更新后的状态
docker-compose ps
```

---

## 生产环境部署建议

### 1. 安全配置

#### 修改JWT密钥

编辑 `.env` 文件：

```env
JWT_SECRET=your-very-secure-secret-key-here-at-least-32-chars-long
JWT_EXPIRES_IN=24h
```

#### 使用HTTPS

建议使用反向代理（如Nginx）来提供HTTPS：

```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. 性能优化

#### 配置资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  frontend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

#### 使用CDN

静态资源使用CDN加速：
- 将 `public/` 目录下的静态文件上传到CDN
- 在前端配置中使用CDN地址

### 3. 监控和日志

#### 配置日志轮转

在 `docker-compose.yml` 中配置日志：

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  frontend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

#### 设置健康检查

已在 `docker-compose.yml` 中配置，可以监控服务状态。

### 4. 数据持久化

#### 定期备份

创建备份脚本 `backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份上传文件
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz backend/uploads/

# 备份AI模型
tar -czf $BACKUP_DIR/ai-models_$DATE.tar.gz ai-models/

# 删除30天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

添加到crontab定时执行：

```bash
# 每天凌晨2点备份
0 2 * * * /path/to/backup.sh
```

### 5. 灾难恢复

#### 恢复备份

```bash
# 停止服务
docker-compose down

# 恢复上传文件
tar -xzf uploads-backup-20240101.tar.gz

# 恢复AI模型
tar -xzf ai-models-backup-20240101.tar.gz

# 重新启动服务
docker-compose up -d
```

---

## 技术支持

如果遇到问题：

1. 查看本文档的"常见问题"章节
2. 查看容器日志：`docker-compose logs`
3. 检查系统资源：`docker stats`
4. 参考项目文档：`操作指南.md`

---

## 附录

### A. 目录说明

| 目录/文件 | 说明 |
|----------|------|
| `backend/` | 后端服务代码 |
| `src/` | 前端源代码 |
| `public/` | 前端静态资源 |
| `ai-models/` | AI模型文件 |
| `backend/uploads/` | 用户上传的文件 |
| `.env` | 环境变量配置 |
| `docker-compose.yml` | Docker Compose配置 |
| `Dockerfile` | 前端Docker镜像配置 |
| `backend/Dockerfile` | 后端Docker镜像配置 |

### B. 端口说明

| 端口 | 服务 | 说明 |
|-----|------|------|
| 3000 | 前端 | Next.js前端服务 |
| 8000 | 后端 | Express后端API服务 |

### C. 测试账号

| 角色 | 用户名 | 密码 | 说明 |
|-----|--------|------|------|
| 管理员 | admin | admin123 | 拥有所有权限 |
| 医生 | doctor | doctor123 | 可以查看和处理病例 |
| 研究员 | researcher | researcher123 | 可以查看和分析数据 |

---

**祝您使用愉快！**
