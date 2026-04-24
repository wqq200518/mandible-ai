'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const CasesPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cases, setCases] = useState<any[]>([
    {
      id: 1,
      patientName: '张三',
      patientId: 'P12345',
      age: 35,
      gender: '男',
      diagnosis: '根尖周炎',
      date: '2026-04-14',
      status: 'active'
    },
    {
      id: 2,
      patientName: '李四',
      patientId: 'P12346',
      age: 42,
      gender: '女',
      diagnosis: '牙周炎',
      date: '2026-04-13',
      status: 'active'
    },
    {
      id: 3,
      patientName: '王五',
      patientId: 'P12347',
      age: 28,
      gender: '男',
      diagnosis: '智齿阻生',
      date: '2026-04-13',
      status: 'completed'
    },
    {
      id: 4,
      patientName: '赵六',
      patientId: 'P12348',
      age: 50,
      gender: '女',
      diagnosis: '龋齿',
      date: '2026-04-12',
      status: 'completed'
    }
  ])

  const [diagnosisRecords, setDiagnosisRecords] = useState<any[]>([
    {
      id: 1,
      patientName: '张三',
      patientId: 'P12345',
      date: '2026-04-14',
      time: '10:30',
      diagnosis: '根尖周炎',
      confidence: 0.85,
      type: 'upload',
      status: 'completed'
    },
    {
      id: 2,
      patientName: '李四',
      patientId: 'P12346',
      date: '2026-04-13',
      time: '16:45',
      diagnosis: '牙周炎',
      confidence: 0.92,
      type: 'upload',
      status: 'completed'
    },
    {
      id: 3,
      patientName: '王五',
      patientId: 'P12347',
      date: '2026-04-13',
      time: '14:20',
      diagnosis: '智齿阻生',
      confidence: 0.88,
      type: 'upload',
      status: 'completed'
    },
    {
      id: 4,
      patientName: '赵六',
      patientId: 'P12348',
      date: '2026-04-12',
      time: '09:15',
      diagnosis: '龋齿',
      confidence: 0.95,
      type: 'upload',
      status: 'completed'
    }
  ])
  const [filterType, setFilterType] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [caseToDelete, setCaseToDelete] = useState<number | null>(null)
  const [editingCase, setEditingCase] = useState<any>(null)
  const [editingRecord, setEditingRecord] = useState<any>(null)

  useEffect(() => {
    // 检查用户是否登录
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // 未登录，跳转到登录页
      router.push('/login')
    }

    // 从本地存储中加载诊断数据
    const storedCases = localStorage.getItem('cases')
    if (storedCases) {
      const parsedCases = JSON.parse(storedCases)
      // 更新cases和diagnosisRecords
      setCases(prevCases => {
        // 合并现有数据和新数据，避免重复
        const existingIds = new Set(prevCases.map(c => c.id))
        const newCases = parsedCases.map((caseData: any) => ({
          id: caseData.id,
          patientName: caseData.patientInfo || '未知患者',
          patientId: `P${caseData.id}`,
          age: 0, // 默认为0，实际应用中应该从患者信息中提取
          gender: '未知', // 默认为未知，实际应用中应该从患者信息中提取
          diagnosis: caseData.findings?.join('; ') || '无诊断结果',
          date: caseData.diagnosisDate ? new Date(caseData.diagnosisDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: 'active'
        })).filter((c: any) => !existingIds.has(c.id))
        return [...newCases, ...prevCases]
      })

      setDiagnosisRecords(prevRecords => {
        // 合并现有数据和新数据，避免重复
        const existingIds = new Set(prevRecords.map(r => r.id))
        const newRecords = parsedCases.map((caseData: any) => ({
          id: caseData.id,
          patientName: caseData.patientInfo || '未知患者',
          patientId: `P${caseData.id}`,
          date: caseData.diagnosisDate ? new Date(caseData.diagnosisDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          time: caseData.diagnosisDate ? new Date(caseData.diagnosisDate).toTimeString().split(' ')[0] : new Date().toTimeString().split(' ')[0],
          diagnosis: caseData.findings?.join('; ') || '无诊断结果',
          confidence: caseData.confidenceThreshold || 0.7,
          type: 'upload',
          status: 'completed'
        })).filter((r: any) => !existingIds.has(r.id))
        return [...newRecords, ...prevRecords]
      })
    }
  }, [router])

  const handleLogout = () => {
    // 清除用户信息
    localStorage.removeItem('user')
    // 跳转到登录页
    router.push('/login')
  }

  const openCaseModal = (caseData: any) => {
    setSelectedCase(caseData)
    setShowModal(true)
  }

  const openRecordModal = (recordData: any) => {
    setSelectedRecord(recordData)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCase(null)
    setSelectedRecord(null)
    setEditingCase(null)
    setEditingRecord(null)
  }

  const savePatientInfo = () => {
    if (!editingCase) return
    
    // 更新本地存储中的数据
    const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
    const updatedCases = existingCases.map((caseData: any) => {
      if (caseData.id === editingCase.id) {
        return {
          ...caseData,
          ...editingCase,
          infoCompleted: true
        }
      }
      return caseData
    })
    localStorage.setItem('cases', JSON.stringify(updatedCases))

    // 更新状态
    setCases(prevCases => {
      return prevCases.map(c => {
        if (c.id === editingCase.id) {
          return {
            ...c,
            ...editingCase,
            infoCompleted: true
          }
        }
        return c
      })
    })

    alert('患者信息已保存')
    closeModal()
  }

  const saveRecordInfo = () => {
    if (!editingRecord) return
    
    // 更新本地存储中的数据
    const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
    const updatedCases = existingCases.map((caseData: any) => {
      if (caseData.id === editingRecord.id) {
        return {
          ...caseData,
          ...editingRecord,
          infoCompleted: true
        }
      }
      return caseData
    })
    localStorage.setItem('cases', JSON.stringify(updatedCases))

    // 更新状态
    setDiagnosisRecords(prevRecords => {
      return prevRecords.map(r => {
        if (r.id === editingRecord.id) {
          return {
            ...r,
            ...editingRecord,
            infoCompleted: true
          }
        }
        return r
      })
    })

    alert('患者信息已保存')
    closeModal()
  }

  const openDeleteModal = (caseId: number) => {
    setCaseToDelete(caseId)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (caseToDelete === null) return
    
    // 从本地存储中删除数据
    try {
      const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
      const updatedCases = existingCases.filter((caseData: any) => caseData.id !== caseToDelete)
      localStorage.setItem('cases', JSON.stringify(updatedCases))

      // 更新状态
      setCases(prevCases => prevCases.filter(c => c.id !== caseToDelete))
      setDiagnosisRecords(prevRecords => prevRecords.filter(r => r.id !== caseToDelete))

      setShowDeleteModal(false)
      setCaseToDelete(null)
      alert('病例已删除')
    } catch (error) {
      console.error('删除病例时出错:', error)
      alert('删除病例时出错，请重试')
      setShowDeleteModal(false)
      setCaseToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setCaseToDelete(null)
  }

  const filteredRecords = diagnosisRecords.filter(record => {
    const typeMatch = filterType === 'all' || record.type === filterType
    const dateMatch = !filterDate || record.date === filterDate
    return typeMatch && dateMatch
  })

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
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>💬</span>
            <span>诊断问答</span>
          </a>
          <a href="/diagnosis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <span>智能诊断</span>
          </a>
          <a href="/cases" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '500' }}>
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
      <main style={{ marginLeft: '250px', flex: '1', overflowY: 'auto', height: '100vh' }}>
        {/* 顶部导航 */}
        <header style={{ backgroundColor: '#15803d', color: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>病例管理</h1>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>患者数据管理 · 全周期动态追踪</p>
            </div>
            <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#15803d', borderRadius: '8px', fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>+</span>
              <span>新建诊断</span>
            </button>
          </div>
        </header>

        {/* 统计卡片 */}
        <section style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666' }}>患者总数</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>3</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666' }}>数据包</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308' }}>
                  <span style={{ fontSize: '18px' }}>📦</span>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>4</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666' }}>已诊断</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}>
                  <span style={{ fontSize: '18px' }}>✅</span>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>3</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666' }}>待诊断</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <span style={{ fontSize: '18px' }}>⏳</span>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>1</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666666' }}>异常病例</div>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                </div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '600' }}>1</div>
            </div>
          </div>
        </section>

        {/* 搜索和筛选 */}
        <section style={{ padding: '0 24px 24px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '300px' }}>
                <input 
                  type="text" 
                  placeholder="搜索患者姓名、编号..." 
                  style={{ 
                    width: '100%', 
                    padding: '10px 16px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
              <div>
                <select 
                  style={{ 
                    padding: '10px 16px', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <option>全部类型</option>
                  <option>牙体牙髓</option>
                  <option>牙周</option>
                  <option>口腔黏膜</option>
                  <option>颌面部</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white', color: '#666666', cursor: 'pointer' }}>按患者</button>
                <button style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white', color: '#666666', cursor: 'pointer' }}>按数据包</button>
                <button style={{ padding: '10px 16px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white', color: '#666666', cursor: 'pointer' }}>诊断记录</button>
              </div>
            </div>
          </div>
        </section>

        {/* 患者列表 */}
        <section style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 患者卡片列表 */}
            {cases.map((caseData, index) => (
              <div key={caseData.id} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => openCaseModal(caseData)} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: index % 3 === 0 ? '#dcfce7' : index % 3 === 1 ? '#fce7f3' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index % 3 === 0 ? '#15803d' : index % 3 === 1 ? '#be185d' : '#1d4ed8', fontSize: '18px', fontWeight: '600' }}>
                      {caseData.patientName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <div style={{ fontWeight: '500', fontSize: '16px' }}>{caseData.patientName || '未知患者'}</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>{caseData.patientId || '未知ID'}</div>
                        <div style={{ fontSize: '14px', color: '#666666' }}>{caseData.gender || '未知'} · {caseData.age || 0}岁龄</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#666666' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>📦</span>
                          <span>1 数据包</span>
                        </div>
                        <div>
                          最近扫描: {caseData.date || new Date().toISOString().split('T')[0]}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '6px 12px', backgroundColor: caseData.diagnosis?.includes('囊肿') ? '#fef3c7' : caseData.diagnosis?.includes('健康') ? '#dcfce7' : '#fef2f2', color: caseData.diagnosis?.includes('囊肿') ? '#92400e' : caseData.diagnosis?.includes('健康') ? '#15803d' : '#b91c1c', borderRadius: '16px', fontSize: '14px', fontWeight: '500' }}>
                      {caseData.diagnosis || '待诊断'}
                    </div>
                    <div style={{ fontSize: '18px', color: '#666666' }}>→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 最近诊断模块 */}
        <section style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏰</span>
              <span>最近诊断记录</span>
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <option value="all">全部类型</option>
                <option value="upload">影像分析</option>
                <option value="chat">问答记录</option>
              </select>
              <input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                style={{ 
                  padding: '8px 12px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#666666' }}>患者信息</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#666666' }}>诊断结果</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#666666' }}>时间</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#666666' }}>类型</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#666666' }}>状态</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#666666' }}>操作</th>
                </tr>
              </thead>
              <tbody style={{ borderTop: '1px solid #e2e8f0' }}>
                {filteredRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{record.patientName}</div>
                        <div style={{ fontSize: '12px', color: '#666666' }}>ID: {record.patientId}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{record.diagnosis}</div>
                        <div style={{ fontSize: '12px', color: '#666666' }}>置信度: {(record.confidence * 100).toFixed(1)}%</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#666666' }}>
                      {record.date} {record.time}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: record.type === 'upload' ? '#dbeafe' : '#dcfce7',
                        color: record.type === 'upload' ? '#1d4ed8' : '#15803d'
                      }}>
                        {record.type === 'upload' ? '影像分析' : '问答记录'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: '500',
                        backgroundColor: '#dcfce7',
                        color: '#15803d'
                      }}>
                        已完成
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px' }}>
                      <a href="#" style={{ color: '#3b82f6', marginRight: '12px', textDecoration: 'none', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); openRecordModal(record); }}>查看</a>
                      <a href="#" style={{ color: '#666666', marginRight: '12px', textDecoration: 'none' }}>导出</a>
                      <a href="#" style={{ color: '#ef4444', textDecoration: 'none', cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); openDeleteModal(record.id); }}>删除</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* 弹窗 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '24px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            {/* 关闭按钮 */}
            <button 
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666666'
              }}
            >
              ×
            </button>

            {/* 弹窗内容 */}
            {selectedCase && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span>
                  <span>患者病例详情</span>
                </h2>
                
                {!selectedCase.infoCompleted && (
                  <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <p style={{ fontSize: '14px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>⚠️</span>
                      <span>患者信息未补全，请补全患者信息</span>
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: '#333333' }}>患者信息</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>患者姓名</span>
                      {editingCase ? (
                        <input 
                          type="text" 
                          value={editingCase.patientName} 
                          onChange={(e) => setEditingCase({ ...editingCase, patientName: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedCase.patientName}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>患者编号</span>
                      {editingCase ? (
                        <input 
                          type="text" 
                          value={editingCase.patientId} 
                          onChange={(e) => setEditingCase({ ...editingCase, patientId: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedCase.patientId}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>年龄</span>
                      {editingCase ? (
                        <input 
                          type="number" 
                          value={editingCase.age || ''} 
                          onChange={(e) => setEditingCase({ ...editingCase, age: parseInt(e.target.value) || 0 })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedCase.age || '未填写'}岁</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>性别</span>
                      {editingCase ? (
                        <select 
                          value={editingCase.gender} 
                          onChange={(e) => setEditingCase({ ...editingCase, gender: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        >
                          <option value="">请选择</option>
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedCase.gender || '未填写'}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>诊断日期</span>
                      {editingCase ? (
                        <input 
                          type="date" 
                          value={selectedCase.date} 
                          disabled 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px',
                            backgroundColor: '#f9fafb'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedCase.date}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: '#333333' }}>诊断结果</h3>
                  <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '16px', lineHeight: '1.5' }}>{selectedCase.diagnosis}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: '#333333' }}>诊断建议</h3>
                  <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #dcfce7' }}>
                    <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.5' }}>
                      {selectedCase.recommendations ? (
                        selectedCase.recommendations.map((rec: string, index: number) => (
                          <li key={index} style={{ marginBottom: '8px' }}>{rec}</li>
                        ))
                      ) : (
                        <>
                          <li style={{ marginBottom: '8px' }}>建议定期复查，每6个月一次</li>
                          <li style={{ marginBottom: '8px' }}>保持良好的口腔卫生习惯，每天刷牙2-3次</li>
                          <li style={{ marginBottom: '8px' }}>避免食用过硬、过甜的食物</li>
                          <li>如有不适，及时就医</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  {!editingCase ? (
                    <>
                      {!selectedCase.infoCompleted && (
                        <button 
                          onClick={() => setEditingCase({ ...selectedCase })} 
                          style={{
                            padding: '10px 20px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            color: '#666666',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          编辑信息
                        </button>
                      )}
                      <button 
                        onClick={closeModal}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#666666',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        关闭
                      </button>
                      <button 
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: '#15803d',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166534'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                      >
                        导出报告
                      </button>
                      <button 
                        onClick={() => openDeleteModal(selectedCase.id)}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #ef4444',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        删除
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={closeModal}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#666666',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        取消
                      </button>
                      <button 
                        onClick={savePatientInfo}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: '#15803d',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166534'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                      >
                        保存信息
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedRecord && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>📋</span>
                  <span>诊断记录详情</span>
                </h2>
                
                {!selectedRecord.infoCompleted && (
                  <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                    <p style={{ fontSize: '14px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>⚠️</span>
                      <span>患者信息未补全，请补全患者信息</span>
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: '#333333' }}>患者信息</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>患者姓名</span>
                      {editingRecord ? (
                        <input 
                          type="text" 
                          value={editingRecord.patientName} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, patientName: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.patientName}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>患者编号</span>
                      {editingRecord ? (
                        <input 
                          type="text" 
                          value={editingRecord.patientId} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, patientId: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.patientId}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>年龄</span>
                      {editingRecord ? (
                        <input 
                          type="number" 
                          value={editingRecord.age || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, age: parseInt(e.target.value) || 0 })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.age || '未填写'}岁</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>性别</span>
                      {editingRecord ? (
                        <select 
                          value={editingRecord.gender} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, gender: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        >
                          <option value="">请选择</option>
                          <option value="男">男</option>
                          <option value="女">女</option>
                        </select>
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.gender || '未填写'}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>诊断时间</span>
                      {editingRecord ? (
                        <input 
                          type="datetime-local" 
                          value={selectedRecord.date + 'T' + selectedRecord.time} 
                          disabled 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '16px',
                            backgroundColor: '#f9fafb'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '16px', fontWeight: '500' }}>{selectedRecord.date} {selectedRecord.time}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 详细患者数据 */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px', color: '#333333' }}>详细信息</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>主诉</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.chiefComplaint || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, chiefComplaint: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.chiefComplaint || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>现病史</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.presentIllness || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, presentIllness: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '100px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.presentIllness || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>既往史</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.pastHistory || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, pastHistory: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.pastHistory || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>检查</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.examination || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, examination: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.examination || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>辅助检查</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.auxiliaryExamination || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, auxiliaryExamination: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.auxiliaryExamination || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>诊断</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.diagnosis || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, diagnosis: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.diagnosis || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>治疗方案</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.treatmentPlan || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, treatmentPlan: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '100px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          {selectedRecord.treatmentPlan || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>AI辅助诊断</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.aiDiagnosis || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, aiDiagnosis: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '80px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                          {selectedRecord.aiDiagnosis || '未填写'}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '14px', color: '#666666', marginBottom: '4px' }}>AI辅助治疗方案</span>
                      {editingRecord ? (
                        <textarea 
                          value={editingRecord.aiTreatmentPlan || ''} 
                          onChange={(e) => setEditingRecord({ ...editingRecord, aiTreatmentPlan: e.target.value })} 
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            minHeight: '100px',
                            resize: 'vertical'
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', padding: '8px 12px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                          {selectedRecord.aiTreatmentPlan || '未填写'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  {!editingRecord ? (
                    <>
                      {!selectedRecord.infoCompleted && (
                        <button 
                          onClick={() => setEditingRecord({ ...selectedRecord })} 
                          style={{
                            padding: '10px 20px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            color: '#666666',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                          编辑信息
                        </button>
                      )}
                      <button 
                        onClick={closeModal}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#666666',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        关闭
                      </button>
                      <button 
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: '#15803d',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166534'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                      >
                        导出报告
                      </button>
                      <button 
                        onClick={() => openDeleteModal(selectedRecord.id)}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #ef4444',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#ef4444',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        删除
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={closeModal}
                        style={{
                          padding: '10px 20px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#666666',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        取消
                      </button>
                      <button 
                        onClick={saveRecordInfo}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: '#15803d',
                          color: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#166534'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
                      >
                        保存信息
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333333' }}>确认删除</h3>
            <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '24px', color: '#666666' }}>
              您确定要删除此病例吗？此操作不可撤销。
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={cancelDelete}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#666666',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                取消
              </button>
              <button 
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CasesPage