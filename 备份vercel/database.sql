-- CBCT影像数据库设计
-- 版本: 1.0
-- 描述: 用于存储CBCT影像数据、患者资料和3D模型
-- 适用: PostgreSQL 15.0+

-- 创建数据库
CREATE DATABASE cbct_diagnostic;

-- 连接到数据库
\c cbct_diagnostic;

-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 患者表
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id VARCHAR(50) UNIQUE NOT NULL, -- 患者编号
    name VARCHAR(100) NOT NULL, -- 患者姓名
    gender VARCHAR(10) NOT NULL, -- 性别
    age INTEGER NOT NULL, -- 年龄
    birthday DATE, -- 出生日期
    phone VARCHAR(20), -- 联系电话
    address TEXT, -- 地址
    medical_history TEXT, -- 病史
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 创建患者表索引
CREATE INDEX idx_patients_patient_id ON patients(patient_id);
CREATE INDEX idx_patients_name ON patients(name);

-- 影像数据表
CREATE TABLE cbct_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE, -- 关联患者
    image_name VARCHAR(255) NOT NULL, -- 影像名称
    image_path TEXT NOT NULL, -- 影像存储路径
    file_type VARCHAR(50) NOT NULL, -- 文件类型（DICOM、NIfTI等）
    file_size BIGINT NOT NULL, -- 文件大小（字节）
    acquisition_date TIMESTAMP NOT NULL, -- 采集日期
    resolution VARCHAR(50), -- 分辨率
    slice_thickness FLOAT, -- 层厚
    modality VARCHAR(50), --  modality
    body_part VARCHAR(100), -- 扫描部位
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 创建影像数据表索引
CREATE INDEX idx_cbct_images_patient_id ON cbct_images(patient_id);
CREATE INDEX idx_cbct_images_acquisition_date ON cbct_images(acquisition_date);

-- 3D模型表
CREATE TABLE 3d_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE, -- 关联患者
    cbct_image_id UUID REFERENCES cbct_images(id) ON DELETE CASCADE, -- 关联CBCT影像
    model_name VARCHAR(255) NOT NULL, -- 模型名称
    model_path TEXT NOT NULL, -- 模型存储路径
    file_type VARCHAR(50) NOT NULL, -- 文件类型（STL、OBJ等）
    file_size BIGINT NOT NULL, -- 文件大小（字节）
    creation_date TIMESTAMP NOT NULL, -- 创建日期
    model_type VARCHAR(100), -- 模型类型（下颌骨、上颌骨等）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 创建3D模型表索引
CREATE INDEX idx_3d_models_patient_id ON 3d_models(patient_id);
CREATE INDEX idx_3d_models_cbct_image_id ON 3d_models(cbct_image_id);

-- 诊断结果表
CREATE TABLE diagnosis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE, -- 关联患者
    cbct_image_id UUID REFERENCES cbct_images(id) ON DELETE CASCADE, -- 关联CBCT影像
    diagnosis_date TIMESTAMP NOT NULL, -- 诊断日期
    diagnosis_result TEXT NOT NULL, -- 诊断结果
    confidence FLOAT NOT NULL, -- 置信度
    suggestions TEXT, -- 建议
    ai_model_version VARCHAR(50), -- AI模型版本
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 创建诊断结果表索引
CREATE INDEX idx_diagnosis_results_patient_id ON diagnosis_results(patient_id);
CREATE INDEX idx_diagnosis_results_cbct_image_id ON diagnosis_results(cbct_image_id);
CREATE INDEX idx_diagnosis_results_diagnosis_date ON diagnosis_results(diagnosis_date);

-- 系统用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL, -- 用户名
    password_hash VARCHAR(255) NOT NULL, -- 密码哈希
    role VARCHAR(20) NOT NULL, -- 角色（admin、doctor、researcher）
    name VARCHAR(100) NOT NULL, -- 姓名
    email VARCHAR(100) UNIQUE NOT NULL, -- 邮箱
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 更新时间
);

-- 创建系统用户表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- API密钥表
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- 关联用户
    api_key VARCHAR(255) UNIQUE NOT NULL, -- API密钥
    description TEXT, -- 密钥描述
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间
    expires_at TIMESTAMP, -- 过期时间
    is_active BOOLEAN DEFAULT TRUE -- 是否激活
);

-- 创建API密钥表索引
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_api_key ON api_keys(api_key);

-- 插入测试数据
-- 插入系统用户
INSERT INTO users (username, password_hash, role, name, email) VALUES
('admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', '管理员', 'admin@example.com'),
('doctor', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'doctor', '医生', 'doctor@example.com'),
('researcher', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'researcher', '研究员', 'researcher@example.com');

-- 插入测试患者
INSERT INTO patients (patient_id, name, gender, age, birthday, phone, address, medical_history) VALUES
('P001', '张三', '男', 35, '1991-01-01', '13800138001', '北京市海淀区', '无特殊病史'),
('P002', '李四', '女', 28, '1998-01-01', '13900139001', '上海市浦东新区', '过敏史:青霉素');

