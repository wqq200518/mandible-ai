// 用户管理路由
// 用于处理用户相关的API请求

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// 获取用户列表
router.get('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取用户详情
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    // 只有管理员或用户自己可以查看用户详情
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建用户
router.post('/', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 更新用户信息
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    // 只有管理员或用户自己可以更新用户信息
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除用户
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;