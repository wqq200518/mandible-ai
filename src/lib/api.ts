// API服务文件
// 用于前端调用后端API

const API_BASE_URL = 'http://localhost:3001/api';
const USE_LOCAL_STORAGE = true; // 当后端服务不可用时，使用localStorage模拟

// API响应类型
interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// 用户类型
interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  email: string;
}

// 患者类型
interface Patient {
  id: number;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  id_card?: string;
  chief_complaint?: string;
  present_illness?: string;
  past_history?: string;
  family_history?: string;
  allergies?: string;
  info_completed: boolean;
  created_at: string;
  updated_at: string;
}

// 影像文件类型
interface ImageFile {
  id: number;
  patient_id?: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  image_type: string;
  window_center?: number;
  window_width?: number;
  slice_count?: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// 诊断报告类型
interface DiagnosisReport {
  id: number;
  patient_id: number;
  image_file_id?: number;
  user_id: number;
  report_date: string;
  diagnosis: string;
  confidence: number;
  findings?: any[];
  recommendations?: any[];
  examination?: string;
  auxiliary_examination?: string;
  treatment_plan?: string;
  ai_diagnosis?: string;
  ai_treatment_plan?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 获取存储的令牌
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// 设置存储的令牌
const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// 清除存储的令牌
const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// 本地存储键名
const STORAGE_KEYS = {
  USERS: 'mandible_ai_users',
  PATIENTS: 'mandible_ai_patients',
  IMAGES: 'mandible_ai_images',
  REPORTS: 'mandible_ai_reports',
  USER: 'mandible_ai_current_user'
};

// 初始化本地存储数据
const initLocalStorage = () => {
  if (typeof window !== 'undefined') {
    // 初始化用户数据
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const defaultUsers = [
        {
          id: '1',
          username: 'admin',
          password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // admin123
          email: 'admin@example.com',
          name: '系统管理员',
          role: 'admin',
          status: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          username: 'doctor',
          password_hash: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // admin123
          email: 'doctor@example.com',
          name: '默认医生',
          role: 'doctor',
          status: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }

    // 初始化患者数据
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify([]));
    }

    // 初始化影像数据
    if (!localStorage.getItem(STORAGE_KEYS.IMAGES)) {
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify([]));
    }

    // 初始化报告数据
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([]));
    }
  }
};

// 本地登录模拟
const localLogin = (username: string, password: string): { success: boolean; user?: User; token?: string; error?: string } => {
  initLocalStorage();
  
  if (typeof window === 'undefined') {
    return { success: false, error: '本地存储不可用' };
  }

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find((u: any) => u.username === username);

  if (!user) {
    return { success: false, error: '用户名或密码错误' };
  }

  // 模拟密码验证（实际应该使用bcrypt）
  if (password === 'admin123') {
    const token = `local_token_${Date.now()}`;
    const userData: User = {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return { success: true, user: userData, token };
  } else {
    return { success: false, error: '用户名或密码错误' };
  }
};

// 通用API请求函数
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // 如果使用本地存储模拟
  if (USE_LOCAL_STORAGE) {
    return handleLocalRequest<T>(endpoint, options);
  }

  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || '请求失败' };
    }

    return { data };
  } catch (error) {
    console.error('API请求失败，切换到本地存储模式:', error);
    return handleLocalRequest<T>(endpoint, options);
  }
};

// 处理本地存储请求
const handleLocalRequest = <T>(endpoint: string, options: RequestInit): Promise<ApiResponse<T>> => {
  initLocalStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟网络延迟
      try {
        // 处理认证请求
        if (endpoint === '/auth/login' && options.method === 'POST') {
          const body = JSON.parse(options.body as string);
          const result = localLogin(body.username, body.password);
          if (result.success) {
            resolve({ data: { token: result.token, user: result.user } as any });
          } else {
            resolve({ error: result.error });
          }
          return;
        }

        if (endpoint === '/auth/logout' && options.method === 'POST') {
          localStorage.removeItem(STORAGE_KEYS.USER);
          clearToken();
          resolve({ data: undefined });
          return;
        }

        // 处理患者请求
        if (endpoint.startsWith('/patients')) {
          handlePatientRequest<T>(endpoint, options, resolve);
          return;
        }

        // 处理影像请求
        if (endpoint.startsWith('/images')) {
          handleImageRequest<T>(endpoint, options, resolve);
          return;
        }

        // 处理报告请求
        if (endpoint.startsWith('/reports')) {
          handleReportRequest<T>(endpoint, options, resolve);
          return;
        }

        resolve({ error: '接口不存在' });
      } catch (error) {
        console.error('本地请求处理失败:', error);
        resolve({ error: '处理请求时发生错误' });
      }
    }, 300); // 模拟网络延迟
  });
};

