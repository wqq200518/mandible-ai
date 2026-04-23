// 3D模型管理路由
// 用于处理3D模型相关的API请求

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Model3D } = require('../models');
const { authenticateJWT } = require('../middleware/auth');
const config = require('../config');
const fs = require('fs');

// 确保上传目录存在
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(config.storage.models);

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.storage.models);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 获取模型列表
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const models = await Model3D.findAll();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取模型详情
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const model = await Model3D.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 上传模型
router.post('/', authenticateJWT, upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const model = await Model3D.create({
      patient_id: req.body.patient_id,
      cbct_image_id: req.body.cbct_image_id,
      model_name: req.file.originalname,
      model_path: req.file.path,
      file_type: path.extname(req.file.originalname).substring(1),
      file_size: req.file.size,
      creation_date: new Date(),
      model_type: req.body.model_type,
    });

    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除模型
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const model = await Model3D.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // 删除文件
    if (fs.existsSync(model.model_path)) {
      fs.unlinkSync(model.model_path);
    }

    await model.destroy();
    res.status(200).json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;