-- 插入测试CBCT影像
INSERT INTO cbct_images (patient_id, image_name, image_path, file_type, file_size, acquisition_date, resolution, slice_thickness, modality, body_part) VALUES
((SELECT id FROM patients WHERE patient_id = 'P001'), 'CBCT_20240101', '/data/images/CBCT_20240101.dcm', 'DICOM', 10485760, '2024-01-01 10:00:00', '512x512', 0.5, 'CBCT', '下颌骨'),
((SELECT id FROM patients WHERE patient_id = 'P002'), 'CBCT_20240102', '/data/images/CBCT_20240102.nii', 'NIfTI', 5242880, '2024-01-02 11:00:00', '256x256', 1.0, 'CBCT', '上颌骨');

-- 插入测试3D模型
INSERT INTO 3d_models (patient_id, cbct_image_id, model_name, model_path, file_type, file_size, creation_date, model_type) VALUES
((SELECT id FROM patients WHERE patient_id = 'P001'), (SELECT id FROM cbct_images WHERE image_name = 'CBCT_20240101'), 'Mandible_Model_1', '/data/models/Mandible_Model_1.stl', 'STL', 2097152, '2024-01-01 12:00:00', '下颌骨'),
((SELECT id FROM patients WHERE patient_id = 'P002'), (SELECT id FROM cbct_images WHERE image_name = 'CBCT_20240102'), 'Maxilla_Model_1', '/data/models/Maxilla_Model_1.obj', 'OBJ', 1048576, '2024-01-02 13:00:00', '上颌骨');

-- 插入测试诊断结果
INSERT INTO diagnosis_results (patient_id, cbct_image_id, diagnosis_date, diagnosis_result, confidence, suggestions, ai_model_version) VALUES
((SELECT id FROM patients WHERE patient_id = 'P001'), (SELECT id FROM cbct_images WHERE image_name = 'CBCT_20240101'), '2024-01-01 14:00:00', '根尖周炎', 0.85, '建议进行根管治疗', 'v1.0'),
((SELECT id FROM patients WHERE patient_id = 'P002'), (SELECT id FROM cbct_images WHERE image_name = 'CBCT_20240102'), '2024-01-02 15:00:00', '上颌窦炎', 0.90, '建议药物治疗', 'v1.0');

-- 插入测试API密钥
INSERT INTO api_keys (user_id, api_key, description, expires_at, is_active) VALUES
((SELECT id FROM users WHERE username = 'admin'), 'admin_api_key_123', '管理员API密钥', '2025-01-01 00:00:00', TRUE),
((SELECT id FROM users WHERE username = 'doctor'), 'doctor_api_key_123', '医生API密钥', '2025-01-01 00:00:00', TRUE),
((SELECT id FROM users WHERE username = 'researcher'), 'researcher_api_key_123', '研究员API密钥', '2025-01-01 00:00:00', TRUE);

-- API接口设计
-- 1. 患者管理API
-- GET /api/patients - 获取患者列表
-- GET /api/patients/:id - 获取患者详情
-- POST /api/patients - 创建患者
-- PUT /api/patients/:id - 更新患者信息
-- DELETE /api/patients/:id - 删除患者

-- 2. 影像管理API
-- GET /api/images - 获取影像列表
-- GET /api/images/:id - 获取影像详情
-- POST /api/images - 上传影像
-- DELETE /api/images/:id - 删除影像

-- 3. 3D模型管理API
-- GET /api/models - 获取模型列表
-- GET /api/models/:id - 获取模型详情
-- POST /api/models - 上传模型
-- DELETE /api/models/:id - 删除模型

-- 4. 诊断结果API
-- GET /api/diagnosis - 获取诊断结果列表
-- GET /api/diagnosis/:id - 获取诊断结果详情
-- POST /api/diagnosis - 创建诊断结果
-- PUT /api/diagnosis/:id - 更新诊断结果

-- 5. 用户管理API
-- GET /api/users - 获取用户列表
-- GET /api/users/:id - 获取用户详情
-- POST /api/users - 创建用户
-- PUT /api/users/:id - 更新用户信息
-- DELETE /api/users/:id - 删除用户

-- 6. 认证API
-- POST /api/auth/login - 登录
-- POST /api/auth/logout - 登出
-- POST /api/auth/refresh - 刷新令牌

-- 7. AI模型API
-- POST /api/ai/analyze - 分析CBCT影像
-- POST /api/ai/train - 训练AI模型
-- GET /api/ai/models - 获取AI模型列表

-- 注意事项
-- 1. 所有API接口需要进行身份验证和授权
-- 2. 影像和模型文件建议存储在文件系统中，数据库中只存储路径
-- 3. 可根据实际需求调整表结构和API接口
-- 4. 建议使用ORM框架（如Sequelize、Prisma等）来操作数据库
-- 5. 生产环境中需要配置数据库备份策略