// 处理患者请求
const handlePatientRequest = <T>(endpoint: string, options: RequestInit, resolve: (result: ApiResponse<T>) => void) => {
  const patients = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENTS) || '[]');

  // 获取患者列表
  if (endpoint === '/patients' && options.method === 'GET') {
    resolve({ data: patients as any });
    return;
  }

  // 获取单个患者
  const match = endpoint.match(/\/patients\/(\d+)/);
  if (match && options.method === 'GET') {
    const id = parseInt(match[1]);
    const patient = patients.find((p: any) => p.id === id);
    if (patient) {
      resolve({ data: patient as any });
    } else {
      resolve({ error: '患者不存在' });
    }
    return;
  }

  // 创建患者
  if (endpoint === '/patients' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const newPatient = {
      id: Date.now(),
      patient_id: body.patient_id || `P${Date.now()}`,
      name: body.name,
      age: body.age,
      gender: body.gender,
      phone: body.phone,
      address: body.address,
      id_card: body.id_card,
      chief_complaint: body.chief_complaint,
      present_illness: body.present_illness,
      past_history: body.past_history,
      family_history: body.family_history,
      allergies: body.allergies,
      info_completed: body.info_completed || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    patients.push(newPatient);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    resolve({ data: newPatient as any });
    return;
  }

  // 更新患者
  if (match && options.method === 'PUT') {
    const id = parseInt(match[1]);
    const body = JSON.parse(options.body as string);
    const index = patients.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      patients[index] = {
        ...patients[index],
        ...body,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      resolve({ data: patients[index] as any });
    } else {
      resolve({ error: '患者不存在' });
    }
    return;
  }

  // 删除患者
  if (match && options.method === 'DELETE') {
    const id = parseInt(match[1]);
    const filteredPatients = patients.filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filteredPatients));
    resolve({ data: undefined });
    return;
  }

  resolve({ error: '接口不存在' });
};

// 处理影像请求
const handleImageRequest = <T>(endpoint: string, options: RequestInit, resolve: (result: ApiResponse<T>) => void) => {
  const images = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES) || '[]');

  // 获取影像列表
  if (endpoint === '/images' && options.method === 'GET') {
    resolve({ data: images as any });
    return;
  }

  // 获取单个影像
  const match = endpoint.match(/\/images\/(\d+)/);
  if (match && options.method === 'GET') {
    const id = parseInt(match[1]);
    const image = images.find((i: any) => i.id === id);
    if (image) {
      resolve({ data: image as any });
    } else {
      resolve({ error: '影像不存在' });
    }
    return;
  }

  // 上传影像
  if (endpoint === '/images/upload' && options.method === 'POST') {
    // 模拟文件上传
    const newImage = {
      id: Date.now(),
      patient_id: 1, // 默认患者
      user_id: 1, // 默认用户
      file_name: 'test_image.dcm',
      file_path: '/uploads/test_image.dcm',
      file_size: 1024 * 1024, // 1MB
      file_type: 'application/dicom',
      image_type: 'CT',
      window_center: 0,
      window_width: 200,
      slice_count: 100,
      status: 'uploaded',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    images.push(newImage);
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
    resolve({ data: newImage as any });
    return;
  }

  // 删除影像
  if (match && options.method === 'DELETE') {
    const id = parseInt(match[1]);
    const filteredImages = images.filter((i: any) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(filteredImages));
    resolve({ data: undefined });
    return;
  }

  resolve({ error: '接口不存在' });
};

