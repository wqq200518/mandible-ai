'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { dentalAgent } from '@/lib/dentalAgent'

const ChatPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      role: 'assistant',
      content: '您好！我是Mandible AI智能助手，请问有什么可以帮助您的？'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [learningMode, setLearningMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')

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

  const handleSend = async () => {
    if (!input.trim()) return

    // 添加用户消息
    const newMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    }
    setMessages([...messages, newMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 调用后端API
      const response = await fetch('http://localhost:8000/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: input })
      })

      if (response.ok) {
        const data = await response.json()
        const aiResponse = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.response
        }
        setMessages([...messages, newMessage, aiResponse])
      } else {
        // 后端API调用失败，使用本地模拟响应
        const aiResponse = {
          id: Date.now() + 1,
          role: 'assistant',
          content: getAIResponse(input)
        }
        setMessages([...messages, newMessage, aiResponse])
      }
    } catch (error) {
      // 网络错误，使用本地模拟响应
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getAIResponse(input)
      }
      setMessages([...messages, newMessage, aiResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const getAIResponse = (question: string): string => {
    // 使用口腔医学智能体处理问题
    return dentalAgent.processQuestion(question)
  }
  
  const handleLearn = (question: string) => {
    setLearningMode(true)
    setCurrentQuestion(question)
  }
  
  const handleSaveLearning = () => {
    if (!input.trim()) return
    
    dentalAgent.learn(currentQuestion, input)
    setLearningMode(false)
    setCurrentQuestion('')
    setInput('')
    
    // 显示学习成功消息
    const successMessage = {
      id: Date.now(),
      role: 'assistant',
      content: '学习成功！我会记住这个信息。'
    }
    setMessages([...messages, successMessage])
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
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>🏠</span>
            <span>首页</span>
          </a>
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '500' }}>
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
      <main style={{ marginLeft: '250px', flex: '1', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* 顶部导航 */}
        <header style={{ backgroundColor: '#1e40af', color: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>诊断问答</h1>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>AI助手为您解答口腔医疗相关问题</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🤖</span>
                <span>AI在线</span>
              </div>
              <button style={{ padding: '8px 16px', backgroundColor: 'white', color: '#1e40af', borderRadius: '20px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer' }}>
                重置
              </button>
            </div>
          </div>
        </header>

        {/* 聊天区域 */}
        <div style={{ flex: '1', overflowY: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 欢迎卡片 */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💬</span>
                <span>口腔CBCT智能诊断助手</span>
              </h2>
              <p style={{ fontSize: '14px', color: '#666666', marginBottom: '16px' }}>
                您好！我是专业的口腔临床医学AI助手，具有丰富的口腔临床医学知识和CBCT影像诊断经验。
              </p>
              <p style={{ fontSize: '14px', color: '#666666', marginBottom: '12px' }}>我可以回答的问题包括：</p>
              
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>牙体牙髓疾病</h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    龋病、牙髓炎、根尖周炎的诊断与治疗
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    牙外伤的处理方案
                  </li>
                </ul>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>牙周疾病</h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    牙龈炎、牙周炎的分期治疗
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    牙周牙髓联合病变的诊断
                  </li>
                </ul>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>口腔黏膜疾病</h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    口腔溃疡、白斑、扁平苔藓
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    疱疹性口炎、念珠菌感染
                  </li>
                </ul>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>颌面部疾病</h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    阻生智齿
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    阻生智齿分类与拔除评估
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    CBCT影像解读
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>颞下颌关节疾病</h3>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ fontSize: '14px', color: '#666666', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    关节紊乱病的诊断与治疗
                  </li>
                </ul>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>请描述您的疑问，例如：</p>
                <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    "根尖周炎怎么治疗？需要做根管治疗吗？"
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    "阻生智齿一定要拔吗？什么情况下需要拔？"
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', marginBottom: '4px', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    "颌骨囊肿和肿瘤怎么区分？"
                  </li>
                  <li style={{ fontSize: '14px', color: '#666666', paddingLeft: '20px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0', content: '•' }}>•</span>
                    "牙周炎中晚期怎么治疗？牙齿功能能保住吗？"
                  </li>
                </ul>
              </div>
              
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <p style={{ fontSize: '14px', color: '#92400e', margin: '0' }}>
                  提示：本助手仅供参考，不能替代专业医生的诊断。如有口腔问题，请及时就医。
                </p>
              </div>
              
              <div style={{ marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            {/* 聊天消息 */}
            {messages.map((message, index) => (
              <div key={message.id}>
                <div 
                  style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div style={{ 
                    maxWidth: '80%', 
                    padding: '16px', 
                    borderRadius: '12px', 
                    backgroundColor: message.role === 'user' ? '#dbeafe' : 'white',
                    color: message.role === 'user' ? '#1e40af' : '#333333',
                    boxShadow: message.role === 'user' ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
                    border: message.role === 'user' ? 'none' : '1px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0', lineHeight: '1.5' }}>{message.content}</p>
                  </div>
                </div>
                {message.role === 'assistant' && index > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '4px', paddingLeft: '20px' }}>
                    <button 
                      style={{ 
                        fontSize: '12px', 
                        color: '#3b82f6', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: '0', 
                        textDecoration: 'underline'
                      }}
                      onClick={() => handleLearn(messages[index - 1]?.content || '')}
                    >
                      纠正/补充
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ 
                  maxWidth: '80%', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  backgroundColor: 'white',
                  color: '#333333',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ margin: '0', lineHeight: '1.5', opacity: '0.6' }}>正在思考...</p>
                </div>
              </div>
            )}
            
            {/* 快速提问 */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>快速提问：</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', color: '#666666' }} onClick={() => setInput('根尖周炎怎么治疗？')}>根尖周炎怎么治疗？</button>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', color: '#666666' }} onClick={() => setInput('阻生智齿一定要拔吗？')}>阻生智齿一定要拔吗？</button>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', color: '#666666' }} onClick={() => setInput('颌骨囊肿良性还是恶性？')}>颌骨囊肿良性还是恶性？</button>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', color: '#666666' }} onClick={() => setInput('牙周炎导致牙齿松动怎么办？')}>牙周炎导致牙齿松动怎么办？</button>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', color: '#666666' }} onClick={() => setInput('口腔溃疡反复发作怎么办？')}>口腔溃疡反复发作怎么办？</button>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', color: '#666666' }} onClick={() => setInput('颞下颌关节紊乱有什么症状？')}>颞下颌关节紊乱有什么症状？</button>
              </div>
            </div>
          </div>
        </div>

        {/* 输入区域 */}
        <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {learningMode ? (
              <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#92400e', margin: '0' }}>学习模式</h3>
                  <button 
                    onClick={() => {
                      setLearningMode(false)
                      setCurrentQuestion('')
                      setInput('')
                    }}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '20px', 
                      color: '#92400e', 
                      cursor: 'pointer', 
                      padding: '0', 
                      lineHeight: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#78350f'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#92400e'}
                  >
                    ✕
                  </button>
                </div>
                <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '12px' }}>请输入更准确的信息，我会学习并改进：</p>
                <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>问题：{currentQuestion}</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveLearning()}
                    placeholder="请输入正确的信息..."
                    style={{ 
                      flex: '1', 
                      padding: '12px 16px', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    onClick={handleSaveLearning}
                    style={{ 
                      padding: '12px 24px', 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    disabled={!input.trim()}
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入您的问题，例如：颌骨囊肿的治疗方案有哪些？"
                  style={{ 
                    flex: '1', 
                    padding: '12px 16px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  style={{ 
                    padding: '12px 24px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  disabled={isLoading || !input.trim()}
                >
                  发送
                </button>
              </form>
            )}
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#9ca3af' }}>
              ⚠️ 本助手仅供参考，不能替代专业医生的诊断。如有口腔问题，请及时就医。
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default ChatPage