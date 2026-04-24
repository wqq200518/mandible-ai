// 数据库模型索引文件
// 用于提供模拟数据库接口，使用内存存储

// 创建内存存储
const memoryStore = {
  patients: [
    {
      id: '1',
      patient_id: 'P001',
      name: '张三',
      gender: '男',
      age: 35,
      birthday: '1991-01-01',
      phone: '13800138001',
      address: '北京市海淀区',
      medical_history: '无特殊病史',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      patient_id: 'P002',
      name: '李四',
      gender: '女',
      age: 28,
      birthday: '1998-01-01',
      phone: '13900139001',
      address: '上海市浦东新区',
      medical_history: '过敏史:青霉素',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  cbct_images: [
    {
      id: '1',
      patient_id: '1',
      image_name: 'CBCT_20240101',
      image_path: '/data/images/CBCT_20240101.dcm',
      file_type: 'DICOM',
      file_size: 10485760,
      acquisition_date: '2024-01-01T10:00:00',
      resolution: '512x512',
      slice_thickness: 0.5,
      modality: 'CBCT',
      body_part: '下颌骨',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      patient_id: '2',
      image_name: 'CBCT_20240102',
      image_path: '/data/images/CBCT_20240102.nii',
      file_type: 'NIfTI',
      file_size: 5242880,
      acquisition_date: '2024-01-02T11:00:00',
      resolution: '256x256',
      slice_thickness: 1.0,
      modality: 'CBCT',
      body_part: '上颌骨',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  model3ds: [
    {
      id: '1',
      patient_id: '1',
      cbct_image_id: '1',
      model_name: 'Mandible_Model_1',
      model_path: '/data/models/Mandible_Model_1.stl',
      file_type: 'STL',
      file_size: 2097152,
      creation_date: '2024-01-01T12:00:00',
      model_type: '下颌骨',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      patient_id: '2',
      cbct_image_id: '2',
      model_name: 'Maxilla_Model_1',
      model_path: '/data/models/Maxilla_Model_1.obj',
      file_type: 'OBJ',
      file_size: 1048576,
      creation_date: '2024-01-02T13:00:00',
      model_type: '上颌骨',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  diagnosis_results: [
    {
      id: '1',
      patient_id: '1',
      cbct_image_id: '1',
      diagnosis_date: '2024-01-01T14:00:00',
      diagnosis_result: '根尖周炎',
      confidence: 0.85,
      suggestions: '建议进行根管治疗',
      ai_model_version: 'v1.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      patient_id: '2',
      cbct_image_id: '2',
      diagnosis_date: '2024-01-02T15:00:00',
      diagnosis_result: '上颌窦炎',
      confidence: 0.90,
      suggestions: '建议药物治疗',
      ai_model_version: 'v1.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  users: [
    {
      id: '1',
      username: 'admin',
      password_hash: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      role: 'admin',
      name: '管理员',
      email: 'admin@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      username: 'doctor',
      password_hash: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      role: 'doctor',
      name: '医生',
      email: 'doctor@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      username: 'researcher',
      password_hash: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
      role: 'researcher',
      name: '研究员',
      email: 'researcher@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  api_keys: [
    {
      id: '1',
      user_id: '1',
      api_key: 'admin_api_key_123',
      description: '管理员API密钥',
      expires_at: '2025-01-01T00:00:00',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: '2',
      api_key: 'doctor_api_key_123',
      description: '医生API密钥',
      expires_at: '2025-01-01T00:00:00',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      user_id: '3',
      api_key: 'researcher_api_key_123',
      description: '研究员API密钥',
      expires_at: '2025-01-01T00:00:00',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ]
};

// 生成唯一ID
const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// 模拟User模型
class User {
  constructor(userData) {
    Object.assign(this, userData);
  }

  static findOne({ where }) {
    return new Promise((resolve) => {
      const userData = memoryStore.users.find(u => u.username === where.username);
      const user = userData ? new User(userData) : null;
      resolve(user);
    });
  }

  static findByPk(id) {
    return new Promise((resolve) => {
      const userData = memoryStore.users.find(u => u.id === id);
      const user = userData ? new User(userData) : null;
      resolve(user);
    });
  }

  validatePassword(password) {
    // 模拟密码验证，所有密码都是123结尾
    return password === `${this.username}123`;
  }
}

// 模拟Patient模型
class Patient {
  static findAll() {
    return new Promise((resolve) => {
      resolve(memoryStore.patients);
    });
  }

  static findByPk(id) {
    return new Promise((resolve) => {
      const patient = memoryStore.patients.find(p => p.id === id);
      resolve(patient);
    });
  }

  static create(data) {
    return new Promise((resolve) => {
      const newPatient = {
        id: generateId(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      memoryStore.patients.push(newPatient);
      resolve(newPatient);
    });
  }

  update(data) {
    return new Promise((resolve) => {
      const index = memoryStore.patients.findIndex(p => p.id === this.id);
      if (index !== -1) {
        memoryStore.patients[index] = {
          ...memoryStore.patients[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        resolve(memoryStore.patients[index]);
      } else {
        resolve(null);
      }
    });
  }

  destroy() {
    return new Promise((resolve) => {
      const index = memoryStore.patients.findIndex(p => p.id === this.id);
      if (index !== -1) {
        memoryStore.patients.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}

// 模拟CBCTImage模型
class CBCTImage {
  static findAll() {
    return new Promise((resolve) => {
      resolve(memoryStore.cbct_images);
    });
  }

  static findByPk(id) {
    return new Promise((resolve) => {
      const image = memoryStore.cbct_images.find(i => i.id === id);
      resolve(image);
    });
  }
}

// 模拟Model3D模型
class Model3D {
  static findAll() {
    return new Promise((resolve) => {
      resolve(memoryStore.model3ds);
    });
  }

  static findByPk(id) {
    return new Promise((resolve) => {
      const model = memoryStore.model3ds.find(m => m.id === id);
      resolve(model);
    });
  }
}

// 模拟DiagnosisResult模型
class DiagnosisResult {
  static findAll() {
    return new Promise((resolve) => {
      resolve(memoryStore.diagnosis_results);
    });
  }

  static findByPk(id) {
    return new Promise((resolve) => {
      const result = memoryStore.diagnosis_results.find(r => r.id === id);
      resolve(result);
    });
  }
}

// 模拟ApiKey模型
class ApiKey {
  static findAll() {
    return new Promise((resolve) => {
      resolve(memoryStore.api_keys);
    });
  }

  static findByPk(id) {
    return new Promise((resolve) => {
      const key = memoryStore.api_keys.find(k => k.id === id);
      resolve(key);
    });
  }
}

// 模拟sequelize实例
const sequelize = {
  authenticate: () => new Promise((resolve) => {
    console.log('Mock database connected successfully');
    resolve();
  }),
  sync: () => new Promise((resolve) => {
    console.log('Mock database models synchronized');
    resolve();
  })
};

// 模拟Sequelize
const Sequelize = {
  DataTypes: {
    UUID: 'uuid',
    STRING: 'string',
    TEXT: 'text',
    INTEGER: 'integer',
    FLOAT: 'float',
    DATE: 'date',
    BOOLEAN: 'boolean',
    BIGINT: 'bigint'
  }
};

module.exports = {
  sequelize,
  Sequelize,
  Patient,
  CBCTImage,
  Model3D,
  DiagnosisResult,
  User,
  ApiKey,
};