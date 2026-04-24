// 影像管理路由
// 用于处理CBCT影像相关的API请求

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { CBCTImage } = require('../models');
const { authenticateJWT } = require('../middleware/auth');
const config = require('../config');
const fs = require('fs');

// 确保上传目录存在
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(config.storage.images);

// 配置multer存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.storage.images);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 获取影像列表
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const images = await CBCTImage.findAll();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取影像详情
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const image = await CBCTImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 上传影像
router.post('/', authenticateJWT, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const image = await CBCTImage.create({
      patient_id: req.body.patient_id,
      image_name: req.file.originalname,
      image_path: req.file.path,
      file_type: path.extname(req.file.originalname).substring(1),
      file_size: req.file.size,
      acquisition_date: new Date(),
      resolution: req.body.resolution,
      slice_thickness: req.body.slice_thickness,
      modality: req.body.modality,
      body_part: req.body.body_part,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除影像
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const image = await CBCTImage.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // 删除文件
    if (fs.existsSync(image.image_path)) {
      fs.unlinkSync(image.image_path);
    }

    await image.destroy();
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;