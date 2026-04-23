# AI模型目录

此目录用于存放AI模型文件。

## 目录结构

```
ai-models/
├── models/           # 模型文件
├── weights/          # 模型权重
└── configs/          # 模型配置
```

## 配置说明

在docker-compose.yml中，此目录会被挂载到容器的`/app/ai-models`路径。

## 模型路径

在后端配置中，AI模型路径设置为：
```
AI_MODEL_PATH: /app/ai-models
```

## 注意事项

1. 确保此目录包含所有必要的AI模型文件
2. 模型文件需要与后端代码兼容
3. 模型文件大小可能较大，请确保有足够的存储空间
