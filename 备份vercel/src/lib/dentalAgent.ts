// 口腔医学智能体 - 开源免费
// 包含口腔医学各方面的专业知识

// 医学知识库
const dentalKnowledgeBase = {
  // 牙体牙髓疾病
  toothDental: {
    caries: {
      definition: '龋病是在以细菌为主的多种因素影响下，牙体硬组织发生慢性进行性破坏的一种疾病。',
      causes: ['细菌：主要是变形链球菌、乳酸杆菌等', '食物：特别是蔗糖', '宿主：牙齿结构、唾液等', '时间：菌斑形成到龋洞形成需要一定时间'],
      symptoms: ['早期：无明显症状', '中期：冷热酸甜刺激痛', '晚期：自发性疼痛，甚至牙髓炎'],
      treatment: ['浅龋：补牙（充填治疗）', '中龋：垫底后充填', '深龋：可能需要安抚治疗后充填，或根管治疗'],
      prevention: ['正确刷牙：巴氏刷牙法', '使用牙线', '定期口腔检查', '窝沟封闭', '控制糖的摄入'],
      classification: ['浅龋', '中龋', '深龋', '猖獗龋', '奶瓶龋'],
      complications: ['牙髓炎', '根尖周炎', '牙周炎', '颌骨骨髓炎']
    },
    pulpitis: {
      definition: '牙髓炎是牙髓组织的炎症，多由深龋未及时治疗发展而来。',
      causes: ['深龋感染', '牙外伤', '牙隐裂', '牙周感染（逆行性牙髓炎）', '医源性因素'],
      symptoms: ['自发性阵发性疼痛', '夜间痛', '温度刺激加剧疼痛', '疼痛不能定位', '放射性疼痛'],
      treatment: ['根管治疗：清除感染的牙髓组织，填充根管', '严重者可能需要拔牙'],
      notes: '牙髓炎需要及时治疗，否则可能发展为根尖周炎。',
      classification: ['急性牙髓炎', '慢性牙髓炎', '逆行性牙髓炎', '牙髓坏死']
    },
    apicalPeriodontitis: {
      definition: '根尖周炎是发生在牙根尖周围组织的炎症性疾病。',
      causes: ['牙髓炎未及时治疗', '根管治疗不彻底', '牙外伤', '感染通过根尖孔扩散', '化学刺激'],
      symptoms: ['咬合痛', '根尖区牙龈肿胀', '可能形成瘘管', '严重者出现面部肿胀', '全身症状如发热'],
      treatment: ['根管治疗', '根尖手术', '严重者拔牙', '抗生素治疗（急性期）'],
      notes: '急性根尖周炎需要及时处理，缓解疼痛和肿胀。',
      classification: ['急性根尖周炎', '慢性根尖周炎', '根尖周脓肿', '根尖周肉芽肿', '根尖周囊肿']
    },
    dentalTrauma: {
      definition: '牙外伤是指牙齿受到外力作用导致的损伤。',
      types: ['牙震荡', '牙折', '牙脱位'],
      treatment: {
        concussion: '观察，避免咬硬物，定期复查',
        fracture: '根据折断位置和程度进行修复',
        luxation: '复位固定，必要时根管治疗'
      },
      emergency: '立即就医，保存脱位牙齿（放在生理盐水或牛奶中）'
    }
  },
  
  // 牙周疾病
  periodontal: {
    gingivitis: {
      definition: '牙龈炎是牙龈组织的炎症，不涉及牙周膜和牙槽骨。',
      causes: ['牙菌斑堆积', '牙结石刺激', '不良修复体', '食物嵌塞', '激素变化', '药物副作用'],
      symptoms: ['牙龈红肿', '牙龈出血（刷牙、咬硬物时）', '牙龈松软', '口臭', '牙龈边缘变厚'],
      treatment: ['洁治（洗牙）', '正确刷牙和使用牙线', '定期复查', '去除局部刺激因素'],
      prevention: ['保持口腔卫生', '定期洁治', '去除局部刺激因素', '均衡饮食']
    },
    periodontitis: {
      definition: '牙周炎是累及牙龈、牙周膜、牙槽骨和牙骨质的慢性炎症性疾病。',
      causes: ['牙菌斑', '牙结石', '遗传因素', '吸烟', '全身性疾病（如糖尿病）', '免疫功能异常'],
      symptoms: ['牙龈出血', '牙龈退缩', '牙周袋形成', '牙槽骨吸收', '牙齿松动', '口臭', '咬合无力'],
      treatment: ['基础治疗：洁治、刮治', '手术治疗：翻瓣术、植骨术等', '维护治疗：定期复查', '全身治疗：控制系统性疾病'],
      staging: ['I期：轻度牙周炎', 'II期：中度牙周炎', 'III期：重度牙周炎', 'IV期：重度牙周炎伴牙列缺损'],
      notes: '牙周炎是成人牙齿丧失的主要原因，早期治疗效果好。',
      riskFactors: ['吸烟', '糖尿病', '遗传因素', '口腔卫生不良', '精神压力']
    },
    periodontalAbscess: {
      definition: '牙周脓肿是发生在牙周袋内的局限性化脓性炎症。',
      causes: ['深牙周袋内的感染', '牙周治疗不当', '全身抵抗力下降'],
      symptoms: ['牙龈红肿疼痛', '牙周袋溢脓', '牙齿松动', '局部淋巴结肿大'],
      treatment: ['脓肿切开引流', '牙周基础治疗', '抗生素治疗', '口腔卫生指导']
    }
  },
  
  // 口腔黏膜疾病
  mucosal: {
    ulcer: {
      definition: '口腔溃疡是口腔黏膜上的表浅性溃疡，常见的有复发性阿弗他溃疡。',
      causes: ['免疫因素', '遗传因素', '感染因素', '营养缺乏（如维生素B12、叶酸、锌）', '精神压力', '创伤'],
      symptoms: ['圆形或椭圆形溃疡', '疼痛明显', '表面覆盖黄白色假膜', '周围红晕', '影响进食和说话'],
      treatment: ['局部用药：溃疡贴、漱口液、凝胶', '全身用药：免疫调节剂、维生素补充', '中医治疗：中药、针灸'],
      notes: '复发性口腔溃疡通常在1-2周内自愈。',
      classification: ['轻型阿弗他溃疡', '重型阿弗他溃疡', '疱疹样阿弗他溃疡']
    },
    leukoplakia: {
      definition: '白斑是发生在口腔黏膜上的白色斑块，属于癌前病变。',
      causes: ['吸烟', '饮酒', '嚼槟榔', '局部刺激', '念珠菌感染', '维生素缺乏'],
      symptoms: ['白色斑块', '表面粗糙', '可能有裂纹', '无明显疼痛', '可能有烧灼感'],
      treatment: ['去除刺激因素', '定期复查', '必要时手术切除', '药物治疗：维A酸类药物'],
      notes: '白斑有一定的癌变风险，需要密切观察。',
      riskFactors: ['吸烟', '嚼槟榔', 'HPV感染', '长期刺激']
    },
    lichenPlanus: {
      definition: '扁平苔藓是一种常见的口腔黏膜慢性炎症性疾病。',
      causes: ['免疫因素', '遗传因素', '感染因素', '精神因素', '药物反应'],
      symptoms: ['白色网纹或斑块', '黏膜充血', '糜烂', '疼痛', '烧灼感'],
      treatment: ['局部用药：糖皮质激素', '全身用药：免疫调节剂', '去除刺激因素', '心理治疗'],
      notes: '扁平苔藓有一定的癌变倾向，需要定期复查。'
    },
    oralCandidiasis: {
      definition: '口腔念珠菌病是由念珠菌感染引起的口腔黏膜疾病。',
      causes: ['免疫力下降', '长期使用抗生素', '糖尿病', '口腔卫生不良', '佩戴义齿'],
      symptoms: ['口腔黏膜白色假膜', '黏膜充血', '烧灼感', '口干'],
      treatment: ['抗真菌药物：制霉菌素、氟康唑', '保持口腔卫生', '治疗基础疾病'],
      types: ['急性假膜型', '急性红斑型', '慢性红斑型', '慢性增殖型']
    }
  },
  
  // 颌面部疾病
  maxillofacial: {
    impactedWisdomTooth: {
      definition: '阻生智齿是指由于邻牙、骨或软组织的阻碍而只能部分萌出或完全不能萌出的第三磨牙。',
      classification: ['近中阻生', '远中阻生', '垂直阻生', '水平阻生', '倒置阻生', '颊向阻生', '舌向阻生'],
      complications: ['冠周炎', '邻牙龋坏', '邻牙牙根吸收', '颌骨囊肿', '颞下颌关节紊乱', '间隙感染'],
      indicationsForExtraction: ['反复引起冠周炎', '导致邻牙病变', '形成囊肿', '正畸需要', '怀疑恶变', '无对颌牙'],
      contraindications: ['全身疾病未控制', '局部急性炎症期', '女性月经期', '妊娠期前三个月和后三个月'],
      notes: '阻生智齿是否需要拔除应根据具体情况评估。'
    },
    jawCyst: {
      definition: '颌骨囊肿是颌骨内的囊性病变，内含液体或半固体物质。',
      types: ['根尖囊肿', '含牙囊肿', '角化囊肿', '球上颌囊肿', '鼻腭囊肿', '正中囊肿'],
      symptoms: ['早期无明显症状', '后期可能出现颌骨膨隆', '牙齿松动', '面部畸形', '疼痛'],
      diagnosis: ['临床检查', 'X线检查', 'CT检查', '病理检查'],
      treatment: ['手术切除', '根据囊肿类型和大小选择不同的手术方式', '随访观察'],
      notes: '颌骨囊肿需要手术治疗，否则可能导致颌骨破坏。',
      recurrence: ['角化囊肿复发率较高，需要密切随访']
    },
    oralTumor: {
      definition: '口腔肿瘤是发生在口腔组织的良性或恶性肿瘤。',
      types: {
        benign: ['乳头状瘤', '纤维瘤', '脂肪瘤', '血管瘤'],
        malignant: ['鳞状细胞癌', '腺样囊性癌', '黏液表皮样癌']
      },
      symptoms: ['口腔内肿块', '溃疡不愈', '疼痛', '出血', '张口受限', '颈部淋巴结肿大'],
      diagnosis: ['临床检查', '影像学检查', '病理检查'],
      treatment: ['手术治疗', '放疗', '化疗', '综合治疗'],
      riskFactors: ['吸烟', '饮酒', '嚼槟榔', 'HPV感染', '慢性刺激']
    }
  },
  
  // 颞下颌关节疾病
  tmj: {
    tmd: {
      definition: '颞下颌关节紊乱病是一组累及颞下颌关节和咀嚼肌的疾病。',
      causes: ['精神因素', '咬合因素', '创伤', '关节负荷过重', '全身性疾病', '解剖因素'],
      symptoms: ['关节弹响', '关节疼痛', '张口受限', '咀嚼困难', '头痛', '耳痛', '面部疼痛'],
      treatment: ['保守治疗：理疗、药物、咬合板', '手术治疗：关节镜手术、开放性手术', '心理治疗'],
      notes: '颞下颌关节紊乱病以保守治疗为主，多数患者可以缓解。',
      classification: ['咀嚼肌紊乱疾病', '结构紊乱疾病', '关节炎性疾病', '骨关节病']
    },
    tmjDislocation: {
      definition: '颞下颌关节脱位是指髁突脱出关节窝外，不能自行复位。',
      causes: ['张口过大', '外伤', '关节结构异常', '习惯性脱位'],
      symptoms: ['张口不能闭合', '下颌前伸', '耳前区凹陷', '疼痛'],
      treatment: ['手法复位', '固定制动', '避免大张口', '必要时手术治疗']
    }
  },
  
  // 口腔修复
  prosthodontics: {
    dentalCrown: {
      definition: '牙冠是覆盖在牙齿表面的修复体，用于恢复牙齿的形态和功能。',
      types: ['金属冠', '烤瓷冠', '全瓷冠', '树脂冠'],
      indications: ['牙体缺损较大', '根管治疗后', '牙齿变色', '牙齿畸形', '固定桥基牙'],
      procedure: ['牙体预备', '取模', '制作临时冠', '试戴', '粘结']
    },
    dentalBridge: {
      definition: '固定桥是用于修复缺失牙的固定修复体。',
      types: ['金属桥', '烤瓷桥', '全瓷桥'],
      indications: ['缺失牙数目较少', '缺牙区两侧有健康基牙', '患者不愿接受种植牙'],
      advantages: ['固定可靠', '美观', '咀嚼功能好'],
      disadvantages: ['需要磨除邻牙', '对基牙要求高']
    },
    denture: {
      definition: '义齿是用于修复缺失牙的可摘修复体。',
      types: ['活动义齿', '全口义齿', '精密附着体义齿'],
      indications: ['缺失牙数目较多', '无法做固定修复', '经济条件有限'],
      care: ['每日清洁', '夜间取下浸泡', '定期复查']
    },
    implant: {
      definition: '种植牙是通过手术将人工牙根植入牙槽骨内，然后在其上制作牙冠。',
      advantages: ['不需要磨除邻牙', '固定可靠', '美观自然', '使用寿命长'],
      indications: ['单个或多个牙缺失', '全口牙缺失', '不愿意磨损邻牙'],
      contraindications: ['严重骨质疏松', '未控制的糖尿病', '凝血功能障碍', '口腔恶性肿瘤']
    }
  },
  
  // 口腔正畸
  orthodontics: {
    braces: {
      definition: '牙套是用于矫正牙齿排列不齐的装置。',
      types: ['金属牙套', '陶瓷牙套', '隐形牙套', '自锁牙套'],
      indications: ['牙齿拥挤', '牙齿稀疏', '龅牙', '地包天', '咬合不正'],
      treatmentTime: ['一般需要1-3年', '取决于错颌畸形的严重程度']
    },
    retainer: {
      definition: '保持器是在正畸治疗后用于保持牙齿位置的装置。',
      types: ['透明保持器', ' Hawley保持器', '固定保持器'],
      importance: ['防止牙齿反弹', '巩固治疗效果'],
      wearingTime: ['初期全天佩戴', '后期夜间佩戴', '一般需要佩戴1-2年']
    }
  },
  
  // CBCT相关知识
  cbct: {
    definition: 'CBCT（Cone Beam Computed Tomography）即锥形束计算机断层扫描，是一种先进的医学影像技术。',
    advantages: ['辐射剂量低', '扫描时间短', '空间分辨率高', '三维成像清晰', '成本相对较低'],
    applications: ['牙种植规划', '阻生牙评估', '根管治疗', '颌骨病变诊断', '颞下颌关节检查', '正畸评估'],
    interpretation: ['观察骨质结构', '测量距离和角度', '评估解剖结构关系', '发现细微病变', '评估种植位点'],
    notes: 'CBCT在口腔颌面部疾病的诊断和治疗规划中具有重要作用。',
    radiation: ['辐射剂量远低于传统CT', '儿童和孕妇应谨慎使用']
  },
  
  // 口腔外科
  oralSurgery: {
    toothExtraction: {
      indications: ['严重龋坏', '牙周病', '阻生牙', '正畸需要', '病灶牙'],
      complications: ['出血', '感染', '干槽症', '神经损伤', '肿胀'],
      postoperativeCare: ['咬紧纱布30分钟', '24小时内不要刷牙漱口', '避免热食', '服用抗生素', '保持口腔卫生']
    },
    drySocket: {
      definition: '干槽症是拔牙后牙槽窝内血凝块脱落，骨面暴露引起的疼痛。',
      symptoms: ['拔牙后2-3天出现剧烈疼痛', '放射至耳颞部', '牙槽窝空虚', '有恶臭'],
      treatment: ['清创', '填塞碘仿纱条', '止痛', '抗生素治疗']
    }
  },
  
  // 儿童口腔
  pediatric: {
    deciduousTeeth: {
      importance: ['咀嚼功能', '发音', '美观', '为恒牙保留间隙'],
      care: ['从第一颗牙萌出开始刷牙', '定期口腔检查', '氟化物应用', '窝沟封闭']
    },
    earlyCaries: {
      prevention: ['控制糖的摄入', '正确刷牙', '定期检查', '氟化物应用', '窝沟封闭'],
      treatment: ['补牙', '涂氟', '口腔卫生指导']
    },
    spaceMaintenance: {
      definition: '间隙保持器是用于保持乳牙早失后恒牙萌出间隙的装置。',
      indications: ['乳牙过早脱落', '恒牙萌出延迟']
    }
  }
};

// 智能体核心逻辑
class DentalAgent {
  private knowledgeBase: any;
  private learningBase: any; // 学习知识库
  private context: any[]; // 对话上下文
  
  constructor() {
    this.knowledgeBase = dentalKnowledgeBase;
    this.learningBase = this.loadLearningBase();
    this.context = [];
  }
  
  // 加载学习知识库
  private loadLearningBase() {
    try {
      const saved = localStorage.getItem('dentalAgentLearning');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  }
  
  // 保存学习知识库
  private saveLearningBase() {
    try {
      localStorage.setItem('dentalAgentLearning', JSON.stringify(this.learningBase));
    } catch (error) {
      console.error('Failed to save learning base:', error);
    }
  }
  
  // 学习新信息
  learn(question: string, answer: string) {
    const normalizedQuestion = question.toLowerCase().trim();
    this.learningBase[normalizedQuestion] = answer;
    this.saveLearningBase();
  }
  
  // 清除对话上下文
  clearContext() {
    this.context = [];
  }
  
  // 处理用户问题
  processQuestion(question: string): string {
    question = question.toLowerCase().trim();
    
    // 保存到对话上下文
    this.context.push({ role: 'user', content: question });
    // 限制上下文长度
    if (this.context.length > 10) {
      this.context = this.context.slice(-10);
    }
    
    // 首先检查学习知识库
    if (this.learningBase[question]) {
      const answer = this.learningBase[question];
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 检查上下文相关问题
    const contextAnswer = this.checkContext(question);
    if (contextAnswer) {
      this.context.push({ role: 'assistant', content: contextAnswer });
      return contextAnswer;
    }
    
    // 牙体牙髓疾病
    if (question.includes('龋') || question.includes('蛀牙') || question.includes('虫牙')) {
      const answer = this.handleCariesQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('牙髓') || question.includes('牙神经')) {
      const answer = this.handlePulpitisQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('根尖') || question.includes('牙根尖')) {
      const answer = this.handleApicalPeriodontitisQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('外伤') || question.includes('撞') || question.includes('碰')) {
      const answer = this.handleDentalTraumaQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 牙周疾病
    if (question.includes('牙龈') && (question.includes('出血') || question.includes('肿') || question.includes('红'))) {
      const answer = this.handleGingivitisQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('牙周') || question.includes('牙槽骨') || question.includes('牙齿松动') || question.includes('牙周袋')) {
      const answer = this.handlePeriodontitisQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('脓肿') || question.includes('脓包')) {
      const answer = this.handlePeriodontalAbscessQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 口腔黏膜疾病
    if (question.includes('溃疡') || question.includes('口疮') || question.includes('溃烂')) {
      const answer = this.handleUlcerQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('白斑')) {
      const answer = this.handleLeukoplakiaQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('扁平苔藓') || question.includes('苔藓')) {
      const answer = this.handleLichenPlanusQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('念珠菌') || question.includes('鹅口疮') || question.includes('真菌感染')) {
      const answer = this.handleOralCandidiasisQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 颌面部疾病
    if (question.includes('智齿') || question.includes('阻生')) {
      const answer = this.handleImpactedWisdomToothQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('囊肿') || question.includes('颌骨')) {
      const answer = this.handleJawCystQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('肿瘤') || question.includes('癌症') || question.includes('肿块')) {
      const answer = this.handleOralTumorQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 颞下颌关节疾病
    if (question.includes('关节') || question.includes('张口') || question.includes('弹响') || question.includes(' TMJ') || question.includes('颞下颌')) {
      const answer = this.handleTMDQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('脱位') || question.includes('掉下巴')) {
      const answer = this.handleTMJDislocationQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 口腔修复
    if (question.includes('牙冠') || question.includes('牙套') || question.includes('烤瓷')) {
      const answer = this.handleDentalCrownQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('固定桥') || question.includes('桥')) {
      const answer = this.handleDentalBridgeQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('义齿') || question.includes('假牙')) {
      const answer = this.handleDentureQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('种植') || question.includes(' implant') || question.includes('种植牙')) {
      const answer = this.handleImplantQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 口腔正畸
    if (question.includes('矫正') || question.includes('牙套') || question.includes('正畸') || question.includes('牙齿不齐')) {
      const answer = this.handleOrthodonticsQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // CBCT相关
    if (question.includes('cbct') || question.includes('ct') || question.includes('影像') || question.includes('扫描')) {
      const answer = this.handleCBCTQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 口腔外科
    if (question.includes('拔牙') || question.includes('拔除')) {
      const answer = this.handleToothExtractionQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('干槽症') || question.includes('拔牙后疼痛')) {
      const answer = this.handleDrySocketQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 儿童口腔
    if (question.includes('儿童') || question.includes('乳牙') || question.includes('孩子')) {
      const answer = this.handlePediatricDentalQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 其他问题
    if (question.includes('刷牙') || question.includes('口腔卫生') || question.includes('漱口')) {
      const answer = this.handleOralHygieneQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('治疗') || question.includes('怎么办') || question.includes('怎么治')) {
      const answer = this.handleGeneralTreatmentQuestion(question);
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 问候语
    if (question.includes('你好') || question.includes('您好') || question.includes('hi') || question.includes('hello')) {
      const answer = '您好！我是Mandible AI口腔医学智能助手，请问有什么可以帮助您的？';
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    if (question.includes('谢谢') || question.includes('感谢')) {
      const answer = '不客气！如果您还有其他问题，随时可以问我。';
      this.context.push({ role: 'assistant', content: answer });
      return answer;
    }
    
    // 默认回答
    const defaultAnswer = '抱歉，我无法回答这个问题。请问您有关于口腔健康或CBCT诊断的具体问题吗？您可以尝试问我关于龋齿、牙周病、口腔黏膜病、颌面部疾病、口腔修复、正畸等方面的问题。';
    this.context.push({ role: 'assistant', content: defaultAnswer });
    return defaultAnswer;
  }
  
  // 检查对话上下文
  private checkContext(question: string): string | null {
    // 简单的上下文理解
    if (question.includes('它') || question.includes('这') || question.includes('那') || question.includes('该')) {
      // 查找最近的相关回答
      for (let i = this.context.length - 1; i >= 0; i--) {
        if (this.context[i].role === 'assistant') {
          return `关于您刚才提到的问题，${this.context[i].content}`;
        }
      }
    }
    return null;
  }
  
  // 处理龋病问题
  private handleCariesQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `龋病的主要原因包括：\n${this.knowledgeBase.toothDental.caries.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `龋病的症状包括：\n${this.knowledgeBase.toothDental.caries.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `龋病的治疗方法包括：\n${this.knowledgeBase.toothDental.caries.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    if (question.includes('预防') || question.includes('怎么防止')) {
      return `龋病的预防措施包括：\n${this.knowledgeBase.toothDental.caries.prevention.map((prevention: string) => `- ${prevention}`).join('\n')}`;
    }
    return `龋病是在以细菌为主的多种因素影响下，牙体硬组织发生慢性进行性破坏的一种疾病。主要原因包括细菌感染、食物因素、宿主因素和时间因素。治疗方法根据龋坏程度而定，从简单的补牙到复杂的根管治疗。预防龋病的关键是保持良好的口腔卫生，定期检查，控制糖的摄入。`;
  }
  
  // 处理牙髓炎问题
  private handlePulpitisQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `牙髓炎的主要原因包括：\n${this.knowledgeBase.toothDental.pulpitis.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `牙髓炎的症状包括：\n${this.knowledgeBase.toothDental.pulpitis.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `牙髓炎的治疗方法主要是根管治疗，清除感染的牙髓组织，填充根管。严重者可能需要拔牙。${this.knowledgeBase.toothDental.pulpitis.notes}`;
    }
    return `牙髓炎是牙髓组织的炎症，多由深龋未及时治疗发展而来。主要症状包括自发性阵发性疼痛、夜间痛、温度刺激加剧疼痛等。治疗方法主要是根管治疗，需要及时处理，否则可能发展为根尖周炎。`;
  }
  
  // 处理根尖周炎问题
  private handleApicalPeriodontitisQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `根尖周炎的主要原因包括：\n${this.knowledgeBase.toothDental.apicalPeriodontitis.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `根尖周炎的症状包括：\n${this.knowledgeBase.toothDental.apicalPeriodontitis.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `根尖周炎的治疗方法包括：\n${this.knowledgeBase.toothDental.apicalPeriodontitis.treatment.map((treatment: string) => `- ${treatment}`).join('\n')} ${this.knowledgeBase.toothDental.apicalPeriodontitis.notes}`;
    }
    return `根尖周炎是发生在牙根尖周围组织的炎症性疾病，多由牙髓炎未及时治疗发展而来。主要症状包括咬合痛、根尖区牙龈肿胀等。治疗方法包括根管治疗、根尖手术等，急性根尖周炎需要及时处理，缓解疼痛和肿胀。`;
  }
  
  // 处理牙龈炎问题
  private handleGingivitisQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `牙龈炎的主要原因包括：\n${this.knowledgeBase.periodontal.gingivitis.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `牙龈炎的症状包括：\n${this.knowledgeBase.periodontal.gingivitis.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `牙龈炎的治疗方法包括：\n${this.knowledgeBase.periodontal.gingivitis.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    if (question.includes('预防') || question.includes('怎么防止')) {
      return `牙龈炎的预防措施包括：\n${this.knowledgeBase.periodontal.gingivitis.prevention.map((prevention: string) => `- ${prevention}`).join('\n')}`;
    }
    return `牙龈炎是牙龈组织的炎症，不涉及牙周膜和牙槽骨。主要原因是牙菌斑堆积和牙结石刺激。症状包括牙龈红肿、出血、松软等。治疗方法主要是洁治（洗牙）和保持良好的口腔卫生。`;
  }
  
  // 处理牙周炎问题
  private handlePeriodontitisQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `牙周炎的主要原因包括：\n${this.knowledgeBase.periodontal.periodontitis.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `牙周炎的症状包括：\n${this.knowledgeBase.periodontal.periodontitis.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `牙周炎的治疗方法包括：\n${this.knowledgeBase.periodontal.periodontitis.treatment.map((treatment: string) => `- ${treatment}`).join('\n')} ${this.knowledgeBase.periodontal.periodontitis.notes}`;
    }
    if (question.includes('分期') || question.includes('程度')) {
      return `牙周炎的分期包括：\n${this.knowledgeBase.periodontal.periodontitis.staging.map((stage: string) => `- ${stage}`).join('\n')}`;
    }
    return `牙周炎是累及牙龈、牙周膜、牙槽骨和牙骨质的慢性炎症性疾病。主要原因是牙菌斑和牙结石。症状包括牙龈出血、退缩、牙周袋形成、牙槽骨吸收、牙齿松动等。治疗方法包括基础治疗、手术治疗和维护治疗。牙周炎是成人牙齿丧失的主要原因，早期治疗效果好。`;
  }
  
  // 处理口腔溃疡问题
  private handleUlcerQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `口腔溃疡的主要原因包括：\n${this.knowledgeBase.mucosal.ulcer.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `口腔溃疡的症状包括：\n${this.knowledgeBase.mucosal.ulcer.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')} ${this.knowledgeBase.mucosal.ulcer.notes}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `口腔溃疡的治疗方法包括：\n${this.knowledgeBase.mucosal.ulcer.treatment.map((treatment: string) => `- ${treatment}`).join('\n')} ${this.knowledgeBase.mucosal.ulcer.notes}`;
    }
    return `口腔溃疡是口腔黏膜上的表浅性溃疡，常见的有复发性阿弗他溃疡。主要原因包括免疫因素、遗传因素、感染因素、营养缺乏等。症状包括圆形或椭圆形溃疡、疼痛明显等。治疗方法包括局部用药和全身用药，通常在1-2周内自愈。`;
  }
  
  // 处理白斑问题
  private handleLeukoplakiaQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `白斑的主要原因包括：\n${this.knowledgeBase.mucosal.leukoplakia.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `白斑的症状包括：\n${this.knowledgeBase.mucosal.leukoplakia.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')} ${this.knowledgeBase.mucosal.leukoplakia.notes}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `白斑的治疗方法包括：\n${this.knowledgeBase.mucosal.leukoplakia.treatment.map((treatment: string) => `- ${treatment}`).join('\n')} ${this.knowledgeBase.mucosal.leukoplakia.notes}`;
    }
    return `白斑是发生在口腔黏膜上的白色斑块，属于癌前病变。主要原因包括吸烟、饮酒、嚼槟榔等。症状包括白色斑块、表面粗糙等。治疗方法包括去除刺激因素、定期复查，必要时手术切除。白斑有一定的癌变风险，需要密切观察。`;
  }
  
  // 处理阻生智齿问题
  private handleImpactedWisdomToothQuestion(question: string): string {
    if (question.includes('分类') || question.includes('类型')) {
      return `阻生智齿的分类包括：\n${this.knowledgeBase.maxillofacial.impactedWisdomTooth.classification.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('并发症') || question.includes('危害')) {
      return `阻生智齿的并发症包括：\n${this.knowledgeBase.maxillofacial.impactedWisdomTooth.complications.map((complication: string) => `- ${complication}`).join('\n')}`;
    }
    if (question.includes('拔除') || question.includes('要拔吗')) {
      return `阻生智齿需要拔除的情况包括：\n${this.knowledgeBase.maxillofacial.impactedWisdomTooth.indicationsForExtraction.map((indication: string) => `- ${indication}`).join('\n')} ${this.knowledgeBase.maxillofacial.impactedWisdomTooth.notes}`;
    }
    return `阻生智齿是指由于邻牙、骨或软组织的阻碍而只能部分萌出或完全不能萌出的第三磨牙。分类包括近中阻生、远中阻生、垂直阻生、水平阻生、倒置阻生等。并发症包括冠周炎、邻牙龋坏、颌骨囊肿等。是否需要拔除应根据具体情况评估，反复引起炎症或导致其他问题的阻生智齿建议拔除。`;
  }
  
  // 处理颌骨囊肿问题
  private handleJawCystQuestion(question: string): string {
    if (question.includes('类型') || question.includes('种类')) {
      return `颌骨囊肿的类型包括：\n${this.knowledgeBase.maxillofacial.jawCyst.types.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `颌骨囊肿的症状包括：\n${this.knowledgeBase.maxillofacial.jawCyst.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('诊断') || question.includes('怎么检查')) {
      return `颌骨囊肿的诊断方法包括：\n${this.knowledgeBase.maxillofacial.jawCyst.diagnosis.map((method: string) => `- ${method}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `颌骨囊肿的治疗方法主要是手术切除，根据囊肿类型和大小选择不同的手术方式。${this.knowledgeBase.maxillofacial.jawCyst.notes}`;
    }
    if (question.includes('良性') || question.includes('恶性')) {
      return `大多数颌骨囊肿是良性的，但也有少数可能恶变。常见的颌骨囊肿如根尖囊肿、含牙囊肿等都是良性的。角化囊肿有一定的复发倾向，需要密切随访。如果发现颌骨囊肿，应及时就医，进行手术治疗。`;
    }
    return `颌骨囊肿是颌骨内的囊性病变，内含液体或半固体物质。类型包括根尖囊肿、含牙囊肿、角化囊肿等。早期无明显症状，后期可能出现颌骨膨隆、牙齿松动等。诊断方法包括临床检查、X线检查、CT检查等。治疗方法主要是手术切除，否则可能导致颌骨破坏。`;
  }
  
  // 处理颞下颌关节紊乱病问题
  private handleTMDQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `颞下颌关节紊乱病的主要原因包括：\n${this.knowledgeBase.tmj.tmd.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `颞下颌关节紊乱病的症状包括：\n${this.knowledgeBase.tmj.tmd.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `颞下颌关节紊乱病的治疗方法包括：\n${this.knowledgeBase.tmj.tmd.treatment.map((treatment: string) => `- ${treatment}`).join('\n')} ${this.knowledgeBase.tmj.tmd.notes}`;
    }
    return `颞下颌关节紊乱病是一组累及颞下颌关节和咀嚼肌的疾病。主要原因包括精神因素、咬合因素、创伤等。症状包括关节弹响、关节疼痛、张口受限、咀嚼困难等。治疗以保守治疗为主，多数患者可以缓解。`;
  }
  
  // 处理CBCT相关问题
  private handleCBCTQuestion(question: string): string {
    if (question.includes('是什么') || question.includes('定义')) {
      return this.knowledgeBase.cbct.definition;
    }
    if (question.includes('优点') || question.includes('好处')) {
      return `CBCT的优点包括：\n${this.knowledgeBase.cbct.advantages.map((advantage: string) => `- ${advantage}`).join('\n')}`;
    }
    if (question.includes('应用') || question.includes('用途')) {
      return `CBCT的应用包括：\n${this.knowledgeBase.cbct.applications.map((application: string) => `- ${application}`).join('\n')}`;
    }
    if (question.includes('怎么看') || question.includes('解读')) {
      return `CBCT影像的解读包括：\n${this.knowledgeBase.cbct.interpretation.map((item: string) => `- ${item}`).join('\n')} ${this.knowledgeBase.cbct.notes}`;
    }
    return `CBCT（Cone Beam Computed Tomography）即锥形束计算机断层扫描，是一种先进的医学影像技术。它具有辐射剂量低、扫描时间短、空间分辨率高、三维成像清晰等优点。在口腔颌面部疾病的诊断和治疗规划中具有重要作用，如牙种植规划、阻生牙评估、根管治疗、颌骨病变诊断等。`;
  }
  
  // 处理口腔卫生问题
  private handleOralHygieneQuestion(question: string): string {
    return `保持良好的口腔卫生非常重要，建议：\n1. 每天早晚刷牙，使用巴氏刷牙法，每次刷牙至少2分钟\n2. 每天使用牙线或牙缝刷清洁牙缝\n3. 定期（每6-12个月）到医院洗牙\n4. 均衡饮食，控制糖的摄入\n5. 定期进行口腔检查\n6. 戒烟限酒\n7. 使用含氟牙膏和漱口水`;
  }
  
  // 处理一般治疗问题
  private handleGeneralTreatmentQuestion(question: string): string {
    if (question.includes('根管')) {
      return `根管治疗是治疗牙髓炎和根尖周炎的有效方法，步骤包括：\n1. 去除感染的牙髓组织\n2. 清理和成形根管\n3. 消毒根管\n4. 填充根管\n5. 修复牙齿\n根管治疗后，牙齿会变得较脆弱，建议做牙冠保护。`;
    }
    if (question.includes('洗牙')) {
      return `洗牙（洁治）是去除牙结石和牙菌斑的有效方法，建议每6-12个月进行一次。洗牙可以预防牙龈炎和牙周炎，保持口腔健康。洗牙过程中可能会有轻微的不适和出血，这是正常现象。`;
    }
    return '口腔疾病的治疗方法因疾病类型而异。建议您到正规的口腔医疗机构就诊，由专业医生根据具体情况制定治疗方案。早期诊断和治疗可以取得更好的效果，减少并发症的发生。';
  }
  
  // 处理牙外伤问题
  private handleDentalTraumaQuestion(question: string): string {
    if (question.includes('类型') || question.includes('种类')) {
      return `牙外伤的类型包括：\n${this.knowledgeBase.toothDental.dentalTrauma.types.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `牙外伤的治疗方法：\n- 牙震荡：${this.knowledgeBase.toothDental.dentalTrauma.treatment.concussion}\n- 牙折：${this.knowledgeBase.toothDental.dentalTrauma.treatment.fracture}\n- 牙脱位：${this.knowledgeBase.toothDental.dentalTrauma.treatment.luxation}\n${this.knowledgeBase.toothDental.dentalTrauma.emergency}`;
    }
    if (question.includes('应急') || question.includes('紧急')) {
      return this.knowledgeBase.toothDental.dentalTrauma.emergency;
    }
    return `牙外伤是指牙齿受到外力作用导致的损伤，常见类型包括牙震荡、牙折和牙脱位。治疗方法根据损伤类型而定，牙震荡通常只需观察，牙折需要修复，牙脱位需要复位固定。如果发生牙外伤，应立即就医，保存脱位牙齿（放在生理盐水或牛奶中）。`;
  }
  
  // 处理牙周脓肿问题
  private handlePeriodontalAbscessQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `牙周脓肿的主要原因包括：\n${this.knowledgeBase.periodontal.periodontalAbscess.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `牙周脓肿的症状包括：\n${this.knowledgeBase.periodontal.periodontalAbscess.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `牙周脓肿的治疗方法包括：\n${this.knowledgeBase.periodontal.periodontalAbscess.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    return `牙周脓肿是发生在牙周袋内的局限性化脓性炎症，主要由深牙周袋内的感染引起。症状包括牙龈红肿疼痛、牙周袋溢脓、牙齿松动等。治疗方法包括脓肿切开引流、牙周基础治疗、抗生素治疗等。`;
  }
  
  // 处理扁平苔藓问题
  private handleLichenPlanusQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `扁平苔藓的主要原因包括：\n${this.knowledgeBase.mucosal.lichenPlanus.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `扁平苔藓的症状包括：\n${this.knowledgeBase.mucosal.lichenPlanus.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')} ${this.knowledgeBase.mucosal.lichenPlanus.notes}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `扁平苔藓的治疗方法包括：\n${this.knowledgeBase.mucosal.lichenPlanus.treatment.map((treatment: string) => `- ${treatment}`).join('\n')} ${this.knowledgeBase.mucosal.lichenPlanus.notes}`;
    }
    return `扁平苔藓是一种常见的口腔黏膜慢性炎症性疾病，主要与免疫因素、遗传因素、感染因素等有关。症状包括白色网纹或斑块、黏膜充血、糜烂、疼痛等。治疗方法包括局部用药、全身用药、去除刺激因素等。扁平苔藓有一定的癌变倾向，需要定期复查。`;
  }
  
  // 处理口腔念珠菌病问题
  private handleOralCandidiasisQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `口腔念珠菌病的主要原因包括：\n${this.knowledgeBase.mucosal.oralCandidiasis.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `口腔念珠菌病的症状包括：\n${this.knowledgeBase.mucosal.oralCandidiasis.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `口腔念珠菌病的治疗方法包括：\n${this.knowledgeBase.mucosal.oralCandidiasis.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    if (question.includes('类型') || question.includes('种类')) {
      return `口腔念珠菌病的类型包括：\n${this.knowledgeBase.mucosal.oralCandidiasis.types.map((type: string) => `- ${type}`).join('\n')}`;
    }
    return `口腔念珠菌病是由念珠菌感染引起的口腔黏膜疾病，常见于免疫力下降、长期使用抗生素、糖尿病患者等。症状包括口腔黏膜白色假膜、黏膜充血、烧灼感等。治疗方法包括抗真菌药物治疗、保持口腔卫生、治疗基础疾病等。`;
  }
  
  // 处理口腔肿瘤问题
  private handleOralTumorQuestion(question: string): string {
    if (question.includes('类型') || question.includes('种类')) {
      return `口腔肿瘤的类型包括：\n良性肿瘤：\n${this.knowledgeBase.maxillofacial.oralTumor.types.benign.map((type: string) => `- ${type}`).join('\n')}\n恶性肿瘤：\n${this.knowledgeBase.maxillofacial.oralTumor.types.malignant.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `口腔肿瘤的症状包括：\n${this.knowledgeBase.maxillofacial.oralTumor.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('诊断') || question.includes('怎么检查')) {
      return `口腔肿瘤的诊断方法包括：\n${this.knowledgeBase.maxillofacial.oralTumor.diagnosis.map((method: string) => `- ${method}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `口腔肿瘤的治疗方法包括：\n${this.knowledgeBase.maxillofacial.oralTumor.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    if (question.includes('风险') || question.includes('因素')) {
      return `口腔肿瘤的风险因素包括：\n${this.knowledgeBase.maxillofacial.oralTumor.riskFactors.map((factor: string) => `- ${factor}`).join('\n')}`;
    }
    return `口腔肿瘤是发生在口腔组织的良性或恶性肿瘤。良性肿瘤包括乳头状瘤、纤维瘤等，恶性肿瘤主要是鳞状细胞癌。症状包括口腔内肿块、溃疡不愈、疼痛、出血等。诊断方法包括临床检查、影像学检查、病理检查。治疗方法包括手术治疗、放疗、化疗等。`;
  }
  
  // 处理颞下颌关节脱位问题
  private handleTMJDislocationQuestion(question: string): string {
    if (question.includes('原因') || question.includes('怎么得')) {
      return `颞下颌关节脱位的主要原因包括：\n${this.knowledgeBase.tmj.tmjDislocation.causes.map((cause: string) => `- ${cause}`).join('\n')}`;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `颞下颌关节脱位的症状包括：\n${this.knowledgeBase.tmj.tmjDislocation.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `颞下颌关节脱位的治疗方法包括：\n${this.knowledgeBase.tmj.tmjDislocation.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    return `颞下颌关节脱位是指髁突脱出关节窝外，不能自行复位。主要原因包括张口过大、外伤、关节结构异常等。症状包括张口不能闭合、下颌前伸、耳前区凹陷、疼痛等。治疗方法包括手法复位、固定制动、避免大张口等。`;
  }
  
  // 处理牙冠问题
  private handleDentalCrownQuestion(question: string): string {
    if (question.includes('类型') || question.includes('种类')) {
      return `牙冠的类型包括：\n${this.knowledgeBase.prosthodontics.dentalCrown.types.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('适应症') || question.includes('什么时候需要')) {
      return `牙冠的适应症包括：\n${this.knowledgeBase.prosthodontics.dentalCrown.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
    }
    if (question.includes('过程') || question.includes('步骤')) {
      return `牙冠的制作过程包括：\n${this.knowledgeBase.prosthodontics.dentalCrown.procedure.map((step: string) => `- ${step}`).join('\n')}`;
    }
    return `牙冠是覆盖在牙齿表面的修复体，用于恢复牙齿的形态和功能。类型包括金属冠、烤瓷冠、全瓷冠、树脂冠等。适应症包括牙体缺损较大、根管治疗后、牙齿变色、牙齿畸形等。制作过程包括牙体预备、取模、制作临时冠、试戴、粘结等步骤。`;
  }
  
  // 处理固定桥问题
  private handleDentalBridgeQuestion(question: string): string {
    if (question.includes('类型') || question.includes('种类')) {
      return `固定桥的类型包括：\n${this.knowledgeBase.prosthodontics.dentalBridge.types.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('适应症') || question.includes('什么时候需要')) {
      return `固定桥的适应症包括：\n${this.knowledgeBase.prosthodontics.dentalBridge.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
    }
    if (question.includes('优点')) {
      return `固定桥的优点包括：\n${this.knowledgeBase.prosthodontics.dentalBridge.advantages.map((advantage: string) => `- ${advantage}`).join('\n')}`;
    }
    if (question.includes('缺点')) {
      return `固定桥的缺点包括：\n${this.knowledgeBase.prosthodontics.dentalBridge.disadvantages.map((disadvantage: string) => `- ${disadvantage}`).join('\n')}`;
    }
    return `固定桥是用于修复缺失牙的固定修复体，类型包括金属桥、烤瓷桥、全瓷桥等。适应症包括缺失牙数目较少、缺牙区两侧有健康基牙等。优点是固定可靠、美观、咀嚼功能好，缺点是需要磨除邻牙、对基牙要求高。`;
  }
  
  // 处理义齿问题
  private handleDentureQuestion(question: string): string {
    if (question.includes('类型') || question.includes('种类')) {
      return `义齿的类型包括：\n${this.knowledgeBase.prosthodontics.denture.types.map((type: string) => `- ${type}`).join('\n')}`;
    }
    if (question.includes('适应症') || question.includes('什么时候需要')) {
      return `义齿的适应症包括：\n${this.knowledgeBase.prosthodontics.denture.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
    }
    if (question.includes('护理') || question.includes('保养')) {
      return `义齿的护理方法包括：\n${this.knowledgeBase.prosthodontics.denture.care.map((care: string) => `- ${care}`).join('\n')}`;
    }
    return `义齿是用于修复缺失牙的可摘修复体，类型包括活动义齿、全口义齿、精密附着体义齿等。适应症包括缺失牙数目较多、无法做固定修复、经济条件有限等。护理方法包括每日清洁、夜间取下浸泡、定期复查等。`;
  }
  
  // 处理种植牙问题
  private handleImplantQuestion(question: string): string {
    if (question.includes('优点')) {
      return `种植牙的优点包括：\n${this.knowledgeBase.prosthodontics.implant.advantages.map((advantage: string) => `- ${advantage}`).join('\n')}`;
    }
    if (question.includes('适应症') || question.includes('什么时候需要')) {
      return `种植牙的适应症包括：\n${this.knowledgeBase.prosthodontics.implant.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
    }
    if (question.includes('禁忌症') || question.includes('不能做')) {
      return `种植牙的禁忌症包括：\n${this.knowledgeBase.prosthodontics.implant.contraindications.map((contraindication: string) => `- ${contraindication}`).join('\n')}`;
    }
    return `种植牙是通过手术将人工牙根植入牙槽骨内，然后在其上制作牙冠。优点包括不需要磨除邻牙、固定可靠、美观自然、使用寿命长等。适应症包括单个或多个牙缺失、全口牙缺失等。禁忌症包括严重骨质疏松、未控制的糖尿病、凝血功能障碍等。`;
  }
  
  // 处理正畸问题
  private handleOrthodonticsQuestion(question: string): string {
    if (question.includes('牙套') || question.includes('矫正器')) {
      if (question.includes('类型') || question.includes('种类')) {
        return `牙套的类型包括：\n${this.knowledgeBase.orthodontics.braces.types.map((type: string) => `- ${type}`).join('\n')}`;
      }
      if (question.includes('适应症') || question.includes('什么时候需要')) {
        return `牙套的适应症包括：\n${this.knowledgeBase.orthodontics.braces.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
      }
      if (question.includes('时间') || question.includes('多久')) {
        return `牙套的治疗时间：\n${this.knowledgeBase.orthodontics.braces.treatmentTime.map((time: string) => `- ${time}`).join('\n')}`;
      }
    }
    if (question.includes('保持器')) {
      if (question.includes('类型') || question.includes('种类')) {
        return `保持器的类型包括：\n${this.knowledgeBase.orthodontics.retainer.types.map((type: string) => `- ${type}`).join('\n')}`;
      }
      if (question.includes('重要性') || question.includes('为什么需要')) {
        return `保持器的重要性：\n${this.knowledgeBase.orthodontics.retainer.importance.map((importance: string) => `- ${importance}`).join('\n')}`;
      }
      if (question.includes('佩戴时间') || question.includes('戴多久')) {
        return `保持器的佩戴时间：\n${this.knowledgeBase.orthodontics.retainer.wearingTime.map((time: string) => `- ${time}`).join('\n')}`;
      }
    }
    return `口腔正畸是通过矫正器来矫正牙齿排列不齐的方法。牙套的类型包括金属牙套、陶瓷牙套、隐形牙套、自锁牙套等。适应症包括牙齿拥挤、牙齿稀疏、龅牙、地包天、咬合不正等。治疗时间一般需要1-3年，取决于错颌畸形的严重程度。正畸治疗后需要佩戴保持器来防止牙齿反弹。`;
  }
  
  // 处理拔牙问题
  private handleToothExtractionQuestion(question: string): string {
    if (question.includes('适应症') || question.includes('什么时候需要')) {
      return `拔牙的适应症包括：\n${this.knowledgeBase.oralSurgery.toothExtraction.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
    }
    if (question.includes('并发症') || question.includes('风险')) {
      return `拔牙的并发症包括：\n${this.knowledgeBase.oralSurgery.toothExtraction.complications.map((complication: string) => `- ${complication}`).join('\n')}`;
    }
    if (question.includes('术后') || question.includes('护理')) {
      return `拔牙后的护理方法包括：\n${this.knowledgeBase.oralSurgery.toothExtraction.postoperativeCare.map((care: string) => `- ${care}`).join('\n')}`;
    }
    return `拔牙是口腔外科常见的手术，适应症包括严重龋坏、牙周病、阻生牙、正畸需要、病灶牙等。并发症包括出血、感染、干槽症、神经损伤、肿胀等。拔牙后的护理非常重要，包括咬紧纱布30分钟、24小时内不要刷牙漱口、避免热食、服用抗生素、保持口腔卫生等。`;
  }
  
  // 处理干槽症问题
  private handleDrySocketQuestion(question: string): string {
    if (question.includes('定义') || question.includes('是什么')) {
      return this.knowledgeBase.oralSurgery.drySocket.definition;
    }
    if (question.includes('症状') || question.includes('表现')) {
      return `干槽症的症状包括：\n${this.knowledgeBase.oralSurgery.drySocket.symptoms.map((symptom: string) => `- ${symptom}`).join('\n')}`;
    }
    if (question.includes('治疗') || question.includes('怎么治')) {
      return `干槽症的治疗方法包括：\n${this.knowledgeBase.oralSurgery.drySocket.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    return `干槽症是拔牙后牙槽窝内血凝块脱落，骨面暴露引起的疼痛。主要症状包括拔牙后2-3天出现剧烈疼痛、放射至耳颞部、牙槽窝空虚、有恶臭等。治疗方法包括清创、填塞碘仿纱条、止痛、抗生素治疗等。`;
  }
  
  // 处理儿童口腔问题
  private handlePediatricDentalQuestion(question: string): string {
    if (question.includes('乳牙') || question.includes('乳牙重要性')) {
      return `乳牙的重要性：\n${this.knowledgeBase.pediatric.deciduousTeeth.importance.map((importance: string) => `- ${importance}`).join('\n')}\n乳牙的护理：\n${this.knowledgeBase.pediatric.deciduousTeeth.care.map((care: string) => `- ${care}`).join('\n')}`;
    }
    if (question.includes('龋齿') || question.includes('蛀牙')) {
      return `儿童龋齿的预防：\n${this.knowledgeBase.pediatric.earlyCaries.prevention.map((prevention: string) => `- ${prevention}`).join('\n')}\n儿童龋齿的治疗：\n${this.knowledgeBase.pediatric.earlyCaries.treatment.map((treatment: string) => `- ${treatment}`).join('\n')}`;
    }
    if (question.includes('间隙保持器') || question.includes('间隙')) {
      return `间隙保持器的定义：${this.knowledgeBase.pediatric.spaceMaintenance.definition}\n间隙保持器的适应症：\n${this.knowledgeBase.pediatric.spaceMaintenance.indications.map((indication: string) => `- ${indication}`).join('\n')}`;
    }
    return `儿童口腔健康非常重要，乳牙的健康直接影响恒牙的发育。乳牙的重要性包括咀嚼功能、发音、美观、为恒牙保留间隙等。儿童口腔护理应该从第一颗牙萌出开始，包括正确刷牙、定期口腔检查、氟化物应用、窝沟封闭等。对于乳牙早失的情况，可能需要使用间隙保持器来保持恒牙萌出的间隙。`;
  }
}

// 导出智能体实例
export const dentalAgent = new DentalAgent();
