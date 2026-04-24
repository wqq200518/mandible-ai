'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 语言包
const translations = {
  zh: {
    sidebar: {
      home: '首页',
      chat: '诊断问答',
      diagnosis: '智能诊断',
      cases: '病例管理',
      training: '模型训练',
      settings: '系统设置',
      help: '帮助中心',
      logout: '退出登录',
      admin: '管理员',
      doctor: '医生',
      researcher: '研究员',
      status: '正常'
    },
    header: {
      title: '系统设置',
      description: '配置系统参数和偏好设置'
    },
    general: {
      title: '常规设置',
      language: '语言',
      timezone: '时区',
      languageHint: '切换语言后，所有页面将更新为所选语言',
      chinese: '中文简体',
      english: 'English'
    },
    database: {
      title: '数据库设置',
      address: '数据库地址',
      name: '数据库名称',
      backup: '自动备份',
      cleanup: '自动清理临时数据',
      daily: '每天',
      weekly: '每周',
      monthly: '每月'
    },
    notifications: {
      title: '通知设置',
      diagnosisComplete: '诊断完成通知',
      diagnosisCompleteHint: '当诊断任务完成时发送通知',
      trainingProgress: '训练进度通知',
      trainingProgressHint: '模型训练进度更新时发送通知',
      systemAlerts: '系统警报',
      systemAlertsHint: '系统异常或错误时发送警报'
    },
    appearance: {
      title: '外观设置',
      theme: '主题模式',
      light: '浅色模式',
      dark: '深色模式',
      system: '跟随系统',
      currentTheme: '当前主题: 浅色模式',
      restoreDefault: '恢复默认',
      saveSettings: '保存设置',
      themeChanged: '主题更换成功',
      languageChanged: '语言更换成功'
    },
    timezone: {
      china: '中国标准时间 (UTC+8)',
      utc: '协调世界时 (UTC)',
      featureUnderDevelopment: '功能待开发，敬请期待'
    }
  },
  en: {
    sidebar: {
      home: 'Home',
      chat: 'AI Chat',
      diagnosis: 'AI Diagnosis',
      diagnosisOutput: 'Diagnosis Output',
      cases: 'Case Management',
      training: 'Model Training',
      settings: 'System Settings',
      help: 'Help Center',
      logout: 'Logout',
      admin: 'Admin',
      doctor: 'Doctor',
      researcher: 'Researcher',
      status: 'Active'
    },
    header: {
      title: 'System Settings',
      description: 'Configure system parameters and preferences'
    },
    general: {
      title: 'General Settings',
      language: 'Language',
      timezone: 'Timezone',
      languageHint: 'After switching language, all pages will be updated to the selected language',
      chinese: 'Chinese Simplified',
      english: 'English'
    },
    database: {
      title: 'Database Settings',
      address: 'Database Address',
      name: 'Database Name',
      backup: 'Automatic Backup',
      cleanup: 'Automatic Cleanup of Temporary Data',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly'
    },
    notifications: {
      title: 'Notification Settings',
      diagnosisComplete: 'Diagnosis Complete Notification',
      diagnosisCompleteHint: 'Send notification when diagnosis task is completed',
      trainingProgress: 'Training Progress Notification',
      trainingProgressHint: 'Send notification when model training progress is updated',
      systemAlerts: 'System Alerts',
      systemAlertsHint: 'Send alerts when system exceptions or errors occur'
    },
    appearance: {
      title: 'Appearance Settings',
      theme: 'Theme Mode',
      light: 'Light Mode',
      dark: 'Dark Mode',
      system: 'Follow System',
      currentTheme: 'Current Theme: Light Mode',
      restoreDefault: 'Restore Default',
      saveSettings: 'Save Settings',
      themeChanged: 'Theme changed successfully',
      languageChanged: 'Language changed successfully'
    },
    timezone: {
      china: 'China Standard Time (UTC+8)',
      utc: 'Coordinated Universal Time (UTC)',
      featureUnderDevelopment: 'Feature under development, coming soon'
    }
  }
}

const SettingsPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([
    {
      id: 1,
      username: 'admin',
      role: 'admin',
      email: 'admin@mandibleai.com',
      status: 'active'
    },
    {
      id: 2,
      username: 'doctor',
      role: 'doctor',
      email: 'doctor@mandibleai.com',
      status: 'active'
    },
    {
      id: 3,
      username: 'researcher',
      role: 'researcher',
      email: 'researcher@mandibleai.com',
      status: 'active'
    }
  ])
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('zh')
  const [notifications, setNotifications] = useState({
    diagnosisComplete: false,
    trainingProgress: false,
    systemAlerts: false
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showTimezoneAlert, setShowTimezoneAlert] = useState(false)

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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
  }

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = () => {
    // 保存设置到本地存储
    localStorage.setItem('theme', theme)
    localStorage.setItem('language', language)
    localStorage.setItem('notifications', JSON.stringify(notifications))
    
    // 显示成功消息
    const lang = language as keyof typeof translations
    setSuccessMessage(translations[lang]?.appearance?.themeChanged || '主题更换成功')
    setShowSuccessMessage(true)
    
    // 3秒后隐藏成功消息
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const handleRestoreDefault = () => {
    // 恢复默认设置
    setTheme('light')
    setLanguage('zh')
    setNotifications({
      diagnosisComplete: false,
      trainingProgress: false,
      systemAlerts: false
    })
    
    // 保存默认设置到本地存储
    localStorage.setItem('theme', 'light')
    localStorage.setItem('language', 'zh')
    localStorage.setItem('notifications', JSON.stringify({
      diagnosisComplete: false,
      trainingProgress: false,
      systemAlerts: false
    }))
    
    // 显示成功消息
    const lang = language as keyof typeof translations
    setSuccessMessage(translations[lang]?.appearance?.themeChanged || '主题更换成功')
    setShowSuccessMessage(true)
    
    // 3秒后隐藏成功消息
    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  const handleTimezoneChange = () => {
    // 显示功能待开发提示
    setShowTimezoneAlert(true)
  }

  const t = translations[language as keyof typeof translations] || translations['zh']

  if (!user) {
    return null
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden',
      backgroundColor: theme === 'dark' ? '#0f172a' : 'white',
      color: theme === 'dark' ? 'white' : '#333333'
    }}>
      {/* 侧边栏导航 */}
      <aside style={{ 
        width: '250px', 
        backgroundColor: theme === 'dark' ? '#1e293b' : 'white', 
        borderRight: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
        height: '100vh', 
        position: 'fixed', 
        left: '0', 
        top: '0', 
        overflowY: 'auto', 
        zIndex: '100'
      }}>
        <div style={{ padding: '16px', borderBottom: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🦷</span>
            <div>
              <div style={{ fontWeight: '600', fontSize: '18px' }}>Mandible AI</div>
              <div style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#666666' }}>AI-Powered Diagnostic System</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '16px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: theme === 'dark' ? 'white' : '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>🏠</span>
            <span>{t.sidebar.home}</span>
          </a>
          <a href="/chat" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: theme === 'dark' ? 'white' : '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>💬</span>
            <span>{t.sidebar.chat}</span>
          </a>
          <a href="/diagnosis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: theme === 'dark' ? 'white' : '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>📊</span>
            <span>{t.sidebar.diagnosis}</span>
          </a>
          <a href="/cases" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: theme === 'dark' ? 'white' : '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>📁</span>
            <span>{t.sidebar.cases}</span>
          </a>
          {user.role === 'admin' && (
            <a href="/training" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: theme === 'dark' ? 'white' : '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              <span style={{ fontSize: '18px' }}>🏋️</span>
              <span>{t.sidebar.training}</span>
            </a>
          )}
          <a href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: theme === 'dark' ? '#334155' : '#fff7ed', color: theme === 'dark' ? 'white' : '#c2410c', fontWeight: '500' }}>
            <span style={{ fontSize: '18px' }}>⚙️</span>
            <span>{t.sidebar.settings}</span>
          </a>
          <a href="/help" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', color: theme === 'dark' ? 'white' : '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>❓</span>
            <span>{t.sidebar.help}</span>
          </a>
        </nav>

        <div style={{ padding: '16px', borderTop: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, marginTop: 'auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: theme === 'dark' ? '#334155' : '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme === 'dark' ? 'white' : '#3b82f6', fontWeight: '500' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{user.username}</div>
                <div style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#666666' }}>{user.role === 'admin' ? t.sidebar.admin : user.role === 'doctor' ? t.sidebar.doctor : t.sidebar.researcher}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              <span style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#666666' }}>{t.sidebar.status}</span>
            </div>
          </div>
          <button 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', backgroundColor: theme === 'dark' ? '#334155' : '#f3f4f6', border: 'none', cursor: 'pointer', color: theme === 'dark' ? 'white' : '#333333' }} 
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#475569' : '#e5e7eb'} 
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : '#f3f4f6'}
            onClick={handleLogout}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            <span>{t.sidebar.logout}</span>
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main style={{ marginLeft: '250px', flex: '1', overflowY: 'auto', height: '100vh' }}>
        {/* 顶部导航 */}
        <header style={{ backgroundColor: theme === 'dark' ? '#1e293b' : '#3b82f6', color: 'white', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>{t.header.title}</h1>
              <p style={{ fontSize: '14px', opacity: '0.9' }}>{t.header.description}</p>
            </div>
          </div>
        </header>

        {/* 设置内容 */}
        <section style={{ padding: '24px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* 成功消息提示 */}
            {showSuccessMessage && (
              <div style={{ 
                background: theme === 'dark' ? '#166534' : '#dcfce7', 
                color: theme === 'dark' ? '#bbf7d0' : '#166534', 
                padding: '16px', 
                borderRadius: '8px', 
                marginBottom: '24px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>✅</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* 常规设置 */}
            <div style={{ 
              background: theme === 'dark' ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '10px', 
              boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)', 
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚙️</span>
                <span>{t.general.title}</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#666666', marginBottom: '8px' }}>{t.general.language}</label>
                  <select 
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: theme === 'dark' ? '#334155' : 'white',
                      color: theme === 'dark' ? 'white' : '#333333'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                    onBlur={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'}
                  >
                    <option value="zh">{t.general.chinese}</option>
                    <option value="en">{t.general.english}</option>
                  </select>
                  <p style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#9ca3af', marginTop: '4px' }}>{t.general.languageHint}</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#666666', marginBottom: '8px' }}>{t.general.timezone}</label>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: theme === 'dark' ? '#334155' : 'white',
                      color: theme === 'dark' ? 'white' : '#333333'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#f97316'
                      handleTimezoneChange()
                    }}
                    onBlur={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'}
                  >
                    <option value="Asia/Shanghai">{t.timezone.china}</option>
                    <option value="UTC" disabled>{t.timezone.utc}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 数据库设置 */}
            <div style={{ 
              background: theme === 'dark' ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '10px', 
              boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)', 
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🗃️</span>
                <span>{t.database.title}</span>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#666666', marginBottom: '8px' }}>{t.database.address}</label>
                  <input
                    type="text"
                    defaultValue="localhost:5432"
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: theme === 'dark' ? '#334155' : 'white',
                      color: theme === 'dark' ? 'white' : '#333333'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                    onBlur={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#666666', marginBottom: '8px' }}>{t.database.name}</label>
                  <input
                    type="text"
                    defaultValue="mandible_diagnosis"
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: theme === 'dark' ? '#334155' : 'white',
                      color: theme === 'dark' ? 'white' : '#333333'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                    onBlur={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#666666', marginBottom: '8px' }}>{t.database.backup}</label>
                  <select 
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                      borderRadius: '8px', 
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      backgroundColor: theme === 'dark' ? '#334155' : 'white',
                      color: theme === 'dark' ? 'white' : '#333333'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#f97316'}
                    onBlur={(e) => e.currentTarget.style.borderColor = theme === 'dark' ? '#334155' : '#e2e8f0'}
                  >
                    <option value="daily">{t.database.daily}</option>
                    <option value="weekly">{t.database.weekly}</option>
                    <option value="monthly">{t.database.monthly}</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                    <span style={{ fontSize: '14px', color: theme === 'dark' ? 'white' : '#666666' }}>{t.database.cleanup}</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                      <input type="checkbox" style={{ opacity: '0', width: '0', height: '0' }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: theme === 'dark' ? '#334155' : '#e2e8f0', transition: '.4s', borderRadius: '24px' }}></span>
                      <span style={{ position: 'absolute', content: '""', height: '16px', width: '16px', left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 通知设置 */}
            <div style={{ 
              background: theme === 'dark' ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '10px', 
              boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)', 
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔔</span>
                <span>{t.notifications.title}</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: theme === 'dark' ? 'white' : '#333333' }}>{t.notifications.diagnosisComplete}</div>
                    <div style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#9ca3af', marginTop: '2px' }}>{t.notifications.diagnosisCompleteHint}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                    <input 
                      type="checkbox" 
                      style={{ opacity: '0', width: '0', height: '0' }} 
                      checked={notifications.diagnosisComplete}
                      onChange={(e) => handleNotificationChange('diagnosisComplete', e.target.checked)}
                    />
                    <span style={{ 
                      position: 'absolute', 
                      cursor: 'pointer', 
                      top: '0', 
                      left: '0', 
                      right: '0', 
                      bottom: '0', 
                      backgroundColor: notifications.diagnosisComplete ? '#10b981' : (theme === 'dark' ? '#334155' : '#e2e8f0'), 
                      transition: '.4s', 
                      borderRadius: '24px'
                    }}></span>
                    <span style={{ 
                      position: 'absolute', 
                      content: '""', 
                      height: '16px', 
                      width: '16px', 
                      left: notifications.diagnosisComplete ? '26px' : '4px', 
                      bottom: '4px', 
                      backgroundColor: 'white', 
                      transition: '.4s', 
                      borderRadius: '50%'
                    }}></span>
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: theme === 'dark' ? 'white' : '#333333' }}>{t.notifications.trainingProgress}</div>
                    <div style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#9ca3af', marginTop: '2px' }}>{t.notifications.trainingProgressHint}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                    <input 
                      type="checkbox" 
                      style={{ opacity: '0', width: '0', height: '0' }} 
                      checked={notifications.trainingProgress}
                      onChange={(e) => handleNotificationChange('trainingProgress', e.target.checked)}
                    />
                    <span style={{ 
                      position: 'absolute', 
                      cursor: 'pointer', 
                      top: '0', 
                      left: '0', 
                      right: '0', 
                      bottom: '0', 
                      backgroundColor: notifications.trainingProgress ? '#10b981' : (theme === 'dark' ? '#334155' : '#e2e8f0'), 
                      transition: '.4s', 
                      borderRadius: '24px'
                    }}></span>
                    <span style={{ 
                      position: 'absolute', 
                      content: '""', 
                      height: '16px', 
                      width: '16px', 
                      left: notifications.trainingProgress ? '26px' : '4px', 
                      bottom: '4px', 
                      backgroundColor: 'white', 
                      transition: '.4s', 
                      borderRadius: '50%'
                    }}></span>
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', color: theme === 'dark' ? 'white' : '#333333' }}>{t.notifications.systemAlerts}</div>
                    <div style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#9ca3af', marginTop: '2px' }}>{t.notifications.systemAlertsHint}</div>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                    <input 
                      type="checkbox" 
                      style={{ opacity: '0', width: '0', height: '0' }} 
                      checked={notifications.systemAlerts}
                      onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
                    />
                    <span style={{ 
                      position: 'absolute', 
                      cursor: 'pointer', 
                      top: '0', 
                      left: '0', 
                      right: '0', 
                      bottom: '0', 
                      backgroundColor: notifications.systemAlerts ? '#10b981' : (theme === 'dark' ? '#334155' : '#e2e8f0'), 
                      transition: '.4s', 
                      borderRadius: '24px'
                    }}></span>
                    <span style={{ 
                      position: 'absolute', 
                      content: '""', 
                      height: '16px', 
                      width: '16px', 
                      left: notifications.systemAlerts ? '26px' : '4px', 
                      bottom: '4px', 
                      backgroundColor: 'white', 
                      transition: '.4s', 
                      borderRadius: '50%'
                    }}></span>
                  </label>
                </div>
              </div>
            </div>

            {/* 外观设置 */}
            <div style={{ 
              background: theme === 'dark' ? '#1e293b' : 'white', 
              padding: '24px', 
              borderRadius: '10px', 
              boxShadow: theme === 'dark' ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.1)', 
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎨</span>
                <span>{t.appearance.title}</span>
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: theme === 'dark' ? '#94a3b8' : '#666666', marginBottom: '12px' }}>{t.appearance.theme}</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: theme === 'light' ? '#f97316' : (theme === 'dark' ? '#334155' : 'white'), 
                      color: theme === 'light' ? 'white' : (theme === 'dark' ? 'white' : '#666666'), 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      border: theme === 'light' ? 'none' : `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#ea580c' : (theme === 'dark' ? '#475569' : '#f9fafb')}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'light' ? '#f97316' : (theme === 'dark' ? '#334155' : 'white')}
                    onClick={() => handleThemeChange('light')}
                  >
                    {t.appearance.light}
                  </button>
                  <button 
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: theme === 'dark' ? '#f97316' : (theme === 'light' ? 'white' : '#334155'), 
                      color: theme === 'dark' ? 'white' : (theme === 'light' ? '#666666' : 'white'), 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      border: theme === 'dark' ? 'none' : `1px solid ${theme === 'light' ? '#e2e8f0' : '#475569'}`,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ea580c' : (theme === 'light' ? '#f9fafb' : '#475569')}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#f97316' : (theme === 'light' ? 'white' : '#334155')}
                    onClick={() => handleThemeChange('dark')}
                  >
                    {t.appearance.dark}
                  </button>
                  <button 
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: theme === 'system' ? '#f97316' : (theme === 'dark' ? '#334155' : 'white'), 
                      color: theme === 'system' ? 'white' : (theme === 'dark' ? 'white' : '#666666'), 
                      borderRadius: '8px', 
                      fontSize: '14px', 
                      border: theme === 'system' ? 'none' : `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'system' ? '#ea580c' : (theme === 'dark' ? '#475569' : '#f9fafb')}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'system' ? '#f97316' : (theme === 'dark' ? '#334155' : 'white')}
                    onClick={() => handleThemeChange('system')}
                  >
                    {t.appearance.system}
                  </button>
                </div>
                <p style={{ fontSize: '12px', color: theme === 'dark' ? '#94a3b8' : '#9ca3af', marginTop: '8px' }}>{t.appearance.currentTheme}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: theme === 'dark' ? '#334155' : 'white', 
                    color: theme === 'dark' ? 'white' : '#666666', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    border: `1px solid ${theme === 'dark' ? '#475569' : '#e2e8f0'}`,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#475569' : '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#334155' : 'white'}
                  onClick={handleRestoreDefault}
                >
                  {t.appearance.restoreDefault}
                </button>
                <button 
                  style={{ 
                    padding: '10px 20px', 
                    backgroundColor: '#3b82f6', 
                    color: 'white', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                  onClick={handleSaveSettings}
                >
                  {t.appearance.saveSettings}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 时区功能待开发提示弹窗 */}
      {showTimezoneAlert && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '2000' }} onClick={() => setShowTimezoneAlert(false)}>
          <div style={{ background: theme === 'dark' ? '#1e293b' : 'white', borderRadius: '12px', padding: '32px', maxWidth: '400px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: theme === 'dark' ? 'white' : '#333333' }}>{t.timezone.featureUnderDevelopment}</h3>
            <button
              style={{ 
                marginTop: '24px',
                padding: '10px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              onClick={() => setShowTimezoneAlert(false)}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage