'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const TrainingPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [epochs, setEpochs] = useState(50)
  const [batchSize, setBatchSize] = useState(16)
  const [learningRate, setLearningRate] = useState(0.001)

  useEffect(() => {
    // 检查用户是否登录
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      // 检查用户角色，只有管理员可以访问
      if (parsedUser.role !== 'admin') {
        router.push('/')
      }
    } else {
      // 未登录，跳转到登录页
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    // 清除用户信息
    localStorage.removeItem('user')
    // 跳转到登录页
    router.push('/login')
  }

  const handleTrain = () => {
    setIsTraining(true)
    setTrainingProgress(0)

    // 模拟训练过程
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prev + 1
      })
    }, 200)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 侧边栏导航 */}
      <aside style={{ width: '250px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', height: '100vh', position: 'fixed', left: '0', top: '0', overflowY: 'auto', zIndex: '100' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🦷</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '18px' }}>Mandible AI</div>
              <div style={{ fontSize: '12px', color: '#666666' }}>AI-Powered Diagnostic System</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>🏠</span>
            <span>首页</span>
          </a>
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>💬</span>
            <span>诊断问答</span>
          </a>
          <a href="/diagnosis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <span>智能诊断</span>
          </a>
          <a href="/cases" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>📁</span>
            <span>病例管理</span>
          </a>
          <a href="/training" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#fff7ed', color: '#c2410c', fontWeight: '500' }}>
            <span style={{ fontSize: '18px' }}>🏋️</span>
            <span>模型训练</span>
          </a>
          <a href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            <span>系统设置</span>
          </a>
          <a href="/help" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>❓</span>
            <span>帮助中心</span>
          </a>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: '500' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{user.username}</div>
                <div style={{ fontSize: '12px', color: '#666666' }}>{user.role === 'admin' ? '管理员' : user.role === 'doctor' ? '医生' : '研究员'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              <span style={{ fontSize: '12px', color: '#666666' }}>正常</span>
            </div>
          </div>
          <button 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: '#f3f4f6', border: 'none', cursor: 'pointer' }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onClick={handleLogout}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main style={{ marginLeft: '250px', flex: '1', overflowY: 'auto', height: '100vh' }}>
        {/* 顶部导航 */}
        <header style={{ backgroundColor: '#c2410c', color: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>模型训练与微调</h1>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>训练深度学习模型以提高诊断准确率</p>
            </div>
          </div>
        </header>

        {/* 当前模型状态和训练曲线 */}
        <section style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* 当前模型状态 */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📊</span>
                <span>当前模型状态</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>模型版本</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>v2.4</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>参数量</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>512K</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>准确率</div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>86.5%</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>最后训练</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>2026-04-01</div>
                </div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#fff7ed', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', color: '#78350f' }}>训练样本</div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#c2410c' }}>200例</div>
              </div>
            </div>

            {/* 训练曲线 */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📈</span>
                <span>训练曲线</span>
              </h2>
              <div style={{ width: '100%', height: '200px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 200">
                  {/* 网格线 */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)"/>
                  
                  {/* Y轴标签 */}
                  <text x="10" y="20" fontSize="12" fill="#666666">1</text>
                  <text x="10" y="70" fontSize="12" fill="#666666">0.75</text>
                  <text x="10" y="120" fontSize="12" fill="#666666">0.5</text>
                  <text x="10" y="170" fontSize="12" fill="#666666">0.25</text>
                  <text x="10" y="195" fontSize="12" fill="#666666">0</text>
                  
                  {/* X轴标签 */}
                  <text x="30" y="195" fontSize="12" fill="#666666">1</text>
                  <text x="70" y="195" fontSize="12" fill="#666666">2</text>
                  <text x="110" y="195" fontSize="12" fill="#666666">3</text>
                  <text x="150" y="195" fontSize="12" fill="#666666">4</text>
                  <text x="190" y="195" fontSize="12" fill="#666666">5</text>
                  <text x="230" y="195" fontSize="12" fill="#666666">6</text>
                  <text x="270" y="195" fontSize="12" fill="#666666">7</text>
                  <text x="310" y="195" fontSize="12" fill="#666666">8</text>
                  <text x="350" y="195" fontSize="12" fill="#666666">9</text>
                  <text x="390" y="195" fontSize="12" fill="#666666">10</text>
                  
                  {/* 损失曲线 */}
                  <path d="M 30 20 L 70 60 L 110 80 L 150 100 L 190 120 L 230 130 L 270 140 L 310 150 L 350 155 L 390 160" fill="none" stroke="#ef4444" strokeWidth="2"/>
                  
                  {/* 准确率曲线 */}
                  <path d="M 30 100 L 70 80 L 110 70 L 150 60 L 190 50 L 230 45 L 270 40 L 310 38 L 350 36 L 390 35" fill="none" stroke="#10b981" strokeWidth="2"/>
                  
                  {/* 图例 */}
                  <circle cx="30" cy="15" r="4" fill="#ef4444"/>
                  <text x="40" y="20" fontSize="12" fill="#666666">损失</text>
                  <circle cx="100" cy="15" r="4" fill="#10b981"/>
                  <text x="110" y="20" fontSize="12" fill="#666666">准确率</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* 训练参数 */}
        <section style={{ padding: '0 24px 24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚙️</span>
              <span>训练参数</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>训练轮数</label>
                <input
                  type="number"
                  defaultValue={10}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  min="1"
                  max="1000"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>批次大小</label>
                <input
                  type="number"
                  defaultValue={8}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  min="1"
                  max="128"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>学习率</label>
                <input
                  type="number"
                  defaultValue={0.001}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  min="0.0001"
                  max="1"
                  step="0.0001"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>优化器</label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <option>Adam</option>
                  <option>SGD</option>
                  <option>RMSprop</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>损失函数</label>
                <select 
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <option>交叉熵</option>
                  <option>MSE</option>
                  <option>MAE</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#666666', marginBottom: '8px' }}>验证集比例(%)</label>
                <input
                  type="number"
                  defaultValue={20}
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#f97316', 
                  color: 'white', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f97316'}
              >
                开始训练
              </button>
              <button 
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: 'white', 
                  color: '#666666', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  fontWeight: '500',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                高级设置
              </button>
            </div>
          </div>
        </section>

        {/* 训练日志 */}
        <section style={{ padding: '0 24px 24px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📋</span>
                <span>训练日志</span>
              </h2>
              <button 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: 'white', 
                  color: '#666666', 
                  borderRadius: '8px', 
                  fontSize: '14px', 
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <span>📤</span>
                <span>导出日志</span>
              </button>
            </div>
            <div style={{ background: '#1e293b', color: 'white', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.5', maxHeight: '300px', overflowY: 'auto' }}>
              <div>[2026-04-01 10:30:20] 开始训练, Epoch 1/10</div>
              <div>[2026-04-01 10:31:05] Epoch 1 完成, Loss: 0.432</div>
              <div>[2026-04-01 10:31:50] Epoch 2 完成, Loss: 0.321</div>
              <div>[2026-04-01 10:32:35] Epoch 3 完成, Loss: 0.256</div>
              <div>[2026-04-01 10:33:20] Epoch 4 完成, Loss: 0.198</div>
              <div>[2026-04-01 10:34:05] Epoch 5 完成, Loss: 0.165</div>
              <div>[2026-04-01 10:34:50] Epoch 6 完成, Loss: 0.142</div>
              <div>[2026-04-01 10:35:35] Epoch 7 完成, Loss: 0.125</div>
              <div>[2026-04-01 10:36:20] Epoch 8 完成, Loss: 0.112</div>
              <div>[2026-04-01 10:37:05] Epoch 9 完成, Loss: 0.101</div>
              <div>[2026-04-01 10:37:50] Epoch 10 完成, Loss: 0.092</div>
              <div>[2026-04-01 10:37:55] 训练完成, 准确率: 86.5%</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default TrainingPage