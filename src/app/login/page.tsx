'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '../../lib/api'

const LoginPage = () => {
  const router = useRouter()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authApi.login(username, password)

      if (response.error) {
        // 如果API调用失败，尝试本地模拟登录
        console.log('API登录失败，尝试本地模拟登录:', response.error)
        const localLogin = attemptLocalLogin(username, password)
        
        if (localLogin.success) {
          localStorage.setItem('user', JSON.stringify(localLogin.user))
          localStorage.setItem('token', localLogin.token)
          router.push('/')
          return
        } else {
          setError(localLogin.error || '登录失败，请检查用户名和密码')
          setLoading(false)
          return
        }
      }

      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user))
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token)
        }
        router.push('/')
      }
    } catch (err) {
      // 网络错误，尝试本地模拟登录
      console.log('网络错误，尝试本地模拟登录:', err)
      const localLogin = attemptLocalLogin(username, password)
      
      if (localLogin.success) {
        localStorage.setItem('user', JSON.stringify(localLogin.user))
        localStorage.setItem('token', localLogin.token)
        router.push('/')
      } else {
        setError(localLogin.error || '登录失败，请检查用户名和密码')
        setLoading(false)
      }
    }
  }

  const attemptLocalLogin = (username: string, password: string) => {
    const users = {
      admin: { password: 'admin123', role: 'admin', name: '管理员' },
      doctor: { password: 'doctor123', role: 'doctor', name: '医生' },
      researcher: { password: 'research123', role: 'researcher', name: '研究员' }
    }

    const user = users[username as keyof typeof users]
    
    if (user && user.password === password) {
      return {
        success: true,
        user: {
          id: username,
          username: username,
          role: user.role,
          name: user.name,
          email: `${username}@mandible.ai`
        },
        token: `local_token_${Date.now()}`
      }
    }
    
    return {
      success: false,
      error: '用户名或密码错误'
    }
  }

  return (
    <div className="login-body">
      <div className="login-container">
        {/* 左侧介绍部分 */}
        <div className="login-left">
          <div className="left-content">
            {/* 顶部logo */}
            <div className="logo-top flex items-center gap-2 mb-16">
              <span className="logo-icon text-2xl">🦷</span>
              <span className="logo-text text-lg font-semibold">Mandible AI</span>
            </div>

            {/* 中间内容 */}
            <div className="left-center">
              <h1 className="text-3xl font-bold mb-4">下颌骨智能诊断系统</h1>
              <p className="subtitle text-lg mb-2">基于深度学习的医学影像分析平台</p>
              <p className="description text-base mb-12">提供精准分割、多病种分类与智能诊断</p>

              {/* 统计数据 */}
              <div className="stats flex gap-10 mb-16">
                <div className="stat-item text-center">
                  <div className="stat-value text-2xl font-bold">98.5%</div>
                  <div className="stat-label text-sm mt-2">分割精度</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-value text-2xl font-bold">86.5%</div>
                  <div className="stat-label text-sm mt-2">诊断准确率</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-value text-2xl font-bold">500+</div>
                  <div className="stat-label text-sm mt-2">服务患者</div>
                </div>
              </div>
            </div>

            {/* 底部版权信息 */}
            <div className="footer text-xs text-white/60">
              © 2026 Mandible AI Diagnostic System
            </div>
          </div>
        </div>

        {/* 右侧登录部分 */}
        <div className="login-right">
          <div className="right-content max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-2">欢迎回来</h2>
            <p className="login-subtitle text-gray-600 mb-8">请输入您的账号信息登录系统</p>

            {/* 错误提示 */}
            {error && (
              <div className="error-message mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* 登录表单 */}
            <form className="login-form space-y-4" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入用户名"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入密码"
                  disabled={loading}
                />
              </div>

              <div className="form-options flex justify-between items-center">
                <div className="remember-me flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">记住我</label>
                </div>
                <a href="#" className="forgot-password text-sm text-blue-600 hover:text-blue-800">忘记密码？</a>
              </div>

              <button
                type="submit"
                className="login-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                disabled={loading}
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>

            {/* 测试账号信息 */}
            <div className="test-accounts mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold mb-3">测试账号</h3>
              <div className="account-list space-y-2">
                <div className="account-item p-3 bg-white rounded-lg border border-gray-200">
                  <div className="credentials text-sm text-gray-600">管理员: admin / admin123 (全部功能)</div>
                </div>
                <div className="account-item p-3 bg-white rounded-lg border border-gray-200">
                  <div className="credentials text-sm text-gray-600">医生: doctor / doctor123 (诊断+问答+病例)</div>
                </div>
                <div className="account-item p-3 bg-white rounded-lg border border-gray-200">
                  <div className="credentials text-sm text-gray-600">研究员: researcher / research123 (诊断+问答+病例)</div>
                </div>
              </div>
              <p className="permission-note text-xs text-gray-600 mt-3 italic">* 医生和研究员无法访问模型训练模块</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage