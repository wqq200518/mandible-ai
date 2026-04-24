// AI 路由
// 用于处理AI相关的API请求

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');

// 示例AI接口
router.post('/process', authenticateJWT, async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ message: 'Input is required' });
    }

    res.status(200).json({ result: `AI processed: ${input}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
