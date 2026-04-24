// 认证路由
// 用于处理用户登录、登出和刷新令牌等操作

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config');

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 登出
router.post('/logout', (req, res) => {
  // 客户端负责清除令牌
  res.status(200).json({ message: 'Logged out successfully' });
});

// 刷新令牌
router.post('/refresh', (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const decoded = jwt.verify(token, config.jwt.secret, { ignoreExpiration: true });

    User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        // 生成新令牌
        const newToken = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          config.jwt.secret,
          { expiresIn: config.jwt.expiresIn }
        );

        res.status(200).json({ token: newToken });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;