import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mandible AI 下颌骨智能诊断系统',
  description: '基于深度学习的医学影像分析平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}