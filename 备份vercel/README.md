# CBCT影像诊断系统

基于深度学习的医学影像分析平台，提供精准分割、多病种分类与智能诊断功能。

## 项目特点

- 🦷 **智能诊断**：基于AI的CBCT影像分析
- 📊 **数据管理**：完整的患者、影像、3D模型管理
- 🤖 **AI集成**：支持AI模型训练和优化
- 👥 **权限控制**：多角色权限管理（管理员、医生、研究员）
- 🎨 **现代UI**：基于Next.js 16 + React 19的现代化界面

## 技术栈

### 前端
- **框架**: Next.js 16 (App Router)
- **核心**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **组件**: shadcn/ui

### 后端
- **框架**: Express.js
- **数据库**: PostgreSQL 15
- **ORM**: Sequelize
- **认证**: JWT
- **文件上传**: Multer

### AI模型
- **框架**: PyTorch
- **路径**: `c:\Users\王琦琦\Downloads\project_20260405_103518\projects`

## 快速开始

### 前置要求

- Node.js 18.0+
- PostgreSQL 15.0+
- pnpm (包管理器)
- DBeaver (数据库管理工具)

### 安装步骤

1. **克隆项目**
   ```bash
   cd 网页项目
   ```

2. **数据库设置**
   - 安装PostgreSQL
   - 使用DBeaver连接数据库
   - 执行`database.sql`脚本

3. **安装依赖**
   ```bash
   # 后端依赖
   cd backend
   pnpm install

   # 前端依赖
   cd ..
   pnpm install
   ```

4. **配置环境**
   - 编辑`backend/.env`文件
   - 修改数据库连接信息

5. **启动系统**
   ```bash
   # 方式1：使用快速启动脚本
   start.bat

   # 方式2：手动启动
   # 终端1：启动后端
   cd backend
   pnpm dev

   # 终端2：启动前端
   pnpm dev
   ```

6. **访问系统**
   - 前端：http://localhost:3000
   - 后端：http://localhost:8000

### 测试账号

- **管理员**: admin / admin123 (全部功能)
- **医生**: doctor / doctor123 (诊断+问答+病例)
- **研究员**: researcher / research123 (诊断+问答+病例)

## 项目结构

```
网页项目/
├── database.sql              # 数据库初始化脚本
├── start.bat                # 快速启动脚本
├── 操作指南.md             # 详细操作指南
├── backend/                # 后端项目
│   ├── models/            # 数据库模型
│   ├── routes/            # API路由
│   ├── middleware/        # 中间件
│   ├── config.js         # 配置文件
│   ├── server.js         # 服务器入口
│   ├── .env             # 环境变量
│   └── package.json
├── src/                   # 前端项目
│   ├── app/              # 页面路由
│   ├── lib/              # 工具库
│   └── components/       # UI组件
├── public/                # 静态资源
├── package.json           # 前端依赖
├── next.config.ts        # Next.js配置
└── tsconfig.json        # TypeScript配置
```

## 功能模块

### 1. 登录系统
- 多角色登录
- JWT身份验证
- 权限控制

### 2. 智能问答
- AI助手对话
- 医学问题解答
- 历史对话记录

### 3. 智能诊断
- CBCT影像上传
- AI模型分析
- 诊断结果展示

### 4. 诊断输出
- 历史诊断记录
- 结果筛选和搜索
- 报告导出

### 5. 病例管理
- 患者信息管理
- 病例历史记录
- 数据统计分析

### 6. 模型训练（仅管理员）
- 训练参数配置
- 模型版本管理
- 训练历史记录

### 7. 系统设置
- 系统配置管理
- 用户权限管理
- API密钥管理

### 8. 帮助中心
- 使用指南
- 常见问题解答
- 功能说明

## API接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/refresh` - 刷新令牌

### 患者管理
- `GET /api/patients` - 获取患者列表
- `POST /api/patients` - 创建患者
- `PUT /api/patients/:id` - 更新患者
- `DELETE /api/patients/:id` - 删除患者

### 影像管理
- `GET /api/images` - 获取影像列表
- `POST /api/images` - 上传影像
- `DELETE /api/images/:id` - 删除影像

### AI分析
- `POST /api/ai/analyze` - 分析影像
- `POST /api/ai/train` - 训练模型（仅管理员）
- `GET /api/ai/models` - 获取模型列表

详细API文档请参考`操作指南.md`文件。

## 数据库设计

### 主要数据表

- `patients` - 患者信息
- `cbct_images` - CBCT影像数据
- `3d_models` - 3D模型数据
- `diagnosis_results` - 诊断结果
- `users` - 系统用户
- `api_keys` - API密钥

详细数据库设计请参考`database.sql`文件。

## 开发指南

### 前端开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

### 后端开发

```bash
# 启动开发服务器（支持热重载）
cd backend
pnpm dev

# 启动生产服务器
pnpm start
```

### 数据库管理

使用DBeaver进行数据库管理：
- 连接数据库
- 执行SQL脚本
- 管理数据表
- 查看数据

## 常见问题

### 1. 数据库连接失败

检查：
- PostgreSQL服务是否启动
- 数据库用户名和密码是否正确
- 防火墙设置

### 2. 前端无法连接后端

检查：
- 后端服务是否启动
- API_BASE_URL配置是否正确
- CORS设置

### 3. 文件上传失败

检查：
- uploads目录权限
- 文件大小限制
- 文件格式支持

## 部署建议

### 生产环境配置

1. 使用环境变量管理配置
2. 配置数据库连接池
3. 启用日志记录
4. 使用HTTPS
5. 配置CDN加速

### 安全建议

1. 修改默认密码
2. 实现请求限流
3. 添加日志记录
4. 定期更新依赖包
5. 配置备份策略

## 技术支持

详细操作指南请参考`操作指南.md`文件。

如有问题，请检查：
1. 系统日志
2. 浏览器控制台
3. 数据库连接状态
4. API响应状态

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。

---

**注意**：本系统仅供学习和研究使用，不应用于实际医疗诊断。