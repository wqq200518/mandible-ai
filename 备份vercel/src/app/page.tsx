'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // 检查用户是否登录
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
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

  if (!user) {
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
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '500' }}>
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
          {user.role === 'admin' && (
            <a href="/training" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <span style={{ fontSize: '18px' }}>🏋️</span>
              <span>模型训练</span>
            </a>
          )}
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
      <main className="app-main-content flex-1 overflow-y-auto" style={{ marginLeft: '250px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* 顶部蓝色横幅 */}
        <section style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white', padding: '32px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px' }}>🦷</span>
                <h1 style={{ fontSize: '28px', fontWeight: '700' }}>CBCT智能诊断系统</h1>
              </div>
              <p style={{ fontSize: '16px', opacity: '0.9', marginBottom: '16px' }}>AI-Powered Mandible Diagnostic System</p>
              <p style={{ fontSize: '16px', opacity: '0.9', marginBottom: '24px', maxWidth: '600px' }}>基于深度学习3D CNN的新一代医学影像智能分析平台，提供精准分割、多病种分类、全周期动态追踪等专业服务</p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }}>3D CNN 深度学习</span>
                <span style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }}>精准分割 98.5%</span>
                <span style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }}>实时分析</span>
                <span style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.2)' }}>全周期追踪</span>
              </div>
              <button style={{ background: 'white', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🚀</span>
                <span>开始智能诊断</span>
                <span>→</span>
              </button>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>👥</span>
                  <span>服务患者</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>2,847</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>📦</span>
                  <span>诊断数据包</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>8,562</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px 20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                <div style={{ fontSize: '14px', opacity: '0.8', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>🎯</span>
                  <span>诊断准确率</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>96.8%</div>
              </div>
            </div>
          </div>
        </section>

        {/* 状态卡片 */}
        <section style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📊</span>
                  <span>今日诊断</span>
                </div>
                <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>↗</span>
                  <span>+12%</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>28</div>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                  <span>📈</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>👥</span>
                  <span>患者总数</span>
                </div>
                <span style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>↗</span>
                  <span>本月新增23</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>156</div>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                  <span>👨‍⚕️</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📦</span>
                  <span>数据包</span>
                </div>
                <span style={{ fontSize: '12px', color: '#3b82f6' }}>总存储126GB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>512</div>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                  <span>💾</span>
                </div>
              </div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span>
                  <span>系统状态</span>
                </div>
                <span style={{ fontSize: '12px', color: '#10b981' }}>运行天数365</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>正常</div>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                  <span>✅</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 快速导航和最近诊断 */}
        <section style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* 快速导航 */}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span>
                <span>快速导航</span>
              </h2>
              <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '20px' }}>
                <a href="/diagnosis" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', marginBottom: '12px', textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
                      <span style={{ fontSize: '20px' }}>🔬</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '16px' }}>智能诊断</div>
                      <div style={{ fontSize: '14px', color: '#666666' }}>上传CBCT数据进行AI诊断</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px' }}>→</span>
                </a>

                <a href="/chat" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', marginBottom: '12px', textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#ccfbf1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6' }}>
                      <span style={{ fontSize: '20px' }}>💬</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '16px' }}>诊断问答</div>
                      <div style={{ fontSize: '14px', color: '#666666' }}>AI助手解答口腔疾病问题</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px' }}>→</span>
                </a>
                <a href="/cases" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', marginBottom: '12px', textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                      <span style={{ fontSize: '20px' }}>📁</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '16px' }}>病例管理</div>
                      <div style={{ fontSize: '14px', color: '#666666' }}>管理患者病例数据和诊断记录</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px' }}>→</span>
                </a>
                {user.role === 'admin' && (
                  <a href="/training" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', marginBottom: '12px', textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', backgroundColor: '#ffedd5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316' }}>
                        <span style={{ fontSize: '20px' }}>🧠</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '16px' }}>模型训练</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>训练和优化AI诊断模型</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '18px' }}>→</span>
                  </a>
                )}
                <a href="/settings" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '8px', textDecoration: 'none', color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                      <span style={{ fontSize: '20px' }}>⚙️</span>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', fontSize: '16px' }}>系统设置</div>
                      <div style={{ fontSize: '14px', color: '#666666' }}>配置系统参数和偏好</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '18px' }}>→</span>
                </a>
              </div>
            </div>

            {/* 最近诊断记录 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⏰</span>
                  <span>最近诊断记录</span>
                </h2>
                <a href="/cases" style={{ color: '#3b82f6', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                  <span>查看全部</span>
                  <span>→</span>
                </a>
              </div>
              <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', fontSize: '14px', fontWeight: '500' }}>
                        张
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '16px' }}>张**</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>P001 | 术后复查</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#666666' }}>10:35</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#10b981' }}>健康度</span>
                        <span style={{ fontWeight: '500', fontSize: '16px' }}>98%</span>
                        <span style={{ fontSize: '14px', color: '#10b981' }}>↗</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '14px', fontWeight: '500' }}>
                        李
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '16px' }}>李**</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>P002 | 初诊</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#666666' }}>09:22</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#f59e0b' }}>骨质囊种</span>
                        <span style={{ fontWeight: '500', fontSize: '16px' }}>87%</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', fontSize: '14px', fontWeight: '500' }}>
                        王
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '16px' }}>王**</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>P003 | 定期随访</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#666666' }}>昨天</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#10b981' }}>健康度</span>
                        <span style={{ fontWeight: '500', fontSize: '16px' }}>95%</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontSize: '14px', fontWeight: '500' }}>
                        赵
                      </div>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '16px' }}>赵**</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>P004 | 治疗中</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '14px', color: '#666666' }}>昨天</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '14px', color: '#dc2626' }}>骨髓炎</span>
                        <span style={{ fontWeight: '500', fontSize: '16px' }}>78%</span>
                        <span style={{ fontSize: '14px', color: '#dc2626' }}>↘</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心功能 */}
        <section style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🔍</span>
            <span>核心功能</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '24px' }}>🔬</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>智能分割</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>基于3D CNN的下颌骨自动分割，Dice系数达98.5%</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>多病种分类</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>支持囊肿、肿瘤、骨髓炎等多种下颌骨疾病识别</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '24px' }}>📈</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>全周期追踪</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>患者数据包管理，支持术前术后对比分析</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#ffedd5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', margin: '0 auto 16px' }}>
                <span style={{ fontSize: '24px' }}>🤖</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>AI诊断助手</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>智能问答系统，辅助医生快速决策</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage