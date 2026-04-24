// 身份验证中间件
// 用于验证用户身份和授权

const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const config = require('../config');
const { User, ApiKey } = require('../models');

// JWT身份验证中间件
exports.authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// API密钥验证中间件
exports.authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  try {
    const key = await ApiKey.findOne({
      where: {
        api_key: apiKey,
        is_active: true,
        expires_at: { [Op.or]: { [Op.is]: null, [Op.gt]: new Date() } },
      },
      include: [{ model: User }],
    });

    if (!key) {
      return res.status(401).json({ message: 'Invalid or expired API key' });
    }

    req.user = key.User;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid API key' });
  }
};

// 角色授权中间件
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};