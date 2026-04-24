'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const HelpPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('getting-started')
  const [showManualModal, setShowManualModal] = useState(false)
  const [showChatModal, setShowChatModal] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '您好！欢迎使用Mandible AI智能诊断系统，有什么可以帮助您的吗？',
      sender: 'bot',
      time: '09:00'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

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

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return
    
    // 添加用户消息
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages([...messages, newUserMessage])
    setInputMessage('')
    
    // 模拟客服回复
    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        text: '感谢您的咨询，我正在处理您的问题，请稍候...',
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botReply])
    }, 1000)
  }

  const faqs = [
    {
      id: 1,
      question: '如何上传CBCT影像？',
      answer: '在智能诊断页面，点击"选择文件"按钮，选择您的CBCT影像文件（支持DICOM和NIfTI格式），然后点击"开始分析"按钮即可。'
    },
    {
      id: 2,
      question: '系统支持哪些文件格式？',
      answer: '系统支持DICOM (.dcm)、NIfTI (.nii, .nii.gz)格式的CBCT影像文件。'
    },
    {
      id: 3,
      question: '分析结果需要多长时间？',
      answer: '分析时间取决于影像的大小和复杂性，通常需要1-2分钟。'
    },
    {
      id: 4,
      question: '如何查看历史诊断记录？',
      answer: '在诊断输出页面，您可以查看所有历史诊断记录，并通过筛选功能查找特定记录。'
    },
    {
      id: 5,
      question: '如何管理患者病例？',
      answer: '在病例管理页面，您可以添加、编辑、查看和删除患者病例。'
    },
    {
      id: 6,
      question: '如何训练和优化AI模型？',
      answer: '只有管理员可以访问模型训练页面，在该页面您可以配置训练参数并开始训练模型。'
    }
  ]

  if (!user) {
    return null
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
          <a href="/help" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#fff7ed', color: '#c2410c', fontWeight: '500' }}>
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
        <header style={{ backgroundColor: '#0891b2', color: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>帮助中心</h1>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>常见问题解答和使用指南</p>
            </div>
          </div>
        </header>

        {/* 帮助功能模块 */}
        <section style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setShowManualModal(true)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📖</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>使用手册</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>详细功能说明</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎥</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>视频教程</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>操作演示视频</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setShowChatModal(true)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>在线客服</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>实时技术支持</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>邮箱支持</h3>
              <p style={{ fontSize: '14px', color: '#666666' }}>发送问题反馈</p>
            </div>
          </div>

          {/* 系统信息 */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>系统信息</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>系统版本</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>v2.4.0</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>AI模型版本</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>v2.4</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>最后更新</div>
                <div style={{ fontSize: '18px', fontWeight: '600' }}>2026-04-01</div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>服务状态</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>正常运行</div>
              </div>
            </div>
          </div>

          {/* 常见问题 */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>常见问题</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>如何上传CBCT文件进行诊断？</h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>在智能诊断页面，点击"选择文件"按钮，选择您的CBCT影像文件（支持DICOM和NIfTI格式），然后点击"开始分析"按钮即可。</p>
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>支持哪些诊断类型？</h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>系统支持下颌骨骨折、下颌骨囊肿、下颌骨肿瘤等多种口腔颌面部疾病的诊断。</p>
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>如何查看历史诊断记录？</h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>在诊断输出页面，您可以查看所有历史诊断记录，并通过筛选功能查找特定记录。</p>
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>模型训练需要多少数据？</h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>为了获得最佳效果，建议使用至少100例标注好的CBCT影像数据进行模型训练。</p>
              </div>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>如何提高诊断准确率？</h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>确保上传的CBCT影像质量清晰，扫描参数设置合理，同时定期使用新数据训练模型以提高其性能。</p>
              </div>
              <div style={{ paddingBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>数据安全如何保障？</h3>
                <p style={{ fontSize: '14px', color: '#666666' }}>系统采用端到端加密技术，所有数据存储在本地服务器，不会上传到云端，确保患者数据的安全性和隐私性。</p>
              </div>
            </div>
          </div>

          {/* 联系我们 */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>联系我们</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px' }}>📧</span>
                  <span style={{ fontSize: '14px', color: '#666666' }}>chelikoeppen@gmail.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '18px' }}>📞</span>
                  <span style={{ fontSize: '14px', color: '#666666' }}>+86 15730070955</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🌐</span>
                  <span style={{ fontSize: '14px', color: '#666666' }}>官方网站</span>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>工作时间</div>
                  <div style={{ fontSize: '14px' }}>周一至周五: 9:00 - 18:00</div>
                  <div style={{ fontSize: '14px' }}>周六、周日: 休息</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使用手册悬浮窗 */}
        {showManualModal && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }} onClick={() => setShowManualModal(false)}>
            <div style={{ background: 'white', borderRadius: '12px', width: '90%', maxWidth: '800px', maxHeight: '80vh', overflow: 'auto', padding: '32px' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📖</span>
                  <span>使用手册</span>
                </h2>
                <button 
                  style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666666' }}
                  onClick={() => setShowManualModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '24px' }}>
                {/* 左侧导航 */}
                <div style={{ width: '200px', flexShrink: '0' }}>
                  <nav style={{ borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#overview" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>系统概述</a>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#login" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>登录与权限</a>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#diagnosis" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>智能诊断</a>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#chat" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>智能问答</a>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#cases" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>病例管理</a>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#training" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>模型训练</a>
                      </li>
                      <li style={{ marginBottom: '12px' }}>
                        <a href="#settings" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>系统设置</a>
                      </li>
                      <li>
                        <a href="#troubleshooting" style={{ display: 'block', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}>常见问题</a>
                      </li>
                    </ul>
                  </nav>
                </div>
                
                {/* 右侧内容 */}
                <div style={{ flex: '1' }}>
                  <section id="overview" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>1. 系统概述</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>Mandible AI 下颌骨智能诊断系统是基于深度学习技术的口腔CBCT影像分析平台，旨在帮助医生快速、准确地诊断下颌骨相关疾病。</p>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>系统主要功能包括：智能问答、智能诊断、诊断输出、病例管理、模型训练和系统设置。</p>
                  </section>
                  
                  <section id="login" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>2. 登录与权限</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>系统支持三种角色登录：</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '24px', marginBottom: '12px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}><strong>管理员</strong>：拥有所有功能权限，包括模型训练和用户管理</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}><strong>医生</strong>：可以使用智能诊断、智能问答和病例管理功能</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}><strong>研究员</strong>：可以使用智能诊断、智能问答和病例管理功能</li>
                    </ul>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>测试账号：</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '24px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>管理员：admin / admin123</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>医生：doctor / doctor123</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>研究员：researcher / research123</li>
                    </ul>
                  </section>
                  
                  <section id="diagnosis" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>3. 智能诊断</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>智能诊断功能允许用户上传CBCT影像并进行自动分析，步骤如下：</p>
                    <ol style={{ listStyle: 'decimal', paddingLeft: '24px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>在左侧导航栏中点击"智能诊断"</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"选择文件"按钮，选择您的CBCT影像文件</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>支持的文件格式：DICOM (.dcm)、NIfTI (.nii, .nii.gz)</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"开始分析"按钮，系统将自动进行分析</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>分析完成后，您可以查看诊断结果和详细信息</li>
                    </ol>
                  </section>
                  
                  <section id="chat" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>4. 智能问答</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>智能问答功能允许用户与AI助手进行医学问题问答，步骤如下：</p>
                    <ol style={{ listStyle: 'decimal', paddingLeft: '24px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>在左侧导航栏中点击"智能问答"</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>在输入框中输入您的问题</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"发送"按钮或按Enter键</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>AI助手会为您提供详细的回答</li>
                    </ol>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginTop: '12px' }}>可询问的问题类型包括：口腔健康相关问题、CBCT影像诊断相关问题、系统使用相关问题。</p>
                  </section>
                  
                  <section id="cases" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>5. 病例管理</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>病例管理功能允许用户管理患者病例和历史记录，步骤如下：</p>
                    <ol style={{ listStyle: 'decimal', paddingLeft: '24px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>在左侧导航栏中点击"病例管理"</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"添加病例"按钮添加新病例</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"查看"按钮查看病例详情</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"编辑"按钮编辑病例信息</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>点击"删除"按钮删除病例（需谨慎操作）</li>
                    </ol>
                  </section>
                  
                  <section id="training" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>6. 模型训练</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>模型训练功能仅对管理员开放，允许用户训练和优化AI模型，步骤如下：</p>
                    <ol style={{ listStyle: 'decimal', paddingLeft: '24px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>在左侧导航栏中点击"模型训练"（仅管理员可见）</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>配置训练参数：训练轮数、批量大小、学习率等</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>选择训练数据集和模型类型</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>点击"开始训练"按钮开始训练</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>训练完成后，您可以在训练历史中查看训练结果</li>
                    </ol>
                  </section>
                  
                  <section id="settings" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>7. 系统设置</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '12px' }}>系统设置功能允许用户配置系统参数和偏好设置，包括：</p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '24px' }}>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>常规设置：语言、时区等</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>数据库设置：数据库地址、备份策略等</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333', marginBottom: '8px' }}>通知设置：诊断完成通知、训练进度通知等</li>
                      <li style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>外观设置：主题模式等</li>
                    </ul>
                  </section>
                  
                  <section id="troubleshooting" style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>8. 常见问题</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: 如何上传CBCT文件进行诊断？</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>A: 在智能诊断页面，点击"选择文件"按钮，选择您的CBCT影像文件（支持DICOM和NIfTI格式），然后点击"开始分析"按钮即可。</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: 系统支持哪些诊断类型？</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>A: 系统支持下颌骨骨折、下颌骨囊肿、下颌骨肿瘤等多种口腔颌面部疾病的诊断。</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: 如何查看历史诊断记录？</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>A: 在诊断输出页面，您可以查看所有历史诊断记录，并通过筛选功能查找特定记录。</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: 模型训练需要多少数据？</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>A: 为了获得最佳效果，建议使用至少100例标注好的CBCT影像数据进行模型训练。</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: 如何提高诊断准确率？</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>A: 确保上传的CBCT影像质量清晰，扫描参数设置合理，同时定期使用新数据训练模型以提高其性能。</p>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Q: 数据安全如何保障？</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333333' }}>A: 系统采用端到端加密技术，所有数据存储在本地服务器，不会上传到云端，确保患者数据的安全性和隐私性。</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 在线客服悬浮窗 */}
        {showChatModal && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1000' }} onClick={() => setShowChatModal(false)}>
            <div style={{ background: 'white', borderRadius: '12px', width: '90%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
              {/* 头部 */}
              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💬</span>
                  <span>在线客服</span>
                </h2>
                <button 
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666666' }}
                  onClick={() => setShowChatModal(false)}
                >
                  ×
                </button>
              </div>
              
              {/* 消息区域 */}
              <div style={{ flex: '1', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    style={{
                      alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%'
                    }}
                  >
                    <div 
                      style={{
                        background: message.sender === 'user' ? '#3b82f6' : '#f1f5f9',
                        color: message.sender === 'user' ? 'white' : '#333333',
                        padding: '12px 16px',
                        borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                    >
                      {message.text}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                      {message.time}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 输入区域 */}
              <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{
                    flex: '1',
                    padding: '12px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '24px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  placeholder="请输入您的问题..."
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  <span style={{ fontSize: '18px' }}>➤</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default HelpPage