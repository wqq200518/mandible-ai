// 配置文件
// 用于存储数据库连接信息和其他配置

require('dotenv').config();

module.exports = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'cbct_diagnostic',
    dialect: 'postgres',
    logging: false,
  },
  // 服务器配置
  server: {
    port: process.env.PORT || 8000,
    host: process.env.HOST || '0.0.0.0',
  },
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  // 文件存储配置
  storage: {
    images: process.env.IMAGES_PATH || './uploads/images',
    models: process.env.MODELS_PATH || './uploads/models',
  },
  // AI模型配置
  ai: {
    modelPath: process.env.AI_MODEL_PATH || 'c:\\Users\\王琦琦\\Downloads\\project_20260405_103518\\projects',
  },
};