// 诊断结果模型
// 定义诊断结果表的结构和字段

module.exports = (sequelize, DataTypes) => {
  const DiagnosisResult = sequelize.define('DiagnosisResult', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    cbct_image_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cbct_images',
        key: 'id',
      },
    },
    diagnosis_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnosis_result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    suggestions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ai_model_version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: 'diagnosis_results',
    timestamps: false,
  });

  DiagnosisResult.associate = (models) => {
    // 关联关系在index.js中定义
  };

  return DiagnosisResult;
};