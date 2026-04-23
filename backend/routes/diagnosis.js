// 诊断结果管理路由
// 用于处理诊断结果相关的API请求

const express = require('express');
const router = express.Router();
const { DiagnosisResult } = require('../models');
const { authenticateJWT } = require('../middleware/auth');

// 获取诊断结果列表
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const diagnosisResults = await DiagnosisResult.findAll();
    res.status(200).json(diagnosisResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取诊断结果详情
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const diagnosisResult = await DiagnosisResult.findByPk(req.params.id);
    if (!diagnosisResult) {
      return res.status(404).json({ message: 'Diagnosis result not found' });
    }
    res.status(200).json(diagnosisResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建诊断结果
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const diagnosisResult = await DiagnosisResult.create({
      patient_id: req.body.patient_id,
      cbct_image_id: req.body.cbct_image_id,
      diagnosis_date: new Date(),
      diagnosis_result: req.body.diagnosis_result,
      confidence: req.body.confidence,
      suggestions: req.body.suggestions,
      ai_model_version: req.body.ai_model_version,
    });
    res.status(201).json(diagnosisResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 更新诊断结果
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const diagnosisResult = await DiagnosisResult.findByPk(req.params.id);
    if (!diagnosisResult) {
      return res.status(404).json({ message: 'Diagnosis result not found' });
    }
    await diagnosisResult.update(req.body);
    res.status(200).json(diagnosisResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;