// 聊天路由
// 用于处理智能体聊天功能

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');

// 聊天功能
router.post('/message', authenticateJWT, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 模拟AI响应
    const responses = {
      '你好': '您好！我是Mandible AI智能助手，请问有什么可以帮助您的？',
      '什么是CBCT': 'CBCT（Cone Beam Computed Tomography）即锥形束计算机断层扫描，是一种先进的医学影像技术，主要用于口腔颌面部的三维成像。它可以提供高分辨率的三维图像，帮助医生更准确地诊断和治疗口腔疾病。',
      '牙龈出血是什么原因': '牙龈出血可能由多种原因引起，包括：1. 牙龈炎或牙周炎：最常见的原因，由牙菌斑和牙结石刺激牙龈引起；2. 刷牙方法不正确：过于用力或使用硬毛牙刷；3. 维生素C缺乏：可能导致牙龈脆弱易出血；4. 某些药物：如抗凝血药；5. 系统性疾病：如糖尿病、血液系统疾病等。如果您有牙龈出血的情况，建议及时就医检查。',
      '如何预防牙周炎': '预防牙周炎的方法包括：1. 正确刷牙：每天早晚刷牙，使用巴氏刷牙法；2. 使用牙线：每天使用牙线清洁牙缝；3. 定期洗牙：每6-12个月进行一次专业洗牙；4. 均衡饮食：多吃富含维生素C和钙的食物；5. 戒烟：吸烟会增加牙周炎的风险；6. 定期检查：每6个月进行一次口腔检查。',
      '智齿需要拔除吗': '智齿是否需要拔除取决于具体情况：1. 如果智齿生长正常，有足够的空间，并且能够正常清洁，通常不需要拔除；2. 如果智齿阻生（无法正常萌出），可能会导致疼痛、感染、邻牙损伤等问题，建议拔除；3. 如果智齿反复引起炎症或疼痛，也建议拔除；4. 对于正在进行正畸治疗的患者，为了避免智齿影响正畸效果，可能需要拔除。建议咨询专业牙医，根据个人情况做出决定。'
    };

    // 查找匹配的回答
    let response = '抱歉，我无法回答这个问题。请问您有关于口腔健康或CBCT诊断的问题吗？';
    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        response = value;
        break;
      }
    }

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取聊天历史
router.get('/history', authenticateJWT, async (req, res) => {
  try {
    // 模拟聊天历史
    const history = [
      {
        id: 1,
        role: 'assistant',
        content: '您好！我是Mandible AI智能助手，请问有什么可以帮助您的？',
        timestamp: new Date().toISOString()
      }
    ];

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;