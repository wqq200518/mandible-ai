'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ReconstructionPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [showControls, setShowControls] = useState(true)
  const [threshold, setThreshold] = useState({ min: 100, max: 3000 })
  const [isGenerating, setIsGenerating] = useState(false)
  const [show3D, setShow3D] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)

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

  useEffect(() => {
    if (canvasRef.current) {
      initThreeJS()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const initThreeJS = () => {
    // 这里将使用Three.js实现3D模型查看
    // 由于需要引入Three.js库，我们先创建一个简单的3D渲染示例
    setIsLoading(true)
    
    // 模拟加载过程
    setTimeout(() => {
      setModelLoaded(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    lastMousePosition.current = { x: e.clientX, y: e.clientY }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      const deltaX = e.clientX - lastMousePosition.current.x
      const deltaY = e.clientY - lastMousePosition.current.y
      
      setRotation(prev => ({
        x: prev.x + deltaY * 0.01,
        y: prev.y + deltaX * 0.01
      }))
      
      lastMousePosition.current = { x: e.clientX, y: e.clientY }
    }
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  const handleWheel = (e: React.WheelEvent) => {
    setScale(prev => Math.max(0.1, Math.min(5, prev + e.deltaY * -0.001)))
  }

  const handleReset = () => {
    setRotation({ x: 0, y: 0 })
    setScale(1)
    setPosition({ x: 0, y: 0, z: 0 })
  }

  const handleLogout = () => {
    // 清除用户信息
    localStorage.removeItem('user')
    // 跳转到登录页
    router.push('/login')
  }

  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>加载中...</div>
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 左侧导航栏 */}
      <aside style={{ width: '250px', backgroundColor: 'white', borderRight: '1px solid #e2e8f0', height: '100vh', position: 'fixed', left: '0', top: '0', overflowY: 'auto', zIndex: '100', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🦷</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '18px' }}>Mandible AI</div>
              <div style={{ fontSize: '12px', color: '#666666' }}>AI-Powered Diagnostic System</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
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
          <a href="/reconstruction" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '500' }}>
            <span style={{ fontSize: '18px' }}>🔮</span>
            <span>3D重建</span>
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
      <main style={{ marginLeft: '250px', flex: '1', overflowY: 'auto', height: '100vh' }}>
        {/* 顶部导航 */}
        <header style={{ backgroundColor: '#15803d', color: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>3D重建</h1>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>三维模型可视化 · 交互式查看</p>
            </div>
            <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#15803d', borderRadius: '8px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>+</span>
              <span>上传DICOM</span>
            </button>
          </div>
        </header>

        {/* 3D模型查看区域 */}
        <section style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', height: 'calc(100vh - 180px)' }}>
            {/* 3D渲染区域 */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔄</div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>正在加载3D模型...</p>
                  <div style={{ width: '200px', height: '4px', backgroundColor: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', backgroundColor: '#3b82f6', animation: 'loading 1.5s infinite ease-in-out' }}></div>
                  </div>
                </div>
              ) : modelLoaded ? (
                <div 
                  style={{ width: '100%', height: '100%' }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                >
                  {/* 3D模型渲染区域 */}
                  <canvas 
                    ref={canvasRef}
                    style={{ width: '100%', height: '100%' }}
                  />
                  
                  {/* 3D模型替代显示 */}
                  {show3D && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      transform: `rotateX(${rotation.x}rad) rotateY(${rotation.y}rad) scale(${scale})`,
                      transition: 'transform 0.1s ease-out'
                    }}>
                      <div style={{ 
                        width: '300px', 
                        height: '300px', 
                        borderRadius: '50%', 
                        backgroundColor: `rgba(${threshold.min > 100 ? 59 : 100}, ${threshold.max < 1000 ? 130 : 200}, ${threshold.max > 2000 ? 246 : 150}, 0.2)`, 
                        border: '2px solid #3b82f6',
                        position: 'relative',
                        boxShadow: `0 0 50px rgba(${threshold.min > 100 ? 59 : 100}, ${threshold.max < 1000 ? 130 : 200}, ${threshold.max > 2000 ? 246 : 150}, 0.5)`
                      }}>
                        {/* 牙齿模型示意 */}
                        <div style={{ 
                          position: 'absolute', 
                          top: '20%', 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          width: '150px',
                          height: '150px',
                          backgroundColor: `rgba(${threshold.min > 100 ? 255 : 200}, ${threshold.max < 1000 ? 255 : 200}, ${threshold.max > 2000 ? 255 : 180}, 0.8)`,
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }} />
                        
                        {/* 阈值信息 */}
                        <div style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}>
                          阈值: {threshold.min} - {threshold.max} HU
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 3D模型关闭状态 */}
                  {!show3D && (
                    <div style={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      backgroundColor: 'rgba(15, 23, 42, 0.8)'
                    }}>
                      <div style={{ 
                        textAlign: 'center', 
                        color: 'white'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
                        <p style={{ fontSize: '16px', marginBottom: '8px' }}>3D模型已关闭</p>
                        <p style={{ fontSize: '14px', opacity: '0.7' }}>请在控制面板中开启3D模型显示</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>请上传DICOM文件进行3D重建</p>
                  <button style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                    上传DICOM文件
                  </button>
                </div>
              )}
              
              {/* 操作提示 */}
              <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: 'white', fontSize: '12px', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '8px 12px', borderRadius: '6px' }}>
                <p>💡 操作提示：</p>
                <p>• 鼠标拖动：旋转模型</p>
                <p>• 滚轮：缩放模型</p>
                <p>• 双击：重置视角</p>
              </div>
            </div>

            {/* 控制面板 */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#333333' }}>模型控制</h3>
              
              {/* 旋转控制 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>旋转</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>X 轴</label>
                    <input 
                      type="range" 
                      min="-3.14" 
                      max="3.14" 
                      step="0.01" 
                      value={rotation.x}
                      onChange={(e) => setRotation({ ...rotation, x: parseFloat(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '12px', color: '#666666' }}>{rotation.x.toFixed(2)}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>Y 轴</label>
                    <input 
                      type="range" 
                      min="-3.14" 
                      max="3.14" 
                      step="0.01" 
                      value={rotation.y}
                      onChange={(e) => setRotation({ ...rotation, y: parseFloat(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                    <span style={{ fontSize: '12px', color: '#666666' }}>{rotation.y.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* 缩放控制 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>缩放</h4>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1" 
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', color: '#666666' }}>{scale.toFixed(1)}x</span>
              </div>

              {/* 位置控制 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>位置</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>X</label>
                    <input 
                      type="range" 
                      min="-100" 
                      max="100" 
                      step="1" 
                      value={position.x}
                      onChange={(e) => setPosition({ ...position, x: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>Y</label>
                    <input 
                      type="range" 
                      min="-100" 
                      max="100" 
                      step="1" 
                      value={position.y}
                      onChange={(e) => setPosition({ ...position, y: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>Z</label>
                    <input 
                      type="range" 
                      min="-100" 
                      max="100" 
                      step="1" 
                      value={position.z}
                      onChange={(e) => setPosition({ ...position, z: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* 阈值调整 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>阈值调整</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* 阈值预设 */}
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>预设阈值</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      <button 
                        onClick={() => setThreshold({ min: 100, max: 3000 })} 
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#f3f4f6', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          cursor: 'pointer'
                        }}
                      >
                        骨头
                      </button>
                      <button 
                        onClick={() => setThreshold({ min: -1000, max: -500 })} 
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#f3f4f6', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          cursor: 'pointer'
                        }}
                      >
                        空气
                      </button>
                      <button 
                        onClick={() => setThreshold({ min: -500, max: 100 })} 
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#f3f4f6', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          cursor: 'pointer'
                        }}
                      >
                        软组织
                      </button>
                      <button 
                        onClick={() => setThreshold({ min: 3000, max: 5000 })} 
                        style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#f3f4f6', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          cursor: 'pointer'
                        }}
                      >
                        金属
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>最小值: {threshold.min} HU</label>
                    <input 
                      type="range" 
                      min="-1000" 
                      max="5000" 
                      step="10" 
                      value={threshold.min}
                      onChange={(e) => setThreshold({ ...threshold, min: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#666666', display: 'block', marginBottom: '4px' }}>最大值: {threshold.max} HU</label>
                    <input 
                      type="range" 
                      min="-1000" 
                      max="5000" 
                      step="10" 
                      value={threshold.max}
                      onChange={(e) => setThreshold({ ...threshold, max: parseInt(e.target.value) })}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setIsGenerating(true)
                      setTimeout(() => {
                        setIsGenerating(false)
                        alert('3D模型已根据阈值重新生成！')
                      }, 2000)
                    }}
                    style={{ 
                      padding: '10px', 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      textAlign: 'center',
                      marginTop: '8px'
                    }}
                    disabled={isGenerating}
                  >
                    {isGenerating ? '生成中...' : '根据阈值生成模型'}
                  </button>
                </div>
              </div>

              {/* 模型操作 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>模型操作</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={handleReset}
                    style={{ 
                      padding: '10px', 
                      backgroundColor: '#f3f4f6', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    重置视角
                  </button>
                  <button 
                    style={{ 
                      padding: '10px', 
                      backgroundColor: '#f3f4f6', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    导出模型
                  </button>
                  <button 
                    style={{ 
                      padding: '10px', 
                      backgroundColor: '#f3f4f6', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px', 
                      fontSize: '14px', 
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    保存视图
                  </button>
                </div>
              </div>

              {/* 显示选项 */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>显示选项</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#333333' }}>显示3D模型</span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                    <input 
                      type="checkbox" 
                      checked={show3D} 
                      onChange={(e) => setShow3D(e.target.checked)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{ 
                      position: 'absolute', 
                      cursor: 'pointer', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      bottom: 0, 
                      backgroundColor: show3D ? '#3b82f6' : '#e2e8f0', 
                      transition: '.4s', 
                      borderRadius: '24px'
                    }}></span>
                    <span style={{ 
                      position: 'absolute', 
                      content: '', 
                      height: '18px', 
                      width: '18px', 
                      left: '3px', 
                      bottom: '3px', 
                      backgroundColor: 'white', 
                      transition: '.4s', 
                      borderRadius: '50%',
                      transform: show3D ? 'translateX(26px)' : 'translateX(0)'
                    }}></span>
                  </label>
                </div>
              </div>

              {/* 模型信息 */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#666666' }}>模型信息</h4>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#666666' }}>模型类型:</span>
                    <span style={{ fontWeight: '500' }}>牙齿3D模型</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#666666' }}>顶点数:</span>
                    <span style={{ fontWeight: '500' }}>12,500</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#666666' }}>面数:</span>
                    <span style={{ fontWeight: '500' }}>25,000</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#666666' }}>文件大小:</span>
                    <span style={{ fontWeight: '500' }}>2.5 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ReconstructionPage