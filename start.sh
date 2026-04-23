#!/bin/sh

# 启动后端服务
cd /app/backend && pnpm start &

# 启动前端服务
cd /app/frontend && pnpm start
