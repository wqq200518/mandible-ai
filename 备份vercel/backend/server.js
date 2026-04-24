// 主服务器文件
// 用于启动Express服务器并注册所有路由

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const { sequelize } = require('./models');

// 导入路由
const patientsRouter = require('./routes/patients');
const imagesRouter = require('./routes/images');
const modelsRouter = require('./routes/models');
const diagnosisRouter = require('./routes/diagnosis');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const aiRouter = require('./routes/ai');
const chatRouter = require('./routes/chat');

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static('./uploads'));

// 注册路由
app.use('/api/patients', patientsRouter);
app.use('/api/images', imagesRouter);
app.use('/api/models', modelsRouter);
app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/chat', chatRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await sequelize.authenticate();
    console.log('Database connected successfully');

    // 启动服务器
    app.listen(config.server.port, config.server.host, () => {
      console.log(`Server running at http://${config.server.host}:${config.server.port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();