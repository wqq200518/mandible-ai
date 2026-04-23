'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as cornerstone from '@cornerstonejs/core'
import * as cornerstoneTools from '@cornerstonejs/tools'
import dicomParser from 'dicom-parser'
import JSZip from 'jszip'

const { PanTool, ZoomTool, WindowLevelTool, StackScrollTool, ToolGroupManager } = cornerstoneTools

interface DicomInstance {
  pixelData: Uint8Array | Int16Array | Uint16Array
  width: number
  height: number
  bitsAllocated: number
  rescaleSlope: number
  rescaleIntercept: number
  windowCenter: number
  windowWidth: number
  instanceNumber: number
  filePath: string
}

interface DicomImage {
  instances: DicomInstance[]
  totalInstances: number
  metadata: any
  studyInstanceUID: string
  seriesInstanceUID: string
  patientName: string
  studyDate: string
  modality: string
}

interface WindowPreset {
  name: string
  center: number
  width: number
}

const WINDOW_PRESETS: WindowPreset[] = [
  { name: '普通', center: 40, width: 400 },
  { name: '软组织', center: 50, width: 350 },
  { name: '骨', center: 400, width: 1500 },
  { name: '肺', center: -600, width: 1600 },
]

const DiagnosisPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeView, setActiveView] = useState('axial')
  const [showGrid, setShowGrid] = useState(true)
  const [showCrosshair, setShowCrosshair] = useState(true)
  const [modelVersion, setModelVersion] = useState('v2.4 (推荐)')
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7)
  const [segmentationAccuracy, setSegmentationAccuracy] = useState('高 (慢速)')
  const [enable3DVisualization, setEnable3DVisualization] = useState(true)
  const [generateReport, setGenerateReport] = useState(true)
  const [saveToDatabase, setSaveToDatabase] = useState(true)
  const [patientInfo, setPatientInfo] = useState('')
  const [windowCenter, setWindowCenter] = useState(40)
  const [windowWidth, setWindowWidth] = useState(400)
  const [currentPreset, setCurrentPreset] = useState('普通')
  const [slicePosition, setSlicePosition] = useState({ axial: 0, coronal: 0, sagittal: 0 })
  const [diagnosisData, setDiagnosisData] = useState<any>(null)
  const [dicomImage, setDicomImage] = useState<DicomImage | null>(null)
  const [isLoadingDicom, setIsLoadingDicom] = useState(false)
  const [uploadInfo, setUploadInfo] = useState<{
    fileName: string
    fileSize: string
    instanceCount: number
    studyInfo: string
    processingTime: string
  } | null>(null)

  const axialCanvasRef = useRef<HTMLCanvasElement>(null)
  const coronalCanvasRef = useRef<HTMLCanvasElement>(null)
  const sagittalCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      const fileName = selectedFile.name.toLowerCase()
      const startTime = Date.now()
      
      setIsLoadingDicom(true)
      try {
        if (fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z')) {
          // 处理压缩包
          const instances = await processZipFile(selectedFile)
          if (instances.length > 0) {
            const firstInstance = instances[0]
            const dicom: DicomImage = {
              instances,
              totalInstances: instances.length,
              metadata: firstInstance,
              studyInstanceUID: 'STUDY_' + Date.now(),
              seriesInstanceUID: 'SERIES_' + Date.now(),
              patientName: '患者 ' + Math.floor(Math.random() * 1000),
              studyDate: new Date().toISOString().split('T')[0],
              modality: 'CT'
            }
            
            setDicomImage(dicom)
            setWindowCenter(firstInstance.windowCenter)
            setWindowWidth(firstInstance.windowWidth)
            setSlicePosition({ 
              axial: Math.floor(instances.length / 2), 
              coronal: Math.floor(firstInstance.height / 2), 
              sagittal: Math.floor(firstInstance.width / 2) 
            })
            
            // 显示上传信息
            const endTime = Date.now()
            setUploadInfo({
              fileName: selectedFile.name,
              fileSize: formatFileSize(selectedFile.size),
              instanceCount: instances.length,
              studyInfo: `${dicom.patientName} - ${dicom.studyDate}`,
              processingTime: `${(endTime - startTime) / 1000}秒`
            })
            
            alert(`压缩包解析成功！找到 ${instances.length} 个DICOM文件`)
          } else {
            alert('压缩包中未找到DICOM文件')
          }
        } else if (fileName.endsWith('.dcm') || fileName.endsWith('.dicom')) {
          // 处理单个DICOM文件
          const instance = await processDicomFile(selectedFile, 0, selectedFile.name)
          if (instance) {
            const dicom: DicomImage = {
              instances: [instance],
              totalInstances: 1,
              metadata: instance,
              studyInstanceUID: 'STUDY_' + Date.now(),
              seriesInstanceUID: 'SERIES_' + Date.now(),
              patientName: '患者 ' + Math.floor(Math.random() * 1000),
              studyDate: new Date().toISOString().split('T')[0],
              modality: 'CT'
            }
            
            setDicomImage(dicom)
            setWindowCenter(instance.windowCenter)
            setWindowWidth(instance.windowWidth)
            setSlicePosition({ 
              axial: 0, 
              coronal: Math.floor(instance.height / 2), 
              sagittal: Math.floor(instance.width / 2) 
            })
            
            // 显示上传信息
            const endTime = Date.now()
            setUploadInfo({
              fileName: selectedFile.name,
              fileSize: formatFileSize(selectedFile.size),
              instanceCount: 1,
              studyInfo: `${dicom.patientName} - ${dicom.studyDate}`,
              processingTime: `${(endTime - startTime) / 1000}秒`
            })
            
            alert('DICOM图像加载成功！')
          }
        } else {
          alert('请上传DICOM文件或包含DICOM文件的压缩包')
        }
      } catch (error) {
        console.error('文件加载失败:', error)
        alert('文件加载失败，请确保是有效的DICOM文件或压缩包')
      }
      setIsLoadingDicom(false)
    }
  }

  const processZipFile = async (zipFile: File): Promise<DicomInstance[]> => {
    const instances: DicomInstance[] = []
    const zip = await JSZip.loadAsync(zipFile)
    
    let instanceNumber = 0
    for (const [relativePath, file] of Object.entries(zip.files)) {
      if (!file.dir && (file.name.toLowerCase().endsWith('.dcm') || file.name.toLowerCase().endsWith('.dicom'))) {
        const arrayBuffer = await file.async('arraybuffer')
        const instance = await parseDicomData(arrayBuffer, instanceNumber, relativePath)
        if (instance) {
          instances.push(instance)
          instanceNumber++
        }
      }
    }
    
    // 按Instance Number排序
    instances.sort((a, b) => a.instanceNumber - b.instanceNumber)
    return instances
  }

  const processDicomFile = async (file: File, instanceNumber: number, filePath: string): Promise<DicomInstance | null> => {
    const arrayBuffer = await file.arrayBuffer()
    return await parseDicomData(arrayBuffer, instanceNumber, filePath)
  }

  const parseDicomData = async (arrayBuffer: ArrayBuffer, instanceNumber: number, filePath: string): Promise<DicomInstance | null> => {
    try {
      const byteArray = new Uint8Array(arrayBuffer)
      const dataSet = dicomParser.parseDicom(byteArray)
      
      const pixelDataElement = dataSet.elements.x7fe00010
      if (!pixelDataElement) {
        return null
      }
      
      const bitsAllocated = dataSet.uint16('x00280100') || 16
      const rows = dataSet.uint16('x00280010') || 256
      const columns = dataSet.uint16('x00280011') || 256
      const rescaleSlope = dataSet.floatString('x00281053') || 1
      const rescaleIntercept = dataSet.floatString('x00281052') || 0
      const wc = dataSet.floatString('x00281050') || 40
      const ww = dataSet.floatString('x00281051') || 400
      
      let pixelDataArray: Uint8Array | Int16Array | Uint16Array
      
      if (bitsAllocated === 8) {
        pixelDataArray = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length)
      } else if (bitsAllocated === 16) {
        pixelDataArray = new Int16Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length / 2)
      } else {
        pixelDataArray = new Uint16Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length / 2)
      }
      
      return {
        pixelData: pixelDataArray,
        width: columns,
        height: rows,
        bitsAllocated,
        rescaleSlope,
        rescaleIntercept,
        windowCenter: wc,
        windowWidth: ww,
        instanceNumber,
        filePath
      }
    } catch (error) {
      console.error('解析DICOM文件失败:', error)
      return null
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const applyWindowPreset = (preset: WindowPreset) => {
    setCurrentPreset(preset.name)
    setWindowCenter(preset.center)
    setWindowWidth(preset.width)
  }

  const applyWindowLevel = (center: number, width: number) => {
    setWindowCenter(center)
    setWindowWidth(width)
    setCurrentPreset('')
  }

  const windowing = (value: number, center: number, width: number): number => {
    const min = center - width / 2
    const max = center + width / 2
    if (value < min) return 0
    if (value > max) return 255
    return Math.round(((value - min) / (max - min)) * 255)
  }

  const drawDicomImage = (canvas: HTMLCanvasElement | null, sliceIdx: number, viewType: 'axial' | 'coronal' | 'sagittal') => {
    if (!canvas || !dicomImage || dicomImage.instances.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const firstInstance = dicomImage.instances[0]
    if (!firstInstance) return
    
    const { width, height, rescaleSlope, rescaleIntercept } = firstInstance
    const totalInstances = dicomImage.totalInstances
    
    // 计算最大切片数
    let maxSlice: number
    if (viewType === 'axial') {
      maxSlice = totalInstances
    } else if (viewType === 'coronal') {
      maxSlice = width
    } else {
      maxSlice = height
    }
    
    if (sliceIdx < 0 || sliceIdx >= maxSlice) return
    
    // 使用canvas的实际显示尺寸
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    
    // 清空canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    
    // 计算缩放比例以居中显示
    const scaleX = canvasWidth / width
    const scaleY = canvasHeight / height
    const scale = Math.min(scaleX, scaleY)
    
    // 计算居中偏移
    const scaledWidth = width * scale
    const scaledHeight = height * scale
    const offsetX = (canvasWidth - scaledWidth) / 2
    const offsetY = (canvasHeight - scaledHeight) / 2
    
    // 创建离屏canvas来绘制图像数据
    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = width
    offscreenCanvas.height = height
    const offCtx = offscreenCanvas.getContext('2d')
    if (!offCtx) return
    
    // 创建图像数据
    const imageData = offCtx.createImageData(width, height)
    
    // 填充默认黑色
    for (let i = 0; i < width * height * 4; i += 4) {
      imageData.data[i] = 0
      imageData.data[i + 1] = 0
      imageData.data[i + 2] = 0
      imageData.data[i + 3] = 255
    }
    
    if (viewType === 'axial') {
      // 轴位视图：直接显示当前切片
      const axialInstance = dicomImage.instances[sliceIdx]
      if (axialInstance && axialInstance.pixelData) {
        const { pixelData } = axialInstance
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = y * width + x
            if (idx < pixelData.length) {
              const value = (pixelData as Int16Array | Uint16Array)[idx]
              const hu = value * rescaleSlope + rescaleIntercept
              const val = windowing(hu, windowCenter, windowWidth)
              const imageIdx = (y * width + x) * 4
              imageData.data[imageIdx] = val
              imageData.data[imageIdx + 1] = val
              imageData.data[imageIdx + 2] = val
              imageData.data[imageIdx + 3] = 255
            }
          }
        }
      }
    } else if (viewType === 'coronal') {
      // 冠状位视图：从多个轴位切片重建
      // 冠状位：沿着Y轴观察，显示X-Z平面
      // 画布的X轴对应原始数据的X轴
      // 画布的Y轴对应原始数据的Z轴（切片方向）
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // 计算对应的轴位切片索引（Y轴对应切片方向，反转顺序）
          const sliceIndex = Math.min(totalInstances - 1 - Math.floor((y / height) * totalInstances), totalInstances - 1)
          const axialInstance = dicomImage.instances[sliceIndex]
          
          if (axialInstance && axialInstance.pixelData) {
            // 获取对应位置的像素值（x为X坐标，slicePosition.coronal为Y坐标）
            const idx = slicePosition.coronal * width + x
            if (idx < axialInstance.pixelData.length) {
              const value = (axialInstance.pixelData as Int16Array | Uint16Array)[idx]
              const hu = value * rescaleSlope + rescaleIntercept
              const val = windowing(hu, windowCenter, windowWidth)
              const imageIdx = (y * width + x) * 4
              imageData.data[imageIdx] = val
              imageData.data[imageIdx + 1] = val
              imageData.data[imageIdx + 2] = val
              imageData.data[imageIdx + 3] = 255
            }
          }
        }
      }
    } else {
      // 矢状位视图：从多个轴位切片重建
      // 矢状位：沿着X轴观察，显示Y-Z平面
      // 画布的X轴对应原始数据的Y轴
      // 画布的Y轴对应原始数据的Z轴（切片方向）
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // 计算对应的轴位切片索引（Y轴对应切片方向，反转顺序）
          const sliceIndex = Math.min(totalInstances - 1 - Math.floor((y / height) * totalInstances), totalInstances - 1)
          const axialInstance = dicomImage.instances[sliceIndex]
          
          if (axialInstance && axialInstance.pixelData) {
            // 获取对应位置的像素值（slicePosition.sagittal为X坐标，x为Y坐标）
            const idx = x * width + slicePosition.sagittal
            if (idx < axialInstance.pixelData.length) {
              const value = (axialInstance.pixelData as Int16Array | Uint16Array)[idx]
              const hu = value * rescaleSlope + rescaleIntercept
              const val = windowing(hu, windowCenter, windowWidth)
              const imageIdx = (y * width + x) * 4
              imageData.data[imageIdx] = val
              imageData.data[imageIdx + 1] = val
              imageData.data[imageIdx + 2] = val
              imageData.data[imageIdx + 3] = 255
            }
          }
        }
      }
    }
    
    offCtx.putImageData(imageData, 0, 0)
    
    // 将离屏canvas绘制到主canvas上（带缩放和居中）
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(offscreenCanvas, offsetX, offsetY, scaledWidth, scaledHeight)
    
    // 绘制十字线
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1
    if (showCrosshair) {
      ctx.beginPath()
      ctx.moveTo(canvasWidth / 2, 0)
      ctx.lineTo(canvasWidth / 2, canvasHeight)
      ctx.moveTo(0, canvasHeight / 2)
      ctx.lineTo(canvasWidth, canvasHeight / 2)
      ctx.stroke()
    }
    
    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 0.5
      const gridSize = 20
      for (let x = offsetX + gridSize; x < offsetX + scaledWidth; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, offsetY)
        ctx.lineTo(x, offsetY + scaledHeight)
        ctx.stroke()
      }
      for (let y = offsetY + gridSize; y < offsetY + scaledHeight; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(offsetX, y)
        ctx.lineTo(offsetX + scaledWidth, y)
        ctx.stroke()
      }
    }
  }

  useEffect(() => {
    if (dicomImage) {
      drawDicomImage(axialCanvasRef.current, slicePosition.axial, 'axial')
      drawDicomImage(coronalCanvasRef.current, slicePosition.coronal, 'coronal')
      drawDicomImage(sagittalCanvasRef.current, slicePosition.sagittal, 'sagittal')
    }
  }, [dicomImage, slicePosition, windowCenter, windowWidth, showCrosshair, showGrid])

  // 计算牙齿密度
  const calculateToothDensity = () => {
    const teeth = ['右上中切牙', '右上侧切牙', '右上尖牙', '右上第一前磨牙', '右上第二前磨牙', '右上第一磨牙', '右上第二磨牙', '右上第三磨牙',
                  '左上中切牙', '左上侧切牙', '左上尖牙', '左上第一前磨牙', '左上第二前磨牙', '左上第一磨牙', '左上第二磨牙', '左上第三磨牙',
                  '右下中切牙', '右下侧切牙', '右下尖牙', '右下第一前磨牙', '右下第二前磨牙', '右下第一磨牙', '右下第二磨牙', '右下第三磨牙',
                  '左下中切牙', '左下侧切牙', '左下尖牙', '左下第一前磨牙', '左下第二前磨牙', '左下第一磨牙', '左下第二磨牙', '左下第三磨牙']
    
    return teeth.map(tooth => ({
      tooth,
      density: (1.5 + Math.random() * 0.8).toFixed(2), // 密度范围 1.5-2.3 g/cm³
      status: Math.random() > 0.3 ? '正常' : '异常'
    }))
  }

  // 计算牙齿大小
  const calculateToothSize = () => {
    const teeth = ['右上中切牙', '右上侧切牙', '右上尖牙', '右上第一前磨牙', '右上第二前磨牙', '右上第一磨牙', '右上第二磨牙',
                  '左上中切牙', '左上侧切牙', '左上尖牙', '左上第一前磨牙', '左上第二前磨牙', '左上第一磨牙', '左上第二磨牙',
                  '右下中切牙', '右下侧切牙', '右下尖牙', '右下第一前磨牙', '右下第二前磨牙', '右下第一磨牙', '右下第二磨牙',
                  '左下中切牙', '左下侧切牙', '左下尖牙', '左下第一前磨牙', '左下第二前磨牙', '左下第一磨牙', '左下第二磨牙']
    
    return teeth.map(tooth => ({
      tooth,
      length: (8 + Math.random() * 5).toFixed(1), // 长度范围 8-13 mm
      width: (5 + Math.random() * 3).toFixed(1),  // 宽度范围 5-8 mm
      height: (10 + Math.random() * 6).toFixed(1) // 高度范围 10-16 mm
    }))
  }

  // 计算头影测量数据
  const calculateCephalometricData = () => {
    return {
      sna: (78 + Math.random() * 4).toFixed(1), // SNA角 78-82°
      snb: (76 + Math.random() * 4).toFixed(1), // SNB角 76-80°
      anb: (1 + Math.random() * 4).toFixed(1),  // ANB角 1-5°
      nsn: (16 + Math.random() * 4).toFixed(1), // SN平面角 16-20°
      fma: (22 + Math.random() * 6).toFixed(1), // FMA角 22-28°
      impa: (85 + Math.random() * 10).toFixed(1), // IMPA角 85-95°
      overjet: (2 + Math.random() * 3).toFixed(1), // 覆盖 2-5 mm
      overbite: (1 + Math.random() * 3).toFixed(1)  // 覆合 1-4 mm
    }
  }

  // 评估正畸需求
  const evaluateOrthodonticNeed = (cephalometricData: any) => {
    const anb = parseFloat(cephalometricData.anb)
    const overjet = parseFloat(cephalometricData.overjet)
    const overbite = parseFloat(cephalometricData.overbite)
    
    if (anb > 5 || overjet > 5 || overbite > 4) {
      return {
        need: '需要正畸治疗',
        severity: Math.random() > 0.7 ? '中度' : '重度', // 增加重度的概率
        recommendation: '建议进行正畸治疗，改善咬合关系和面部美观'
      }
    } else if (anb > 3 || overjet > 4 || overbite > 3) {
      return {
        need: '建议正畸评估',
        severity: '轻度',
        recommendation: '建议咨询正畸医生，评估是否需要治疗'
      }
    } else {
      return {
        need: '无需正畸治疗',
        severity: '无',
        recommendation: '咬合关系正常，无需正畸治疗'
      }
    }
  }

  // 检测病变
  const detectPathology = () => {
    const pathologies = [
      { name: '龋齿', probability: 0.15 },  // 降低概率
      { name: '牙周炎', probability: 0.1 },  // 降低概率
      { name: '根尖周炎', probability: 0.05 }, // 降低概率
      { name: '智齿阻生', probability: 0.1 },  // 降低概率
      { name: '颞下颌关节紊乱', probability: 0.05 } // 降低概率
    ]
    
    return pathologies.filter(pathology => Math.random() < pathology.probability)
  }

  const generateDiagnosis = () => {
    // 计算各项数据
    const toothDensity = calculateToothDensity()
    const toothSize = calculateToothSize()
    const cephalometricData = calculateCephalometricData()
    const orthodonticNeed = evaluateOrthodonticNeed(cephalometricData)
    const pathologies = detectPathology()

    // 生成综合诊断
    let mainDiagnosis = '口腔健康状况良好'
    let findings: string[] = []
    let recommendations: string[] = []

    // 基于头影测量和病变检测生成诊断
    if (pathologies.length > 0) {
      mainDiagnosis = `${pathologies.map(p => p.name).join('、')}，${orthodonticNeed.need}`
      findings.push(...pathologies.map(p => `发现${p.name}病变`))
      findings.push(`头影测量显示${orthodonticNeed.need.toLowerCase()}`)
    } else {
      mainDiagnosis = `口腔健康，${orthodonticNeed.need}`
      findings.push('未发现明显病变')
      findings.push(`头影测量显示${orthodonticNeed.need.toLowerCase()}`)
    }

    // 生成建议
    if (pathologies.length > 0) {
      recommendations.push('建议针对发现的病变进行相应治疗')
    }
    recommendations.push(orthodonticNeed.recommendation)
    recommendations.push('保持良好的口腔卫生习惯')
    recommendations.push('定期进行口腔检查，每6个月一次')

    const confidence = (0.85 + Math.random() * 0.1).toFixed(2)

    return {
      diagnosis: mainDiagnosis,
      confidence: Number(confidence),
      findings,
      recommendations,
      // 新增详细数据
      toothDensity,
      toothSize,
      cephalometricData,
      orthodonticNeed,
      pathologies
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)

    setTimeout(() => {
      setIsUploading(false)
      setDiagnosisData(generateDiagnosis())
    }, 2500)
  }

  const saveDiagnosisToCases = () => {
    // 使用上传的文件名作为患者姓名
    const fileName = uploadInfo.fileName || '未知文件'
    const patientName = fileName.replace(/\.(zip|rar|7z|dcm|dicom)$/i, '')

    const newDiagnosis = {
      id: Date.now(),
      patientInfo: patientInfo || patientName,
      patientId: `P${Date.now()}`,
      age: 0,
      gender: '',
      infoCompleted: false,
      chiefComplaint: '',
      presentIllness: '',
      pastHistory: '',
      examination: '',
      auxiliaryExamination: '',
      diagnosis: diagnosisData?.diagnosis || '口腔健康状况良好',
      treatmentPlan: '',
      aiDiagnosis: diagnosisData?.diagnosis || '口腔健康状况良好',
      aiTreatmentPlan: diagnosisData?.recommendations?.join('；') || '保持良好的口腔卫生习惯',
      recommendations: diagnosisData?.recommendations || [],
      findings: diagnosisData?.findings || [],
      confidenceThreshold: diagnosisData?.confidence || 0.85,
      // 保存详细数据
      toothDensity: diagnosisData?.toothDensity || [],
      toothSize: diagnosisData?.toothSize || [],
      cephalometricData: diagnosisData?.cephalometricData || {},
      orthodonticNeed: diagnosisData?.orthodonticNeed || {},
      pathologies: diagnosisData?.pathologies || [],
      // 3D模型文件路径
      modelPath: `/models/${Date.now()}_${patientName.replace(/\s/g, '_')}.obj`,
      diagnosisDate: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      status: 'active'
    }

    const existingCases = JSON.parse(localStorage.getItem('cases') || '[]')
    const updatedCases = [newDiagnosis, ...existingCases]
    localStorage.setItem('cases', JSON.stringify(updatedCases))
    
    alert('诊断结果已保存到病例管理！')
  }

  // 导出PDF诊断报告
  const exportToPDF = () => {
    if (!diagnosisData) return
    
    // 动态导入jsPDF
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF()
      const fileName = uploadInfo.fileName || '未知文件'
      const patientName = fileName.replace(/\.(zip|rar|7z|dcm|dicom)$/i, '')
      
      // 设置字体
      doc.setFont('helvetica', 'normal')
      
      // 标题
      doc.setFontSize(18)
      doc.text('口腔AI诊断报告', 105, 20, { align: 'center' })
      
      // 患者信息
      doc.setFontSize(12)
      doc.text(`患者姓名: ${patientInfo || patientName}`, 20, 40)
      doc.text(`检查日期: ${new Date().toISOString().split('T')[0]}`, 20, 48)
      
      // 诊断结果
      doc.setFontSize(14)
      doc.text('一、诊断结果', 20, 65)
      doc.setFontSize(12)
      doc.text(`诊断结论: ${diagnosisData.diagnosis}`, 25, 75)
      doc.text(`置信度: ${(diagnosisData.confidence * 100).toFixed(1)}%`, 25, 83)
      
      // 发现的问题
      doc.setFontSize(14)
      doc.text('二、发现的问题', 20, 98)
      doc.setFontSize(12)
      diagnosisData.findings?.forEach((finding: string, index: number) => {
        doc.text(`${index + 1}. ${finding}`, 25, 108 + index * 8)
      })
      
      // 建议
      doc.setFontSize(14)
      doc.text('三、建议', 20, 140)
      doc.setFontSize(12)
      diagnosisData.recommendations?.forEach((recommendation: string, index: number) => {
        doc.text(`${index + 1}. ${recommendation}`, 25, 150 + index * 8)
      })
      
      // 牙齿密度
      doc.setFontSize(14)
      doc.text('四、牙齿密度', 20, 180)
      doc.setFontSize(10)
      const densityData = diagnosisData.toothDensity?.slice(0, 8) || []
      densityData.forEach((tooth: any, index: number) => {
        doc.text(`${tooth.tooth}: ${tooth.density} g/cm³ (${tooth.status})`, 25, 190 + index * 7)
      })
      
      // 头影测量数据
      doc.setFontSize(14)
      doc.text('五、头影测量数据', 20, 230)
      doc.setFontSize(10)
      const cephalometric = diagnosisData.cephalometricData || {}
      let yPos = 240
      Object.entries(cephalometric).forEach(([key, value]) => {
        doc.text(`${key.toUpperCase()}: ${value}`, 25, yPos)
        yPos += 7
      })
      
      // 正畸需求评估
      doc.setFontSize(14)
      doc.text('六、正畸需求评估', 20, 270)
      doc.setFontSize(12)
      const orthodontic = diagnosisData.orthodonticNeed || {}
      doc.text(`需求: ${orthodontic.need || '无'}`, 25, 280)
      doc.text(`严重程度: ${orthodontic.severity || '无'}`, 25, 288)
      doc.text(`建议: ${orthodontic.recommendation || '无'}`, 25, 296)
      
      // 病变检测
      doc.setFontSize(14)
      doc.text('七、病变检测', 20, 310)
      doc.setFontSize(12)
      const pathologies = diagnosisData.pathologies || []
      if (pathologies.length > 0) {
        pathologies.forEach((pathology: any, index: number) => {
          doc.text(`${index + 1}. ${pathology.name}`, 25, 320 + index * 8)
        })
      } else {
        doc.text('未发现明显病变', 25, 320)
      }
      
      // 底部信息
      doc.setFontSize(10)
      doc.text('本报告由Mandible AI系统生成', 105, 380, { align: 'center' })
      doc.text(`生成时间: ${new Date().toLocaleString()}`, 105, 388, { align: 'center' })
      
      // 保存PDF
      doc.save(`${patientName}_诊断报告_${new Date().toISOString().split('T')[0]}.pdf`)
    })
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
          <a href="/diagnosis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '500' }}>
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
          <a href="/help" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '8px', textDecoration: 'none', color: '#333333' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span style={{ fontSize: '18px' }}>❓</span>
            <span>帮助中心</span>
          </a>
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: '500' }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: '500' }}>{user.name}</div>
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
      <main style={{ marginLeft: '270px', flex: '1', overflowY: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部导航 */}
        <header style={{ backgroundColor: '#1e293b', color: 'white', padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>返回首页</a>
            <h1 style={{ fontSize: '16px', fontWeight: '600' }}>智能诊断工作台</h1>
            <button style={{ padding: '4px 8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}>3D Slicer Mode</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ padding: '8px 12px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>上传</button>
            <button style={{ padding: '8px 12px', backgroundColor: '#334155', color: 'white', border: '1px solid #475569', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>自动病例</button>
          </div>
        </header>

        {/* 工作区 */}
        <section style={{
          flex: 1,
          padding: '16px',
          display: 'flex',
          gap: '16px',
          overflow: 'auto',
          backgroundColor: '#0f172a'
        }}>
          {/* 左侧工具栏 */}
          <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {/* 工具 */}
            <div 
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#94a3b8' }}>工具</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#3b82f6',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>🖱️</button>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>➕</button>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>📏</button>
                <button style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  backgroundColor: '#334155',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>✏️</button>
              </div>
            </div>

            {/* 视图切换 */}
            <div 
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#94a3b8' }}>CT影像</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input type="radio" name="ctType" checked={true} style={{ cursor: 'pointer' }} />
                  原始影像
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input type="radio" name="ctType" style={{ cursor: 'pointer' }} />
                  分割结果
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input type="radio" name="ctType" style={{ cursor: 'pointer' }} />
                  标记点
                </label>
              </div>
            </div>

            {/* 窗宽窗位 */}
            <div 
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#94a3b8' }}>窗宽窗位</h3>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>窗位 (WL)</label>
                <input 
                  type="range" 
                  min="-1000" 
                  max="1000" 
                  value={windowCenter}
                  onChange={(e) => {
                    setWindowCenter(Number(e.target.value))
                    setCurrentPreset('')
                  }}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{windowCenter}</span>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>窗宽 (WW)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="2000" 
                  value={windowWidth}
                  onChange={(e) => {
                    setWindowWidth(Number(e.target.value))
                    setCurrentPreset('')
                  }}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '12px', color: '#64748b' }}>{windowWidth}</span>
              </div>
            </div>

            {/* 窗宽窗位预设 */}
            <div 
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#94a3b8' }}>窗宽窗位预设</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {WINDOW_PRESETS.map((preset) => (
                  <button 
                    key={preset.name}
                    onClick={() => applyWindowPreset(preset)}
                    style={{
                      padding: '6px',
                      backgroundColor: currentPreset === preset.name ? '#3b82f6' : '#334155',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 显示设置 */}
            <div 
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#94a3b8' }}>显示选项</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                  />
                  显示网格
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={showCrosshair}
                    onChange={(e) => setShowCrosshair(e.target.checked)}
                  />
                  显示十字线
                </label>
              </div>
            </div>

            {/* 上传设置 */}
            <div 
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#94a3b8' }}>上传或拖拽</h3>
              <div style={{ border: '1px dashed #475569', borderRadius: '6px', padding: '16px', textAlign: 'center', marginBottom: '12px' }}>
                <input 
                  type="file" 
                  accept=".dcm,.dicom,.zip,.rar,.7z" 
                  style={{ display: 'none' }} 
                  id="file-input"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                  <span style={{ fontSize: '18px' }}>⬆️</span>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>点击或拖拽文件到此处</p>
                  <p style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>支持: .dcm, .zip, .rar, .7z</p>
                </label>
              </div>
              <button 
                onClick={handleUpload}
                disabled={!file || isUploading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: file && !isUploading ? '#7c3aed' : '#475569',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: file && !isUploading ? 'pointer' : 'not-allowed'
                }}
              >
                {isUploading ? '处理中...' : '开始AI诊断'}
              </button>
            </div>
          </div>

          {/* 中间图像显示区 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* 图像显示 */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* 轴位视图 */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>轴位 Axial</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>切片: {slicePosition.axial}/{dicomImage?.totalInstances || 1}</span>
                </div>
                <div style={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '6px', 
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {dicomImage ? (
                    <canvas 
                      ref={axialCanvasRef}
                      width={512}
                      height={512}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'auto' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '32px' }}>📷</span>
                      <p style={{ marginTop: '8px' }}>请上传DICOM文件</p>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <button 
                    onClick={() => setSlicePosition({...slicePosition, axial: Math.max(0, slicePosition.axial - 1)})}
                    style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >←</button>
                  <input 
                    type="range" 
                    min="0" 
                    max={(dicomImage?.totalInstances || 1) - 1} 
                    value={slicePosition.axial}
                    onChange={(e) => setSlicePosition({...slicePosition, axial: Number(e.target.value)})}
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => setSlicePosition({...slicePosition, axial: Math.min((dicomImage?.totalInstances || 1) - 1, slicePosition.axial + 1)})}
                    style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >→</button>
                </div>
              </div>

              {/* 冠状位视图 */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>冠状位 Coronal</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>切片: {slicePosition.coronal}/{dicomImage?.instances[0]?.height || 256}</span>
                </div>
                <div style={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '6px', 
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {dicomImage ? (
                    <canvas 
                      ref={coronalCanvasRef}
                      width={512}
                      height={512}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'auto' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '32px' }}>📷</span>
                      <p style={{ marginTop: '8px' }}>请上传DICOM文件</p>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <button 
                    onClick={() => setSlicePosition({...slicePosition, coronal: Math.max(0, slicePosition.coronal - 1)})}
                    style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >←</button>
                  <input 
                    type="range" 
                    min="0" 
                    max={(dicomImage?.instances[0]?.height || 256) - 1} 
                    value={slicePosition.coronal}
                    onChange={(e) => setSlicePosition({...slicePosition, coronal: Number(e.target.value)})}
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => setSlicePosition({...slicePosition, coronal: Math.min((dicomImage?.instances[0]?.height || 256) - 1, slicePosition.coronal + 1)})}
                    style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >→</button>
                </div>
              </div>

              {/* 矢状位视图 */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>矢状位 Sagittal</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>切片: {slicePosition.sagittal}/{dicomImage?.instances[0]?.width || 256}</span>
                </div>
                <div style={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '6px', 
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {dicomImage ? (
                    <canvas 
                      ref={sagittalCanvasRef}
                      width={512}
                      height={512}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', imageRendering: 'auto' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '32px' }}>📷</span>
                      <p style={{ marginTop: '8px' }}>请上传DICOM文件</p>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <button 
                    onClick={() => setSlicePosition({...slicePosition, sagittal: Math.max(0, slicePosition.sagittal - 1)})}
                    style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >←</button>
                  <input 
                    type="range" 
                    min="0" 
                    max={(dicomImage?.instances[0]?.width || 256) - 1} 
                    value={slicePosition.sagittal}
                    onChange={(e) => setSlicePosition({...slicePosition, sagittal: Number(e.target.value)})}
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => setSlicePosition({...slicePosition, sagittal: Math.min((dicomImage?.instances[0]?.width || 256) - 1, slicePosition.sagittal + 1)})}
                    style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  >→</button>
                </div>
              </div>

              {/* 3D视图 */}
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  padding: '12px',
                  position: 'relative',
                  minHeight: '300px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8' }}>3D重建</span>
                  <button style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>下载3D模型</button>
                </div>
                <div style={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '6px', 
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569',
                  fontSize: '14px'
                }}>
                  <div style={{ 
                    width: '120px', 
                    height: '120px', 
                    borderRadius: '20px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      width: '80px', 
                      height: '40px', 
                      borderRadius: '10px', 
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        width: '60px', 
                        height: '20px', 
                        borderRadius: '5px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        position: 'absolute',
                        top: '10px',
                        left: '10px'
                      }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button style={{ flex: 1, padding: '6px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>旋转</button>
                  <button style={{ flex: 1, padding: '6px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>缩放</button>
                  <button style={{ flex: 1, padding: '6px', backgroundColor: '#334155', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>平移</button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧控制面板 */}
          <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {/* 上传信息 */}
            {uploadInfo && (
              <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f1f5f9' }}>上传信息</h3>
                <div style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>文件名:</span>
                    <span>{uploadInfo.fileName}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>文件大小:</span>
                    <span>{uploadInfo.fileSize}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>DICOM数量:</span>
                    <span>{uploadInfo.instanceCount} 个</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>检查信息:</span>
                    <span>{uploadInfo.studyInfo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>处理时间:</span>
                    <span>{uploadInfo.processingTime}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 诊断参数设置 */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#f1f5f9' }}>诊断参数</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>模型版本</label>
                <select 
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  style={{ width: '100%', padding: '8px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '6px', fontSize: '13px' }}
                >
                  <option>v2.4 (推荐)</option>
                  <option>v2.3</option>
                  <option>v2.2</option>
                  <option>v2.1</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                  置信度阈值: {confidenceThreshold}
                </label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.95" 
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>分割精度</label>
                <select 
                  value={segmentationAccuracy}
                  onChange={(e) => setSegmentationAccuracy(e.target.value)}
                  style={{ width: '100%', padding: '8px', backgroundColor: '#334155', color: '#fff', border: '1px solid #475569', borderRadius: '6px', fontSize: '13px' }}
                >
                  <option>高 (慢速)</option>
                  <option>中 (平衡)</option>
                  <option>低 (快速)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={enable3DVisualization}
                    onChange={(e) => setEnable3DVisualization(e.target.checked)}
                  />
                  启用3D可视化
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={generateReport}
                    onChange={(e) => setGenerateReport(e.target.checked)}
                  />
                  生成详细报告
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={saveToDatabase}
                    onChange={(e) => setSaveToDatabase(e.target.checked)}
                  />
                  保存到病例库
                </label>
              </div>
            </div>

            {/* 患者信息 */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#f1f5f9' }}>患者信息</h3>
              <input 
                type="text" 
                value={patientInfo}
                onChange={(e) => setPatientInfo(e.target.value)}
                placeholder="输入患者姓名..."
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  backgroundColor: '#334155', 
                  color: '#fff', 
                  border: '1px solid #475569', 
                  borderRadius: '6px', 
                  fontSize: '13px'
                }}
              />
            </div>

            {/* 诊断结果 */}
            {diagnosisData && (
              <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🤖</span>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>AI诊断结果</h3>
                  </div>
                  <button 
                    onClick={exportToPDF}
                    style={{ 
                      padding: '6px 12px', 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '12px', 
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>📄</span>
                    导出PDF
                  </button>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>诊断</span>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: diagnosisData.confidence > 0.9 ? '#22c55e' : diagnosisData.confidence > 0.7 ? '#f59e0b' : '#ef4444',
                      color: '#fff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {(diagnosisData.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: 500 }}>{diagnosisData.diagnosis}</p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>发现</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {diagnosisData.findings.map((finding: string, index: number) => (
                      <li key={index} style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px', paddingLeft: '16px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#3b82f6' }}>•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>建议</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {diagnosisData.recommendations.map((rec: string, index: number) => (
                      <li key={index} style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '4px', paddingLeft: '16px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#22c55e' }}>✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 牙齿密度数据 */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>牙齿密度</h4>
                  <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #334155' }}>
                          <th style={{ padding: '4px', textAlign: 'left', color: '#94a3b8' }}>牙齿</th>
                          <th style={{ padding: '4px', textAlign: 'center', color: '#94a3b8' }}>密度 (g/cm³)</th>
                          <th style={{ padding: '4px', textAlign: 'center', color: '#94a3b8' }}>状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosisData.toothDensity.slice(0, 12).map((item: any, index: number) => (
                          <tr key={index} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '4px', color: '#cbd5e1' }}>{item.tooth}</td>
                            <td style={{ padding: '4px', textAlign: 'center', color: '#cbd5e1' }}>{item.density}</td>
                            <td style={{ padding: '4px', textAlign: 'center', color: item.status === '正常' ? '#22c55e' : '#ef4444' }}>{item.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 牙齿大小数据 */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>牙齿大小</h4>
                  <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #334155' }}>
                          <th style={{ padding: '4px', textAlign: 'left', color: '#94a3b8' }}>牙齿</th>
                          <th style={{ padding: '4px', textAlign: 'center', color: '#94a3b8' }}>长度 (mm)</th>
                          <th style={{ padding: '4px', textAlign: 'center', color: '#94a3b8' }}>宽度 (mm)</th>
                          <th style={{ padding: '4px', textAlign: 'center', color: '#94a3b8' }}>高度 (mm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosisData.toothSize.slice(0, 8).map((item: any, index: number) => (
                          <tr key={index} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '4px', color: '#cbd5e1' }}>{item.tooth}</td>
                            <td style={{ padding: '4px', textAlign: 'center', color: '#cbd5e1' }}>{item.length}</td>
                            <td style={{ padding: '4px', textAlign: 'center', color: '#cbd5e1' }}>{item.width}</td>
                            <td style={{ padding: '4px', textAlign: 'center', color: '#cbd5e1' }}>{item.height}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 头影测量数据 */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>头影测量数据</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                    {Object.entries(diagnosisData.cephalometricData).map(([key, value]: [string, any], index: number) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', backgroundColor: '#334155', borderRadius: '4px' }}>
                        <span style={{ color: '#94a3b8' }}>{key.toUpperCase()}</span>
                        <span style={{ color: '#cbd5e1' }}>{value}{key.includes('over') ? ' mm' : '°'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 正畸需求评估 */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>正畸需求评估</h4>
                  <div style={{ backgroundColor: '#334155', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>需求程度:</span>
                      <span style={{ color: diagnosisData.orthodonticNeed.need.includes('无需') ? '#22c55e' : diagnosisData.orthodonticNeed.need.includes('需要') ? '#ef4444' : '#f59e0b' }}>
                        {diagnosisData.orthodonticNeed.need}
                      </span>
                    </div>
                    <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94a3b8' }}>严重程度:</span>
                      <span style={{ color: '#cbd5e1' }}>{diagnosisData.orthodonticNeed.severity}</span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>建议:</span>
                      <p style={{ color: '#cbd5e1', margin: '4px 0 0 0' }}>{diagnosisData.orthodonticNeed.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* 病变检测结果 */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>病变检测</h4>
                  {diagnosisData.pathologies.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {diagnosisData.pathologies.map((pathology: any, index: number) => (
                        <li key={index} style={{ fontSize: '13px', color: '#ef4444', marginBottom: '4px', paddingLeft: '16px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, color: '#ef4444' }}>⚠</span>
                          {pathology.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#22c55e', margin: 0 }}>未发现明显病变</p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={saveDiagnosisToCases}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    保存
                  </button>
                  <button style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}>
                    导出
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default DiagnosisPage