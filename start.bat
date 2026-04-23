@echo off
chcp 65001 >nul
echo ========================================
echo CBCT影像诊断系统 - 快速启动脚本
echo ========================================
echo.

echo [1/3] 检查数据库连接...
timeout /t 2 >nul

echo [2/3] 启动后端服务...
cd backend
start "后端服务" cmd /k "pnpm install && pnpm dev"
cd ..
timeout /t 5 >nul

echo [3/3] 启动前端服务...
start "前端服务" cmd /k "pnpm dev"
timeout /t 3 >nul

echo.
echo ========================================
echo 系统启动完成！
echo ========================================
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:8000
echo.
echo 测试账号:
echo   管理员: admin / admin123
echo   医生:   doctor / doctor123
echo   研究员: researcher / research123
echo.
echo 按任意键关闭此窗口...
pause >nul