// 处理报告请求
const handleReportRequest = <T>(endpoint: string, options: RequestInit, resolve: (result: ApiResponse<T>) => void) => {
  const reports = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTS) || '[]');

  // 获取报告列表
  if (endpoint === '/reports' && options.method === 'GET') {
    resolve({ data: reports as any });
    return;
  }

  // 获取单个报告
  const match = endpoint.match(/\/reports\/(\d+)/);
  if (match && options.method === 'GET') {
    const id = parseInt(match[1]);
    const report = reports.find((r: any) => r.id === id);
    if (report) {
      resolve({ data: report as any });
    } else {
      resolve({ error: '报告不存在' });
    }
    return;
  }

  // 创建报告
  if (endpoint === '/reports' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const newReport = {
      id: Date.now(),
      patient_id: body.patient_id,
      image_file_id: body.image_file_id,
      user_id: 1, // 默认用户
      report_date: new Date().toISOString(),
      diagnosis: body.diagnosis,
      confidence: body.confidence || 0.85,
      findings: body.findings || [],
      recommendations: body.recommendations || [],
      examination: body.examination,
      auxiliary_examination: body.auxiliary_examination,
      treatment_plan: body.treatment_plan,
      ai_diagnosis: body.ai_diagnosis,
      ai_treatment_plan: body.ai_treatment_plan,
      status: body.status || 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    reports.push(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    resolve({ data: newReport as any });
    return;
  }

  // 更新报告
  if (match && options.method === 'PUT') {
    const id = parseInt(match[1]);
    const body = JSON.parse(options.body as string);
    const index = reports.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      reports[index] = {
        ...reports[index],
        ...body,
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      resolve({ data: reports[index] as any });
    } else {
      resolve({ error: '报告不存在' });
    }
    return;
  }

  // 删除报告
  if (match && options.method === 'DELETE') {
    const id = parseInt(match[1]);
    const filteredReports = reports.filter((r: any) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filteredReports));
    resolve({ data: undefined });
    return;
  }

  resolve({ error: '接口不存在' });
};

// 认证API
export const authApi = {
  // 登录
  login: async (username: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.data?.token) {
      setToken(response.data.token);
    }

    return response;
  },

  // 登出
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiRequest<void>('/auth/logout', {
      method: 'POST',
    });

    if (response.data !== undefined) {
      clearToken();
    }

    return response;
  },

  // 刷新令牌
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const token = getToken();
    // 模拟刷新令牌
    const newToken = `local_token_${Date.now()}`;
    setToken(newToken);
    return { data: { token: newToken } };
  },
};

// 患者API
export const patientsApi = {
  // 获取患者列表
  getPatients: async (): Promise<ApiResponse<Patient[]>> => {
    return apiRequest<Patient[]>('/patients');
  },

  // 获取患者详情
  getPatient: async (id: string): Promise<ApiResponse<Patient>> => {
    return apiRequest<Patient>(`/patients/${id}`);
  },

  // 创建患者
  createPatient: async (patient: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    return apiRequest<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    });
  },

  // 更新患者信息
  updatePatient: async (id: string, patient: Partial<Patient>): Promise<ApiResponse<Patient>> => {
    return apiRequest<Patient>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    });
  },

  // 删除患者
  deletePatient: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/patients/${id}`, {
      method: 'DELETE',
    });
  },
};

// 影像API
export const imagesApi = {
  // 获取影像列表
  getImages: async (): Promise<ApiResponse<ImageFile[]>> => {
    return apiRequest<ImageFile[]>('/images');
  },

  // 获取影像详情
  getImage: async (id: number): Promise<ApiResponse<ImageFile>> => {
    return apiRequest<ImageFile>(`/images/${id}`);
  },

  // 上传影像
  uploadImage: async (formData: FormData): Promise<ApiResponse<ImageFile>> => {
    // 模拟文件上传
    return apiRequest<ImageFile>('/images/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // 删除影像
  deleteImage: async (id: number): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/images/${id}`, {
      method: 'DELETE',
    });
  },
};

// 诊断报告API
export const diagnosisApi = {
  // 获取诊断报告列表
  getDiagnosisResults: async (): Promise<ApiResponse<DiagnosisReport[]>> => {
    return apiRequest<DiagnosisReport[]>('/reports');
  },

  // 获取诊断报告详情
  getDiagnosisResult: async (id: number): Promise<ApiResponse<DiagnosisReport>> => {
    return apiRequest<DiagnosisReport>(`/reports/${id}`);
  },

  // 创建诊断报告
  createDiagnosisResult: async (result: Partial<DiagnosisReport>): Promise<ApiResponse<DiagnosisReport>> => {
    return apiRequest<DiagnosisReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  },

  // 更新诊断报告
  updateDiagnosisResult: async (id: number, result: Partial<DiagnosisReport>): Promise<ApiResponse<DiagnosisReport>> => {
    return apiRequest<DiagnosisReport>(`/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(result),
    });
  },

  // 删除诊断报告
  deleteDiagnosisResult: async (id: number): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/reports/${id}`, {
      method: 'DELETE',
    });
  },
};

// 导出工具函数
export { getToken, setToken, clearToken };