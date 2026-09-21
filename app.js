/* 原型中的侧栏名单与框架交互；区域选择在文件末尾单独维护。 */
const expertTimeSeed = Date.now();
const groups = {
  expert: [
    { id: 'ops_expert', name: '经营分析专家', icon: 'analysis', lastAskedAt: expertTimeSeed - 3 * 60000, color: 'blue' },
    { id: 'price_expert', name: '智慧价格专家', icon: 'price', lastAskedAt: expertTimeSeed - 24 * 60 * 60000, color: 'violet' },
    { id: 'user_expert', name: '用户运营专家', icon: 'users', lastAskedAt: expertTimeSeed - 10 * 60000, color: 'orange' },
    { id: 'device_expert', name: '故障诊断专家', icon: 'cardiogram', lastAskedAt: expertTimeSeed - 2 * 24 * 60 * 60000, color: 'teal' },
    { id: 'vehicle_expert', name: '车型复盘专家', icon: 'vehicle', lastAskedAt: expertTimeSeed - 2 * 60 * 60000, color: 'blue' }
  ],
  employee: [
    { id: 'operating_employee', name: '经营诊断', icon: 'analysis', color: 'blue' },
    { id: 'pricing_employee', name: '智慧价格', icon: 'price', color: 'violet' },
    { id: 'promotion_employee', name: '促销运营', icon: 'promotion', color: 'orange' },
    { id: 'competition_employee', name: '竞争洞察', icon: 'competition', color: 'teal' },
    { id: 'site_service_employee', name: '现场服务', icon: 'station', color: 'blue' },
    { id: 'device_employee', name: '设备管理', icon: 'device', color: 'teal' },
    { id: 'sentiment_employee', name: '舆情回复', icon: 'message', color: 'violet' },
    { id: 'monitoring_guard_employee', name: '监控值守', icon: 'monitor', color: 'orange' }
  ]
};
// 首次初始化历史示例时间，后续恢复已保存的时间，避免刷新将示例专家重新排到前面。
const expertQuestionStorageKey = 'ai-hub-expert-last-asked-v1';
const expertQuestionTimes = readExpertQuestionTimes();
groups.expert.forEach(person => {
  if (expertQuestionTimes[person.id]) person.lastAskedAt = expertQuestionTimes[person.id];
  else expertQuestionTimes[person.id] = person.lastAskedAt;
});
try { localStorage.setItem(expertQuestionStorageKey, JSON.stringify(expertQuestionTimes)); } catch { /* 本地存储不可用时，继续使用页面内存。 */ }
function readExpertQuestionTimes() {
  const values = Object.create(null);
  try {
    const saved = JSON.parse(localStorage.getItem(expertQuestionStorageKey) || '{}');
    groups.expert.forEach(person => {
      const timestamp = saved?.[person.id];
      if (typeof timestamp === 'number' && Number.isFinite(timestamp) && timestamp > 0 && timestamp <= Date.now()) values[person.id] = timestamp;
    });
  } catch { /* 本地存储不可用时，继续使用当前页面的时间。 */ }
  return values;
}
function formatExpertLastAsked(timestamp, now = Date.now()) {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return '';
  const elapsed = Math.max(0, now - timestamp);
  const minute = 60000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (elapsed < minute) return '刚刚';
  if (elapsed < hour) return `${Math.floor(elapsed / minute)}分钟前`;
  if (elapsed < day) return `${Math.floor(elapsed / hour)}小时前`;
  if (elapsed < 30 * day) return `${Math.floor(elapsed / day)}天前`;
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}
function expertQuestionTimeMarkup(person) {
  const label = formatExpertLastAsked(person.lastAskedAt);
  if (!label) return '';
  const date = new Date(person.lastAskedAt);
  return `<span class="person-last-asked"><time datetime="${date.toISOString()}" title="${date.toLocaleString('zh-CN', { hour12: false })}">${label}</time></span>`;
}
function recordExpertQuestion(expertId) {
  const person = groups.expert.find(item => item.id === expertId);
  if (!person) return; // 专家团与数字员工不套用专属专家的时间规则。
  person.lastAskedAt = Date.now();
  expertQuestionTimes[expertId] = person.lastAskedAt;
  try { localStorage.setItem(expertQuestionStorageKey, JSON.stringify(expertQuestionTimes)); } catch { /* 仍保留本页记录。 */ }
  updateExpertQuestionTimes();
}
// 专家团只从能力中心进入，侧栏展示五位专属专家。
groups.team = [
  { id: 'ops_team', name: '智慧运营专家团', icon: 'ops-collaboration', color: 'blue' },
  { id: 'growth_team', name: '经营提升专家团', icon: 'business-growth', color: 'violet' },
  { id: 'user_growth_team', name: '用户增长专家团', icon: 'user-growth', color: 'orange' },
  { id: 'device_team', name: '设备运维专家团', icon: 'maintenance', color: 'teal' }
];
function selectedExecutor() {
  return [...groups.expert, ...groups.team].find(person => person.id === selection.expert);
}
/* 专家介绍、能力点与任务文案基于 TeldHub v5，经营分析介绍按设计评审精简，车型复盘按功能说明转为面向用户的文案。 */
const profileDetails = {
  "ops_expert": {
    "description": "分析充电量、收入与用户变化，定位异常原因，提供运营建议。",
    "benefits": [
      "数据查询",
      "经营分析",
      "趋势诊断"
    ],
    "tasks": [
      {
        "label": "帮我分析济钢充电站最近7天充电量趋势，并说明是否存在异常。",
        "prompt": "帮我分析济钢充电站最近7天充电量趋势，并说明是否存在异常。"
      },
      {
        "label": "分析济南公司近7天经营异常站点，并给出主要原因和建议动作。",
        "prompt": "分析济南公司近7天经营异常站点，并给出主要原因和建议动作。"
      },
      {
        "label": "生成济钢充电站本周经营简报，包含充电量、收入和用户变化。",
        "prompt": "生成济钢充电站本周经营简报，包含充电量、收入和用户变化。"
      },
      {
        "label": "分析最近30天服务费收入变化，识别主要增减因素。",
        "prompt": "分析最近30天服务费收入变化，识别主要增减因素。"
      },
      {
        "label": "对比各场站高峰与平峰经营表现，识别可提升的运营机会。",
        "prompt": "对比各场站高峰与平峰经营表现，识别可提升的运营机会。"
      },
      {
        "label": "按工作日与周末对比各场站订单表现，识别增长机会。",
        "prompt": "按工作日与周末对比各场站订单表现，识别增长机会。"
      }
    ],
    "videoSrc": ""
  },
  "price_expert": {
    "description": "结合竞品价格、历史量价关系、场站时段特征和收益测算结果，形成价格诊断、调价空间分析和调价策略建议。",
    "benefits": [
      "智慧定价",
      "竞品分析",
      "收益测算"
    ],
    "tasks": [
      {
        "label": "分析济钢充电站周末热门时段的调价空间，并输出建议方案。",
        "prompt": "分析济钢充电站周末热门时段的调价空间，并输出建议方案。"
      },
      {
        "label": "对比周边竞品价格，评估本站当前服务费竞争力。",
        "prompt": "对比周边竞品价格，评估本站当前服务费竞争力。"
      },
      {
        "label": "生成一个调价策略说明，包含建议时段、调价幅度和收益影响。",
        "prompt": "生成一个调价策略说明，包含建议时段、调价幅度和收益影响。"
      },
      {
        "label": "分析重点场站当前价格竞争力，并识别可调价时段。",
        "prompt": "分析重点场站当前价格竞争力，并识别可调价时段。"
      },
      {
        "label": "测算服务费上调0.02元/度对充电量和收益的可能影响。",
        "prompt": "测算服务费上调0.02元/度对充电量和收益的可能影响。"
      },
      {
        "label": "对比不同调价方案的预计收益，推荐优先验证的方案。",
        "prompt": "对比不同调价方案的预计收益，推荐优先验证的方案。"
      }
    ],
    "videoSrc": ""
  },
  "user_expert": {
    "description": "围绕新用户复充、流失用户召回、沉睡用户唤醒等场景进行人群识别、分层分析和运营策略设计，支持活动复盘。",
    "benefits": [
      "用户运营",
      "新客转化",
      "流失召回"
    ],
    "tasks": [
      {
        "label": "分析济钢充电站流失用户召回机会，并生成分层召回策略。",
        "prompt": "分析济钢充电站流失用户召回机会，并生成分层召回策略。"
      },
      {
        "label": "识别近30天沉睡用户，输出唤醒活动建议。",
        "prompt": "识别近30天沉睡用户，输出唤醒活动建议。"
      },
      {
        "label": "分析新用户复充转化情况，并给出优化动作。",
        "prompt": "分析新用户复充转化情况，并给出优化动作。"
      },
      {
        "label": "识别最近30天高价值沉睡用户，并生成差异化召回建议。",
        "prompt": "识别最近30天高价值沉睡用户，并生成差异化召回建议。"
      },
      {
        "label": "分析不同用户群的充电时段偏好，形成精细化运营建议。",
        "prompt": "分析不同用户群的充电时段偏好，形成精细化运营建议。"
      },
      {
        "label": "分析首充用户的复充周期，推荐合适的触达时间。",
        "prompt": "分析首充用户的复充周期，推荐合适的触达时间。"
      }
    ],
    "videoSrc": ""
  },
  "vehicle_expert": {
    "description": "输入车牌号或车架号，查清爱车信息；车型不对，帮你提交更正申请。",
    "benefits": ["查爱车信息", "看认证状态", "申请改车型"],
    "tasks": [
      { "label": "帮我查一下爱车的品牌和车型。", "prompt": "我想用车牌号查询爱车的品牌和车型，需要提供哪些信息？" },
      { "label": "看看我的爱车认证通过了吗？", "prompt": "帮我查看爱车是否已通过认证，以及当前认证的车型。" },
      { "label": "车型显示不对，帮我申请修改。", "prompt": "我的爱车车型显示不对，想改成正确的车型，请帮我准备更正申请。" },
      { "label": "用车架号能查到我的车型吗？", "prompt": "我想用车架号（VIN）查询车辆的品牌和车型，应该怎么操作？" },
      { "label": "识别出的车型和认证车型一样吗？", "prompt": "帮我对比系统识别出的车型和爱车认证车型，看看有没有不一致的地方。" },
      { "label": "查到好几个车型，帮我核对一下。", "prompt": "系统识别出了几个可能的车型，帮我列出来，核对哪个与我的爱车一致。" }
    ],
    "videoSrc": ""
  },
  "device_expert": {
    "description": "结合设备状态、故障类型、在线情况、历史工单和运行数据，对设备异常进行诊断并形成处置建议。",
    "benefits": [
      "故障诊断",
      "离线巡检",
      "工单建议"
    ],
    "tasks": [
      {
        "label": "分析当前持续离线终端，并给出优先处理建议。",
        "prompt": "分析当前持续离线终端，并给出优先处理建议。"
      },
      {
        "label": "诊断济南公司设备故障Top20，并定位主要根因。",
        "prompt": "诊断济南公司设备故障Top20，并定位主要根因。"
      },
      {
        "label": "根据异常设备生成运维工单建议，说明优先级。",
        "prompt": "根据异常设备生成运维工单建议，说明优先级。"
      },
      {
        "label": "筛选当前高风险设备，并按照影响程度给出处置优先级。",
        "prompt": "筛选当前高风险设备，并按照影响程度给出处置优先级。"
      },
      {
        "label": "关联历史工单，诊断当前重点设备异常的可能故障链路。",
        "prompt": "关联历史工单，诊断当前重点设备异常的可能故障链路。"
      },
      {
        "label": "对比各场站设备可用率，生成本周巡检重点清单。",
        "prompt": "对比各场站设备可用率，生成本周巡检重点清单。"
      }
    ],
    "videoSrc": ""
  }
};
// 专家团介绍来自 v5；保留基础案例并补充同场景示例供换批展示。
const teamProfileData = {
  ops_team: {
    description: '由经营、价格、用户、设备等多位专家协同完成复杂经营任务，适合综合诊断、经营提升和管理视角汇报。',
    benefits: ['综合经营', '多专家协同', '经营提升'],
    tasks: ['全面分析济钢充电站最近7天充电量变化趋势、原因及建议动作。', '围绕经营下滑问题，综合分析价格、用户和设备因素，形成闭环方案。', '汇总重点场站本周经营变化，生成运营例会简报。', '关联价格、用户和设备数据，定位服务费收入下降原因。', '识别低效时段的经营机会，给出多专家协同建议。', '对比改善前后的运营表现，复盘本周重点措施。']
  },
  growth_team: {
    description: '围绕场站收益提升目标，由经营、价格和用户专家协同分析机会、形成策略并评估影响。',
    benefits: ['经营分析', '价格策略', '用户增长'],
    tasks: ['分析当前最值得优先提升的场站，并形成经营提升方案。', '综合价格、用户和经营表现，识别本周收益提升机会。', '对比各场站量价表现，筛选可以改善收益的时段。', '结合用户需求与价格策略，生成低谷时段增长建议。', '分析经营改善措施的执行结果，找出可复制的做法。', '测算重点场站收益提升空间，给出分阶段行动计划。']
  },
  user_growth_team: {
    description: '由用户、价格和促销运营专家协同完成新客转化、沉睡唤醒和流失召回等增长任务。',
    benefits: ['用户运营', '价格策略', '促销运营'],
    tasks: ['分析新用户复充转化问题，并形成协同增长方案。', '识别高价值沉睡用户并制定分层召回策略。', '分析新客首充后的流失节点，提出转化改进措施。', '结合充电偏好与价格敏感度，生成用户分群方案。', '复盘近期召回活动，识别适合持续触达的用户群。', '设计工作日低谷时段活动，预测目标用户与转化机会。']
  },
  device_team: {
    description: '聚焦设备健康、离线终端、工单流转和运维处置，通过多能力协同完成设备问题识别、分析和闭环执行。',
    benefits: ['设备健康', '协同处置', '工单闭环'],
    tasks: ['定位济钢充电站重点设备异常，并形成处置建议。', '针对高频故障终端开展多维诊断，输出修复优先级。', '结合故障频次与经营影响，生成优先维修清单。', '分析维修后的设备表现，检查故障是否反复出现。', '汇总本周设备健康情况，生成运维例会简报。', '对比各站点设备可用率，提出下周巡检计划。']
  }
};
Object.entries(teamProfileData).forEach(([id, details]) => {
  profileDetails[id] = { ...details, videoSrc: '', tasks: details.tasks.map(prompt => ({ label: prompt, prompt })) };
});

// 列表取自 v5 最终生效的 abilitySceneData + capabilityMeta，而非早期 capData。
const capabilityCatalog = [
  { id: 'ops_expert', type: 'expert', name: '经营分析专家', scene: '经营分析', icon: 'analysis-filled', color: 'blue', description: '识别经营异常、拆解经营缺口并定位主要影响因素。', tags: ['经营诊断', '异常归因', '经营复盘'], meta: '8个核心技能', usage: '128.6万', authorized: true, profileId: 'ops_expert' },
  { id: 'price_expert', type: 'expert', name: '智慧价格专家', scene: '智慧价格', icon: 'price-filled', color: 'violet', description: '结合竞品价格、需求和收益预测形成价格策略建议。', tags: ['智慧定价', '竞品分析', '收益测算'], meta: '6个核心技能', usage: '96.4万', authorized: true, profileId: 'price_expert' },
  { id: 'user_expert', type: 'expert', name: '用户运营专家', scene: '用户运营', icon: 'users-filled', color: 'orange', description: '识别新用户、沉睡和流失人群，形成分层运营策略。', tags: ['新客转化', '流失召回', '沉睡唤醒'], meta: '7个核心技能', usage: '88.1万', authorized: false, profileId: 'user_expert' },
  { id: 'device_expert', type: 'expert', name: '故障诊断专家', scene: '设备运维', icon: 'cardiogram-filled', color: 'teal', description: '结合设备状态、故障类型和历史工单定位设备问题。', tags: ['故障诊断', '离线巡检', '工单建议'], meta: '9个核心技能', usage: '73.2万', authorized: true, profileId: 'device_expert' },
  { id: 'vehicle_expert', type: 'expert', name: '车型复盘专家', scene: '车辆服务', icon: 'vehicle-filled', color: 'blue', description: '查清爱车的品牌、车型和认证状态，车型不对时帮你申请更正。', tags: ['查爱车信息', '看认证状态', '申请改车型'], meta: '3项服务', authorized: true, profileId: 'vehicle_expert' },
  { id: 'ops_team', type: 'team', name: '智慧运营专家团', scene: '经营分析', icon: 'ops-collaboration-filled', color: 'blue', description: '经营、价格、用户、设备专家协同完成复杂经营任务。', tags: ['经营分析', '智慧价格', '用户运营', '设备运维'], meta: '4位专家协作', usage: '152.8万', authorized: true, profileId: 'ops_team' },
  { id: 'growth_team', type: 'team', name: '经营提升专家团', scene: '智慧价格', icon: 'business-growth-filled', color: 'violet', description: '围绕收益目标综合分析价格、用户与经营策略。', tags: ['经营分析', '价格策略', '用户增长'], meta: '4位专家协作', usage: '82.3万', authorized: true, profileId: 'growth_team' },
  { id: 'user_growth_team', type: 'team', name: '用户增长专家团', scene: '用户运营', icon: 'user-growth-filled', color: 'orange', description: '用户、价格与经营专家协同完成增长和召回任务。', tags: ['用户运营', '价格策略', '促销运营'], meta: '3位专家协作', usage: '69.7万', authorized: false, profileId: 'user_growth_team' },
  { id: 'device_team', type: 'team', name: '设备运维专家团', scene: '设备运维', icon: 'maintenance-filled', color: 'teal', description: '诊断、工单、能效能力协同完成故障定位与处置。', tags: ['设备诊断', '工单协同', '设备健康'], meta: '3位专家协作', usage: '64.5万', authorized: true, profileId: 'device_team' },
  { id: 'charge-root-cause', type: 'skill', name: '充电量异常根因分析', scene: '经营分析', icon: 'root-cause-filled', color: 'blue', description: '基于基线、用户群、时段等维度定位充电量异常贡献因素。', meta: '经营分析', authorized: true },
  { id: 'price-space', type: 'skill', name: '竞品价格空间分析', scene: '智慧价格', icon: 'competition-filled', color: 'violet', description: '分析周边竞品价格，计算本站竞争力与可调整空间。', meta: '智慧价格', authorized: true },
  { id: 'user-recall', type: 'skill', name: '用户流失召回', scene: '用户运营', icon: 'user-recall-filled', color: 'orange', description: '识别高价值流失用户并形成分层召回策略。', meta: '用户运营', authorized: true },
  { id: 'device-diagnosis', type: 'skill', name: '设备故障诊断', scene: '设备运维', icon: 'fault-diagnosis-filled', color: 'teal', description: '根据设备状态、故障码和历史记录定位故障链路。', meta: '设备运维', authorized: true }
];

/* 利益点统一使用本地 Solar Bold 面型图标，按能力名称显式对应。 */
const benefitIcons = {
  "数据查询": "benefit-database",
  "经营分析": "benefit-chart",
  "趋势诊断": "benefit-trend",
  "智慧定价": "price-filled",
  "竞品分析": "competition-filled",
  "收益测算": "benefit-calculator",
  "用户运营": "users-filled",
  "新客转化": "benefit-conversion",
  "流失召回": "benefit-recall",
  "故障诊断": "benefit-diagnosis",
  "离线巡检": "benefit-offline",
  "工单建议": "benefit-workorder",
  "综合经营": "benefit-chart",
  "多专家协同": "team-filled",
  "经营提升": "benefit-trend",
  "价格策略": "price-filled",
  "用户增长": "benefit-conversion",
  "促销运营": "promotion-filled",
  "设备健康": "device-filled",
  "协同处置": "team-filled",
  "工单闭环": "benefit-workorder",
  "查爱车信息": "benefit-vehicle",
  "看认证状态": "benefit-vehicle-auth",
  "申请改车型": "benefit-vehicle-correction"
};
// 利益点按图标语义固定配色，不套用角色底座或页面主题色。
const benefitIconColors = {
  'benefit-database': '#F39A38',
  'benefit-chart': '#3F96EB',
  'benefit-trend': '#20B295',
  'price-filled': '#E9A13A',
  'competition-filled': '#1AA9BA',
  'benefit-calculator': '#20B295',
  'users-filled': '#F07891',
  'benefit-conversion': '#20B295',
  'benefit-recall': '#3F96EB',
  'device-filled': '#F39A38',
  'benefit-diagnosis': '#F39A38',
  'benefit-offline': '#3F96EB',
  'benefit-workorder': '#20B295',
  'team-filled': '#F39A38',
  'promotion-filled': '#F07891',
  'benefit-vehicle': '#3F96EB',
  'benefit-vehicle-auth': '#20B295',
  'benefit-vehicle-correction': '#F39A38'
};
const avatarColors = {
  blue: ['linear-gradient(145deg, #4c71f5 0%, #6aafff 100%)', '#ffffff'],
  violet: ['linear-gradient(145deg, #6550ec 0%, #9275fa 100%)', '#ffffff'],
  orange: ['linear-gradient(145deg, #ff8543 0%, #ffbc63 100%)', '#ffffff'],
  teal: ['linear-gradient(145deg, #0bbcaf 0%, #4ad8c8 100%)', '#ffffff']
};
const workspace = document.querySelector('#workspace');
const peopleList = document.querySelector('#peopleList');
const mainContent = document.querySelector('#mainContent');
const contentScroll = document.querySelector('#contentScroll');
const welcomeTitle = document.querySelector('#welcomeTitle');
const welcomeVisual = document.querySelector('.welcome-visual');
const businessContent = document.querySelector('#businessContent');
const profileDescription = document.querySelector('#profileDescription');
const profileBenefits = document.querySelector('#profileBenefits');
const profileTasks = document.querySelector('#profileTasks');
const profileVideo = document.querySelector('#profileVideo');
const profileVideoTitle = document.querySelector('#profileVideoTitle');
const profileVideoIcon = document.querySelector('#profileVideoIcon');
const suggestionsTitleText = document.querySelector('#suggestionsTitleText');
const refreshProfileTasks = document.querySelector('#refreshProfileTasks');
const profileTaskOffsets = new Map();
const profileTaskBatchSize = 4;
const taskComposer = document.querySelector('#taskComposer');
// 同步悬浮输入框高度，确保最后一条正文能滚过遮罩，且输入框增高时仍可查看。
const composerLayoutObserver = new ResizeObserver(() => {
  if (taskComposer.hidden) return;
  const height = Math.ceil(taskComposer.getBoundingClientRect().height);
  if (!height || mainContent.style.getPropertyValue('--composer-height') === `${height}px`) return;
  const keepAtBottom = mainContent.classList.contains('is-task') && contentScroll.scrollHeight - contentScroll.scrollTop - contentScroll.clientHeight < 48;
  mainContent.style.setProperty('--composer-height', `${height}px`);
  if (keepAtBottom) requestAnimationFrame(() => { contentScroll.scrollTop = contentScroll.scrollHeight; });
});
composerLayoutObserver.observe(taskComposer);
const taskPrompt = document.querySelector('#taskPrompt');
const taskDraftStatus = document.querySelector('#taskDraftStatus');
const taskDrafts = new Map();
let renderedProfileId = null;
const tabs = [...document.querySelectorAll('[data-tab]')];
const collapseButton = document.querySelector('#collapseButton');
const selection = { expert: 'ops_expert' };
let activeGroup = 'expert';
let currentView = 'expert';
let activeTask = null;
let taskSequence = 0;
let launchedFromCapabilities = false;

function expertsByLastAsked() {
  const timestamp = person => Number.isFinite(person.lastAskedAt) && person.lastAskedAt > 0 ? person.lastAskedAt : 0;
  return [...groups.expert].sort((a, b) => timestamp(b) - timestamp(a));
}

function renderPeople() {
  const people = activeGroup === 'expert' ? expertsByLastAsked() : groups[activeGroup];
  peopleList.innerHTML = people.map(person => {
    const isExpert = activeGroup === 'expert';
    const selected = ['expert', 'task'].includes(currentView) && isExpert && selection.expert === person.id;
    const tag = isExpert ? 'button' : 'div';
    const [background, color] = avatarColors[person.color];
    return `<${tag} ${isExpert ? `type="button" data-person="${person.id}"` : ''} class="person-row${selected ? ' is-active' : ''}" aria-label="${person.name}${isExpert && formatExpertLastAsked(person.lastAskedAt) ? `，${formatExpertLastAsked(person.lastAskedAt)}` : ''}" ${selected ? 'aria-current="page"' : ''} title="${person.name}">
      <span class="person-avatar" style="--avatar-bg:${background};--avatar-color:${color}"><svg class="icon" aria-hidden="true"><use href="${iconUrl(`${person.icon}-filled`)}"></use></svg></span>
      <span class="person-copy">
        <span class="person-name">${person.name}</span>
        ${isExpert ? expertQuestionTimeMarkup(person) : ''}
      </span>
    </${tag}>`;
  }).join('');
  peopleList.setAttribute('aria-labelledby', `${activeGroup}Tab`);
}


// 更新现有节点，保留键盘焦点、选中态与侧栏滚动位置。
function updateExpertQuestionTimes() {
  if (activeGroup !== 'expert') return;
  groups.expert.forEach(person => {
    const row = peopleList.querySelector(`[data-person="${person.id}"]`);
    if (!row) return;
    const label = formatExpertLastAsked(person.lastAskedAt);
    row.setAttribute('aria-label', `${person.name}${label ? '，' + label : ''}`);
    const time = row.querySelector('.person-last-asked time');
    if (time && label) {
      const date = new Date(person.lastAskedAt);
      time.textContent = label; time.dateTime = date.toISOString();
      time.title = date.toLocaleString('zh-CN', { hour12: false });
    } else if (label) row.querySelector('.person-copy').insertAdjacentHTML('beforeend', expertQuestionTimeMarkup(person));
    else row.querySelector('.person-last-asked')?.remove();
  });
  // 发送后将最近提问的专家移到最前；相同时间保持原始顺序，无时间排末尾。
  const focused = peopleList.contains(document.activeElement) ? document.activeElement : null;
  const scrollTop = peopleList.scrollTop;
  expertsByLastAsked().forEach((person, index) => {
    const row = peopleList.querySelector(`[data-person="${person.id}"]`);
    if (row && peopleList.children[index] !== row) peopleList.insertBefore(row, peopleList.children[index] || null);
  });
  if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
  peopleList.scrollTop = scrollTop;
}
setInterval(() => { if (!document.hidden) updateExpertQuestionTimes(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateExpertQuestionTimes(); });

function updateNav() {
  const current = selectedExecutor().name;
  mainContent.setAttribute('aria-label', `${current}内容区`);
  renderProfile();
}

function iconUrl(name) {
  // 同名利益点资源由 Linear 换为 Bold，更新版本以刷新浏览器的外部 SVG 缓存。
  const version = name.startsWith('benefit-') ? '?v=bold-2' : '';
  return `./assets/icons/${name}.svg${version}#${name}`;
}

function iconMarkup(name) {
  return `<svg class="icon" aria-hidden="true"><use href="${iconUrl(name)}"></use></svg>`;
}

function syncTaskDraft(id) {
  stopVoiceDemo(false);
  closeComposerPopover();
  const draft = getTaskDraft(id);
  taskPrompt.value = draft.prompt;
  updateComposer();
}

function renderProfile() {
  const person = selectedExecutor();
  const details = profileDetails[person.id];
  if (renderedProfileId !== person.id) {
    welcomeTitle.textContent = person.name;
    profileDescription.textContent = details.description;
    profileBenefits.replaceChildren(...details.benefits.map(benefit => {
      const item = document.createElement('li');
      item.style.setProperty('--benefit-icon-color', benefitIconColors[benefitIcons[benefit]]);
      item.innerHTML = iconMarkup(benefitIcons[benefit]);
      const label = document.createElement('strong');
      label.textContent = benefit;
      item.append(label);
      return item;
    }));
    suggestionsTitleText.textContent = person.id.endsWith('_team') ? '专家团能帮你做点什么？' : '专家能帮你做点什么？';
    profileVideoTitle.textContent = person.name;
    profileVideoIcon.setAttribute('href', iconUrl(`${person.icon}-filled`));
    profileVideo.setAttribute('aria-label', `观看视频：${person.name}的能力与使用方式`);
    renderProfileTaskEntries(person);
    taskPrompt.placeholder = `例如：${details.tasks[0].prompt}`;
    renderedProfileId = person.id;
  }
  syncTaskDraft(person.id);
}


function renderProfileTaskEntries(person) {
  const tasks = profileDetails[person.id].tasks;
  const offset = profileTaskOffsets.get(person.id) || 0;
  const entries = Array.from({ length: Math.min(profileTaskBatchSize, tasks.length) }, (_, slot) => {
    const index = (offset + slot) % tasks.length;
    const task = tasks[index];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'expert-task';
    button.dataset.taskIndex = index;
    button.title = task.prompt;
    const label = document.createElement('span');
    label.textContent = task.label;
    const arrow = document.createElement('span');
    arrow.className = 'expert-task-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = iconMarkup('task-arrow');
    button.append(label, arrow);
    return button;
  });
  profileTasks.replaceChildren(...entries);
  refreshProfileTasks.disabled = tasks.length <= profileTaskBatchSize;
}

refreshProfileTasks.addEventListener('click', () => {
  const person = selectedExecutor();
  const tasks = profileDetails[person.id].tasks;
  if (tasks.length <= profileTaskBatchSize) return;
  const next = ((profileTaskOffsets.get(person.id) || 0) + profileTaskBatchSize) % tasks.length;
  profileTaskOffsets.set(person.id, next);
  renderProfileTaskEntries(person);
  taskDraftStatus.textContent = '已更换四个案例，点击案例可填入任务。';
});

function fillExpertTask(index) {
  const id = selection.expert;
  const task = profileDetails[id].tasks[index];
  if (!task) return;
  Object.assign(getTaskDraft(id), { index, prompt: task.prompt });
  syncTaskDraft(id);
  taskDraftStatus.textContent = `已填入“${task.label}”的任务内容，可继续编辑。`;
  taskPrompt.focus({ preventScroll: true });
  businessContent.dispatchEvent(new CustomEvent('expertpromptselect', { bubbles: true, detail: { profileId: id, label: task.label, prompt: task.prompt } }));
}
profileTasks.addEventListener('click', event => {
  const button = event.target.closest('[data-task-index]');
  if (button) fillExpertTask(Number(button.dataset.taskIndex));
});
profileVideo.addEventListener('click', openProfileVideo);

function openProfileVideo() {
  const person = selectedExecutor();
  const source = profileDetails[person.id].videoSrc;
  const title = `${person.name}的能力与使用方式`;
  const body = source
    ? `<video class="expert-video-player" controls playsinline preload="metadata" aria-label="${escapeHtml(title)}"></video>`
    : `<div class="expert-video-empty" role="status"><span class="video-entry-play" aria-hidden="true">${iconMarkup('video-play')}</span><strong>视频即将上线</strong><p>上线后可在这里观看能力与使用介绍</p></div>`;
  openComposerDialog(title, body, '', 'expert-video');
  const player = composerDialogBody.querySelector('video');
  if (player) player.src = source;
}

new IntersectionObserver(([entry]) => {
  welcomeVisual.classList.toggle('is-out-of-view', !entry.isIntersecting);
}, { root: contentScroll, threshold: 0 }).observe(welcomeVisual);

taskPrompt.addEventListener('input', event => {
  const draft = getTaskDraft(selection.expert);
  draft.prompt = taskPrompt.value;
  draft.index = profileDetails[selection.expert].tasks.findIndex(task => task.prompt === draft.prompt);
  updateComposerControls();
  if (!event.isComposing) updateInputReferences();
});
taskPrompt.addEventListener('compositionend', () => updateInputReferences());

function selectGroup(group) {
  activeGroup = group;
  tabs.forEach(tab => {
    const selected = tab.dataset.tab === group;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  renderPeople();
  // 分组切换只更新侧栏；员工页面未制作，不复用专家页面。
  peopleList.scrollTop = 0;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectGroup(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + 1) % tabs.length;
    selectGroup(tabs[next].dataset.tab);
    tabs[next].focus();
  });
});

peopleList.addEventListener('click', event => {
  const row = event.target.closest('[data-person]');
  if (!row || activeGroup !== 'expert') return;
  selection.expert = row.dataset.person;
  launchedFromCapabilities = false;
  setContentView('expert');
  // 保留现有节点，避免切换选中状态时丢失键盘焦点或列表滚动位置。
  peopleList.querySelectorAll('[data-person]').forEach(item => {
    const selected = item === row;
    item.classList.toggle('is-active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  updateNav();
  contentScroll.scrollTop = 0;
});

function setCollapsed(collapsed, animate = true) {
  workspace.classList.toggle('has-sidebar-motion', animate);
  workspace.classList.toggle('is-collapsed', collapsed);
  collapseButton.setAttribute('aria-expanded', String(!collapsed));
  collapseButton.setAttribute('aria-label', collapsed ? '展开侧栏' : '收起侧栏');
  collapseButton.title = collapsed ? '展开侧栏' : '收起侧栏';
}
collapseButton.addEventListener('click', () => setCollapsed(!workspace.classList.contains('is-collapsed')));
const compactViewport = window.matchMedia('(max-width: 680px)');
setCollapsed(compactViewport.matches, false);
compactViewport.addEventListener('change', event => setCollapsed(event.matches, false));
/* 区域选择：大区和公司是两个平级列表，沿用开发原型中的示例数据。 */
const areaData = {
  region: [
    ['R001', '山东大区'], ['R002', '华北大区'], ['R003', '华东大区'],
    ['R004', '华南大区'], ['R005', '西南大区']
  ],
  company: [
    ['C3701', '济南特来电新能源有限公司'], ['C3702', '青岛特来电新能源有限公司'],
    ['C3706', '烟台特来电新能源有限公司'], ['C3710', '威海特来电新能源有限公司'],
    ['C3713', '临沂特来电新能源有限公司']
  ]
};
const regionSelector = document.querySelector('#regionSelector');
const regionButton = document.querySelector('#regionButton');
const regionType = document.querySelector('#regionType');
const regionLabel = document.querySelector('#regionLabel');
const regionPopover = document.querySelector('#regionPopover');
const regionSearch = document.querySelector('#regionSearch');
const regionClear = document.querySelector('#regionClear');
const regionPanel = document.querySelector('#regionPanel');
const regionResults = document.querySelector('#regionResults');
const regionResultStatus = document.querySelector('#regionResultStatus');
const regionTabs = [...document.querySelectorAll('[data-area-tab]')];
const selectionToast = document.querySelector('#selectionToast');
let currentAreaTab = 'company';
let selectedArea = { type: 'company', code: 'C3701', name: areaData.company.find(([code]) => code === 'C3701')[1] };
let selectionToastTimer;

function renderSelectedArea() {
  const typeLabel = selectedArea.type === 'region' ? '大区' : '公司';
  regionType.textContent = typeLabel;
  regionLabel.textContent = selectedArea.name;
  regionButton.title = `${typeLabel}：${selectedArea.name}`;
  regionButton.setAttribute('aria-label', `区域选择，当前${typeLabel}：${selectedArea.name}`);
  regionButton.dataset.areaType = selectedArea.type;
  regionButton.dataset.areaCode = selectedArea.code;
}

function renderRegionResults() {
  const query = regionSearch.value.trim().toLowerCase();
  const rows = areaData[currentAreaTab].filter(([code, name]) =>
    !query || code.toLowerCase().includes(query) || name.toLowerCase().includes(query)
  );
  regionClear.hidden = !regionSearch.value;
  regionResults.innerHTML = rows.length ? rows.map(([code, name]) => {
    const selected = selectedArea?.type === currentAreaTab && selectedArea.code === code;
    return `<button type="button" class="region-option${selected ? ' is-selected' : ''}" data-area-code="${code}" aria-label="${code} ${name}" aria-pressed="${selected}">
      <span class="region-option-code">${code}</span><span>${name}</span>
      <svg class="icon" aria-hidden="true"><use href="./assets/icons/selected-check.svg#selected-check"></use></svg>
    </button>`;
  }).join('') : '<div class="region-empty">暂无匹配结果</div>';
  regionResults.scrollTop = 0;
  regionResultStatus.textContent = rows.length ? `找到 ${rows.length} 个${currentAreaTab === 'region' ? '大区' : '公司'}` : '暂无匹配结果';
}

function positionRegionPopover() {
  if (regionPopover.hidden) return;
  const rect = regionButton.getBoundingClientRect();
  const width = Math.min(440, document.documentElement.clientWidth - 24);
  const left = Math.max(12, Math.min(rect.left, document.documentElement.clientWidth - width - 12));
  const top = rect.bottom + 8;
  regionPopover.style.width = `${width}px`;
  regionPopover.style.left = `${left}px`;
  regionPopover.style.top = `${top}px`;
  regionPopover.style.maxHeight = `${Math.max(0, window.innerHeight - top - 12)}px`;
}

function closeRegionPopover(returnFocus = false) {
  regionPopover.hidden = true;
  regionButton.setAttribute('aria-expanded', 'false');
  if (returnFocus) regionButton.focus();
}

function openRegionPopover() {
  renderRegionResults();
  regionPopover.hidden = false;
  regionButton.setAttribute('aria-expanded', 'true');
  positionRegionPopover();
  regionSearch.focus({ preventScroll: true });
}

function selectRegionTab(type) {
  currentAreaTab = type;
  regionTabs.forEach(tab => {
    const selected = tab.dataset.areaTab === type;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) regionPanel.setAttribute('aria-labelledby', tab.id);
  });
  renderRegionResults();
}

regionButton.addEventListener('click', () => {
  if (regionPopover.hidden) openRegionPopover();
  else closeRegionPopover();
});
regionButton.addEventListener('keydown', event => {
  if (event.key !== 'ArrowDown') return;
  event.preventDefault();
  openRegionPopover();
});
regionSearch.addEventListener('input', renderRegionResults);
regionSearch.addEventListener('keydown', event => {
  if (event.key !== 'ArrowDown') return;
  const firstOption = regionResults.querySelector('.region-option');
  if (!firstOption) return;
  event.preventDefault();
  firstOption.focus();
});
regionClear.addEventListener('click', () => {
  regionSearch.value = '';
  renderRegionResults();
  regionSearch.focus();
});
regionTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectRegionTab(tab.dataset.areaTab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? regionTabs.length - 1 : (index + 1) % regionTabs.length;
    selectRegionTab(regionTabs[next].dataset.areaTab);
    regionTabs[next].focus();
  });
});
regionResults.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  const options = [...regionResults.querySelectorAll('.region-option')];
  const index = options.indexOf(event.target.closest('.region-option'));
  if (index < 0) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1
    : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
  options[next].focus();
});
regionResults.addEventListener('click', event => {
  const option = event.target.closest('[data-area-code]');
  if (!option) return;
  const [code, name] = areaData[currentAreaTab].find(item => item[0] === option.dataset.areaCode);
  selectedArea = { type: currentAreaTab, code, name };
  renderSelectedArea();
  closeRegionPopover(true);
  clearTimeout(selectionToastTimer);
  selectionToast.textContent = `已选择${currentAreaTab === 'region' ? '大区' : '公司'}：${name}`;
  selectionToast.hidden = false;
  selectionToastTimer = setTimeout(() => { selectionToast.hidden = true; }, 2400);
  // 后续业务模块可监听此事件，获取 { type, code, name } 后切换数据范围。
  regionSelector.dispatchEvent(new CustomEvent('regionchange', { bubbles: true, detail: { ...selectedArea } }));
});
regionSelector.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !regionPopover.hidden) {
    event.preventDefault();
    closeRegionPopover(true);
  }
});
document.addEventListener('pointerdown', event => {
  if (!regionSelector.contains(event.target)) closeRegionPopover();
});
document.addEventListener('focusin', event => {
  if (!regionSelector.contains(event.target)) closeRegionPopover();
});
window.addEventListener('resize', positionRegionPopover);
renderSelectedArea();
renderRegionResults();

/* 任务输入框：前端交互演示；文件、模型设置与任务均不发送到外部服务。 */
const composerRefs = document.querySelector('#composerReferences');
const composerAdd = document.querySelector('#composerAdd');
const composerModel = document.querySelector('#composerModel');
const composerModelName = document.querySelector('#composerModelName');
const composerSend = document.querySelector('#composerSend');
const composerMicrophone = document.querySelector('#composerMicrophone');
const composerVoice = document.querySelector('#composerVoice');
const composerFileInput = document.querySelector('#composerFileInput');
const composerPopover = document.querySelector('#composerPopover');
const composerDialog = document.querySelector('#composerDialog');
const composerDialogTitle = document.querySelector('#composerDialogTitle');
const composerDialogBody = document.querySelector('#composerDialogBody');
const composerDialogFooter = document.querySelector('#composerDialogFooter');
const composerRegion = document.querySelector('#composerRegion');
composerRegion.textContent = selectedArea.name;
composerRegion.title = selectedArea.name;
const models = [
  { id: 'Auto', label: 'Auto', meta: '自动选择合适的模型', cost: '' },
  { id: 'GLM-5.3', label: 'GLM-5.3', meta: '', cost: '0.79x' },
  { id: 'DeepSeek', label: 'DeepSeek', meta: '企业配置', cost: '', managed: true, protocol: 'OpenAI Compatible' },
  { id: 'GLM-5.2', label: 'GLM-5.2', meta: '企业配置', cost: '0.79x', managed: true, protocol: 'OpenAI Compatible' },
  { id: 'MiniMax-M3', label: 'MiniMax-M3', meta: '', cost: '0.25x', managed: true, protocol: '企业自购 API' },
  { id: 'Qwen3-235B', label: 'Qwen3-235B', meta: '', cost: '0.60x' }
];
function getModelIcon(model) {
  // Match the model family; unknown and automatic models keep the generic icon.
  const name = String(model.modelId || model.id || '').toLowerCase();
  const family = name.slice(name.lastIndexOf('/') + 1);
  if (/^deepseek(?:[\d._:-]|$)/.test(family)) return 'model-deepseek';
  if (/^(?:chat)?glm(?:[\d._:-]|$)/.test(family)) return 'model-glm';
  if (/^minimax(?:[\d._:-]|$)/.test(family)) return 'model-minimax';
  if (/^qwen(?:[\d._:-]|$)/.test(family)) return 'model-qwen';
  return 'composer-model';
}
const referenceChoices = {
  expert: [
    { label: '经营分析专家', meta: '经营异常与根因分析', icon: 'analysis', kind: 'expert' },
    { label: '智慧价格专家', meta: '价格诊断与调价策略', icon: 'price', kind: 'expert' },
    { label: '用户运营专家', meta: '用户分层与召回策略', icon: 'users', kind: 'expert' },
    { label: '故障诊断专家', meta: '设备异常与处置建议', icon: 'cardiogram-filled', kind: 'expert' },
    { label: '车型复盘专家', meta: '查爱车信息、核对认证与申请更正', icon: 'vehicle-filled', kind: 'expert' },
    { label: '智慧运营专家团', meta: '经营 + 设备 + 用户 + 价格', icon: 'capabilities', kind: 'expert' }
  ],
  skill: [
    { label: '充电量异常根因分析', meta: '经营分析', icon: 'benefit-chart', kind: 'skill' },
    { label: '设备故障诊断', meta: '设备运维', icon: 'device', kind: 'skill' }
  ],
  project: [
    { label: '济南公司智慧运营', meta: '智慧经营 · 132个场站', icon: 'composer-project', kind: 'project' },
    { label: '设备健康专项', meta: '设备运维 · 2,846个终端', icon: 'composer-project', kind: 'project' },
    { label: '充电安全运营', meta: '安全运营 · 防护专项', icon: 'composer-project', kind: 'project' }
  ],
  library: [
    { label: '智慧定价运营规范', meta: '公司资料', icon: 'composer-library', kind: 'library' },
    { label: '经营分析标准模板', meta: '平台资料', icon: 'composer-library', kind: 'library' }
  ],
  conversation: [
    { label: '经营异常分析.xlsx', meta: '上一轮任务产生', icon: 'benefit-chart', kind: 'conversation' },
    { label: '分析报告.md', meta: '当前上下文文件', icon: 'composer-file', kind: 'conversation' }
  ]
};
const pickerTitles = { expert: '选择专家 / 专家团', skill: '选择技能', project: '选择项目', library: '引用资料库', conversation: '引用对话中的文件', slash: '调用能力' };
let popoverAnchor = null;
let popoverMode = '';
let currentChoices = [];
let shortcutRange = null;
let voiceActive = false;
let uploadProfileId = null;
let customModelCount = 0;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
function taskDraftKey(id = selection.expert) {
  return currentView === 'task' && activeTask && id === selection.expert ? activeTask.draftId : id;
}
function getTaskDraft(id = selection.expert) {
  id = taskDraftKey(id);
  if (!taskDrafts.has(id)) taskDrafts.set(id, { prompt: '', index: -1, refs: [], model: 'Auto', project: null });
  return taskDrafts.get(id);
}
function notifyComposer(message) {
  clearTimeout(selectionToastTimer);
  selectionToast.textContent = message;
  selectionToast.hidden = false;
  selectionToastTimer = setTimeout(() => { selectionToast.hidden = true; }, 2600);
  taskDraftStatus.textContent = message;
}
function resizeTaskInput() {
  taskPrompt.style.height = 'auto';
  taskPrompt.style.height = `${Math.max(88, Math.min(taskPrompt.scrollHeight, 224))}px`;
}
function updateComposerControls() {
  const draft = getTaskDraft();
  const generating = currentView === 'task' && Boolean(activeTask?.generating);
  const sendLabel = generating ? '停止生成' : currentView === 'task' ? '发送' : '开始任务';
  composerSend.disabled = !generating && (!draft.prompt.trim() || voiceActive);
  composerSend.classList.toggle('is-stopping', generating);
  if (!generating) document.querySelector('#composerSendLabel').textContent = sendLabel;
  composerSend.setAttribute('aria-label', sendLabel);
  composerSend.title = sendLabel;
  resizeTaskInput();
}
function updateComposer() {
  const draft = getTaskDraft();
  const person = selectedExecutor();
  document.querySelector('#composerExpertName').textContent = person.name;
  document.querySelector('#composerExpertIcon use').setAttribute('href', iconUrl(`${person.icon}-filled`));
  const model = models.find(item => item.id === draft.model) || models[0];
  composerModelName.textContent = model.label;
  document.querySelector('#composerModelIcon use').setAttribute('href', iconUrl(getModelIcon(model)));
  composerModel.setAttribute('aria-label', `选择模型，当前 ${model.label}`);
  composerRefs.hidden = !draft.refs.length;
  composerRefs.innerHTML = draft.refs.map((ref, index) => `<span class="composer-reference" title="${escapeHtml(ref.label)}">${iconMarkup(ref.icon)}<span>${escapeHtml(ref.label)}</span><button type="button" data-remove-ref="${index}" aria-label="移除 ${escapeHtml(ref.label)}">${iconMarkup('composer-remove')}</button></span>`).join('');
  updateComposerControls();
}
function addComposerReference(choice, profileId = selection.expert) {
  const draft = getTaskDraft(profileId);
  if (choice.kind === 'project') {
    draft.refs = draft.refs.filter(ref => ref.kind !== 'project');
    draft.project = choice.label;
  }
  const key = choice.key || `${choice.kind}:${choice.label}`;
  if (draft.refs.some(ref => ref.key === key)) { notifyComposer('这项内容已经添加'); return; }
  draft.refs.push({ ...choice, key });
  if (taskDraftKey(profileId) === taskDraftKey()) updateComposer();
  taskDraftStatus.textContent = `已添加 ${choice.label}`;
}
composerRefs.addEventListener('click', event => {
  const button = event.target.closest('[data-remove-ref]');
  if (!button) return;
  const draft = getTaskDraft();
  const [removed] = draft.refs.splice(Number(button.dataset.removeRef), 1);
  if (removed?.kind === 'project') draft.project = null;
  updateComposer();
  taskPrompt.focus({ preventScroll: true });
});

function closeComposerPopover(returnFocus = false) {
  const anchor = popoverAnchor;
  composerPopover.hidden = true;
  composerAdd.setAttribute('aria-expanded', 'false');
  composerModel.setAttribute('aria-expanded', 'false');
  popoverAnchor = null;
  popoverMode = '';
  shortcutRange = null;
  if (returnFocus) anchor?.focus({ preventScroll: true });
}
function positionComposerPopover() {
  if (composerPopover.hidden || !popoverAnchor) return;
  const rect = popoverAnchor.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const width = Math.min(360, viewportWidth - 24);
  composerPopover.style.width = `${width}px`;
  composerPopover.style.maxHeight = `${Math.min(420, window.innerHeight - 24)}px`;
  const height = composerPopover.offsetHeight;
  const below = window.innerHeight - rect.bottom - 20;
  const top = below >= height ? rect.bottom + 8 : rect.top - height - 8;
  composerPopover.style.left = `${Math.max(12, Math.min(rect.left, viewportWidth - width - 12))}px`;
  composerPopover.style.top = `${Math.max(12, Math.min(top, window.innerHeight - height - 12))}px`;
}
function showComposerPopover(mode, anchor, html, focus = false) {
  closeComposerPopover();
  closeRegionPopover();
  popoverMode = mode;
  popoverAnchor = anchor;
  composerPopover.innerHTML = html;
  composerPopover.setAttribute('aria-label', mode === 'models' ? '选择模型' : mode === 'add' ? '添加文件与引用' : pickerTitles[mode] || '选择引用');
  composerPopover.hidden = false;
  if (anchor === composerAdd || anchor === composerModel) anchor.setAttribute('aria-expanded', 'true');
  positionComposerPopover();
  if (focus) composerPopover.querySelector('input, button')?.focus({ preventScroll: true });
}
function popoverHeader(title, back = false) {
  return `<div class="composer-popover-head">${back ? `<button type="button" class="composer-popover-back" data-composer-action="back" aria-label="返回添加菜单">${iconMarkup('chevron-left')}</button>` : ''}<h3>${title}</h3></div>`;
}
function choiceRow(choice, attributes = '', trail = '', icon = choice.icon || 'composer-model') {
  return `<button type="button" class="composer-option" ${attributes}><span class="composer-option-icon">${iconMarkup(icon)}</span><span class="composer-option-copy"><strong>${escapeHtml(choice.label)}</strong>${choice.meta ? `<small>${escapeHtml(choice.meta)}</small>` : ''}</span>${trail ? `<span class="composer-option-trail">${trail}</span>` : ''}</button>`;
}
function openAddMenu() {
  const entries = [
    { id: 'upload', label: '上传文件', meta: '图片、Excel、CSV、PDF、Markdown 等', icon: 'composer-attach' },
    { id: 'expert', label: '专家 / 专家团', meta: '手动指定专业协作对象', icon: 'expert' },
    { id: 'skill', label: '技能', meta: '直接调用明确业务能力', icon: 'capabilities' },
    { id: 'project', label: '项目', meta: '快速创建项目任务', icon: 'composer-project' },
    { id: 'library', label: '资料库', meta: '平台、公司或个人长期资料', icon: 'composer-library' }
  ];
  showComposerPopover('add', composerAdd, popoverHeader('添加到任务') + entries.map(item => choiceRow(item, `data-composer-action="${item.id}"`)).join(''), true);
}
function openModelMenu() {
  const selected = getTaskDraft().model;
  const html = popoverHeader('模型选择') + models.map((model, index) => choiceRow(model, `data-model-index="${index}" aria-pressed="${model.id === selected}"`, model.id === selected ? iconMarkup('selected-check') : escapeHtml(model.cost), getModelIcon(model))).join('') + `<div class="composer-popover-foot">${choiceRow({ label: '配置自定义模型', icon: 'composer-settings' }, 'data-composer-action="model-settings"')}</div>`;
  showComposerPopover('models', composerModel, html, true);
}
function renderPickerChoices(query = '') {
  const filtered = currentChoices.map((choice, index) => ({ choice, index })).filter(({ choice }) => `${choice.label}${choice.meta || ''}`.toLowerCase().includes(query.toLowerCase()));
  const box = composerPopover.querySelector('#composerChoiceOptions');
  box.innerHTML = filtered.length ? filtered.map(({ choice, index }) => choiceRow(choice, `data-pick-index="${index}"`)).join('') : '<div class="composer-empty">暂无匹配内容</div>';
  positionComposerPopover();
}
function openReferencePicker(kind, query = '', range = null) {
  currentChoices = kind === 'slash' ? [...referenceChoices.expert, ...referenceChoices.skill] : kind === 'conversation' && currentView === 'task' ? activeTask.deliverables.map(label => ({ label, meta: '当前任务产物', icon: 'composer-file', kind: 'conversation' })) : referenceChoices[kind];
  const isShortcut = Boolean(range);
  const html = popoverHeader(pickerTitles[kind], !isShortcut) + (isShortcut ? '' : '<input class="composer-choice-search" id="composerChoiceSearch" placeholder="搜索名称" aria-label="搜索引用内容" autocomplete="off">') + '<div id="composerChoiceOptions"></div>';
  showComposerPopover(kind, isShortcut ? taskPrompt : composerAdd, html);
  shortcutRange = range;
  renderPickerChoices(query);
  if (!isShortcut) composerPopover.querySelector('input')?.focus({ preventScroll: true });
}
composerPopover.addEventListener('input', event => {
  if (event.target.id === 'composerChoiceSearch') renderPickerChoices(event.target.value);
});
composerAdd.addEventListener('click', () => popoverMode === 'add' ? closeComposerPopover() : openAddMenu());
composerModel.addEventListener('click', () => popoverMode === 'models' ? closeComposerPopover() : openModelMenu());
composerPopover.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.modelIndex !== undefined) {
    getTaskDraft().model = models[Number(button.dataset.modelIndex)].id;
    updateComposer(); closeComposerPopover(true); return;
  }
  if (button.dataset.pickIndex !== undefined) {
    const choice = currentChoices[Number(button.dataset.pickIndex)];
    if (shortcutRange) {
      const { start, end } = shortcutRange;
      taskPrompt.value = taskPrompt.value.slice(0, start) + taskPrompt.value.slice(end);
      const draft = getTaskDraft();
      draft.prompt = taskPrompt.value;
      draft.index = profileDetails[selection.expert].tasks.findIndex(task => task.prompt === draft.prompt);
      taskPrompt.setSelectionRange(start, start);
    }
    addComposerReference(choice);
    closeComposerPopover(); taskPrompt.focus({ preventScroll: true }); return;
  }
  const action = button.dataset.composerAction;
  if (action === 'back') openAddMenu();
  else if (referenceChoices[action]) openReferencePicker(action);
  else if (action === 'upload') {
    uploadProfileId = taskDraftKey();
    closeComposerPopover(); composerFileInput.click();
  } else if (action === 'model-settings') {
    closeComposerPopover(); openModelSettingsDialog();
  }
});
function updateInputReferences() {
  const end = taskPrompt.selectionStart;
  // 中文正文通常不含空格，快捷引用可直接跟在已有内容后，或插入光标所在位置。
  const match = taskPrompt.value.slice(0, end).match(/([@/])([^\s@/]*)$/);
  if (!match || end !== taskPrompt.selectionEnd) {
    if (popoverAnchor === taskPrompt) closeComposerPopover();
    return;
  }
  openReferencePicker(match[1] === '@' ? 'conversation' : 'slash', match[2], { start: end - match[2].length - 1, end });
}
taskPrompt.addEventListener('keydown', event => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === 'Escape' && !composerPopover.hidden) { event.preventDefault(); closeComposerPopover(); return; }
  if (event.key === 'ArrowDown' && popoverAnchor === taskPrompt) {
    event.preventDefault(); composerPopover.querySelector('[data-pick-index]')?.focus({ preventScroll: true }); return;
  }
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    if (popoverAnchor === taskPrompt) composerPopover.querySelector('[data-pick-index]')?.click();
    else submitComposerTask();
  }
});
composerPopover.addEventListener('keydown', event => {
  if (event.key === 'Escape') { event.preventDefault(); closeComposerPopover(true); return; }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  if (event.target.matches('input') && event.key !== 'ArrowDown') return;
  const buttons = [...composerPopover.querySelectorAll('.composer-option')];
  if (!buttons.length) return;
  event.preventDefault();
  const index = buttons.indexOf(event.target);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
  buttons[next].focus({ preventScroll: true });
});
document.addEventListener('pointerdown', event => {
  if (!composerPopover.contains(event.target) && ![composerAdd, composerModel, ...(shortcutRange ? [taskPrompt] : [])].some(el => el.contains(event.target))) closeComposerPopover();
});
document.addEventListener('focusin', event => {
  if (!composerPopover.contains(event.target) && ![composerAdd, composerModel, ...(shortcutRange ? [taskPrompt] : [])].some(el => el.contains(event.target))) closeComposerPopover();
});
window.addEventListener('resize', () => { positionComposerPopover(); resizeTaskInput(); });
contentScroll.addEventListener('scroll', positionComposerPopover, { passive: true });

function addLocalFiles(files, profileId) {
  const supported = /\.(png|jpe?g|webp|xlsx?|csv|pdf|md|txt|docx?|pptx?)$/i;
  const accepted = files.filter(file => supported.test(file.name));
  accepted.forEach(file => addComposerReference({ label: file.name, kind: 'file', icon: 'composer-attach', size: file.size, key: `file:${file.name}:${file.size}:${file.lastModified}` }, profileId));
  if (accepted.length) notifyComposer(`已添加 ${accepted.length} 个本地文件`);
  if (accepted.length !== files.length) notifyComposer('部分文件格式不支持，请添加图片、文档或表格');
}
composerFileInput.addEventListener('change', () => {
  addLocalFiles([...composerFileInput.files], uploadProfileId || taskDraftKey());
  composerFileInput.value = ''; uploadProfileId = null;
});
taskComposer.addEventListener('dragover', event => {
  if (!event.dataTransfer.types.includes('Files')) return;
  event.preventDefault(); taskComposer.classList.add('is-dragging');
});
taskComposer.addEventListener('dragleave', event => {
  if (!taskComposer.contains(event.relatedTarget)) taskComposer.classList.remove('is-dragging');
});
taskComposer.addEventListener('drop', event => {
  if (!event.dataTransfer.files.length) return;
  event.preventDefault(); taskComposer.classList.remove('is-dragging');
  addLocalFiles([...event.dataTransfer.files], selection.expert);
});

function stopVoiceDemo(fillExample = false) {
  if (!voiceActive) return;
  voiceActive = false;
  composerVoice.hidden = true;
  composerMicrophone.setAttribute('aria-pressed', 'false');
  composerMicrophone.setAttribute('aria-expanded', 'false');
  composerMicrophone.setAttribute('aria-label', '语音输入');
  composerMicrophone.title = '语音输入';
  if (fillExample) {
    const example = profileDetails[selection.expert].tasks[0].prompt;
    taskPrompt.value = taskPrompt.value.trim() ? `${taskPrompt.value.trim()}\n${example}` : example;
    getTaskDraft().prompt = taskPrompt.value;
    notifyComposer('已填入文本');
    taskPrompt.focus({ preventScroll: true });
  }
  updateComposerControls();
}
composerMicrophone.addEventListener('click', () => {
  if (voiceActive) { stopVoiceDemo(true); return; }
  closeComposerPopover(); voiceActive = true;
  composerVoice.hidden = false;
  composerMicrophone.setAttribute('aria-pressed', 'true');
  composerMicrophone.setAttribute('aria-expanded', 'true');
  composerMicrophone.setAttribute('aria-label', '再次点击完成录入');
  composerMicrophone.title = '再次点击完成录入';
  updateComposerControls();
});
document.querySelector('#cancelVoice').addEventListener('click', () => {
  stopVoiceDemo(false);
  composerMicrophone.focus({ preventScroll: true });
});
document.querySelector('#finishVoice').addEventListener('click', () => stopVoiceDemo(true));
document.querySelector('.composer-voice-anchor').addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !voiceActive) return;
  event.preventDefault();
  stopVoiceDemo(false);
  composerMicrophone.focus({ preventScroll: true });
});

function openComposerDialog(title, body, footer, view = '') {
  if (view) composerDialog.dataset.view = view;
  else delete composerDialog.dataset.view;
  composerDialogTitle.textContent = title;
  composerDialogBody.innerHTML = body;
  composerDialogFooter.innerHTML = footer;
  if (!composerDialog.open) composerDialog.showModal();
}
function closeComposerDialog() {
  composerDialog.close();
}
document.querySelector('#closeComposerDialog').addEventListener('click', closeComposerDialog);
composerDialog.addEventListener('close', () => {
  composerDialogBody.querySelector('video')?.pause();
  // 移除表单字段，不读取或保留凭证，也不写入浏览器存储。
  composerDialogBody.replaceChildren(); composerDialogFooter.replaceChildren();
});
composerDialog.addEventListener('click', event => {
  if (event.target !== composerDialog) return;
  const rect = composerDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeComposerDialog();
});
function openModelSettingsDialog() {
  const configured = models.filter(model => model.meta === '企业配置' || model.custom || model.id === 'MiniMax-M3');
  openComposerDialog('自定义模型', '<p class="composer-dialog-note">配置企业自有模型后，可在任务输入框的模型列表中直接选择。</p>' + configured.map(model => `<div class="model-config-card">${iconMarkup(getModelIcon(model))}<b>${escapeHtml(model.label)}</b><span>${model.custom ? '自定义配置' : '企业配置'}</span></div>`).join('') + '<button type="button" class="model-add-button" data-dialog-action="add-model">添加自定义模型</button>', '<button type="button" data-dialog-action="close">关闭</button>');
}
function openCustomModelForm() {
  openComposerDialog('添加自定义模型', `<form class="custom-model-form" id="customModelForm" autocomplete="off">
    <label>模型名称<input name="modelName" required maxlength="40" placeholder="例如：企业大模型"></label>
    <label>服务商 / 协议<select name="protocol"><option>OpenAI Compatible</option><option>自定义 API</option></select></label>
    <label class="full-width">Base URL<input name="baseUrl" type="url" required placeholder="https://api.example.com/v1"></label>
    <label class="full-width">API Key<input name="apiKey" type="password" autocomplete="new-password" placeholder="请输入 API Key"></label>
    <label class="full-width">模型 ID<input name="modelId" required placeholder="model-id"></label>
  </form>`, '<button type="button" data-dialog-action="model-settings">返回</button><button type="submit" class="primary" form="customModelForm">保存配置</button>');
}
composerDialog.addEventListener('submit', event => {
  if (event.target.id !== 'customModelForm') return;
  event.preventDefault();
  const form = event.target;
  const name = form.elements.modelName.value.trim();
  const modelId = form.elements.modelId.value.trim();
  if (!name || !modelId) return;
  // 只添加演示名称与模型 ID，不读取 API Key，不调用或测试接口。
  const model = { id: `custom-${++customModelCount}`, label: name, modelId, meta: '自定义', cost: '', custom: true, protocol: form.elements.protocol.value };
  models.push(model); getTaskDraft().model = model.id;
  form.reset(); closeComposerDialog(); updateComposer();
  notifyComposer('自定义模型已添加');
});
composerDialog.addEventListener('click', event => {
  const action = event.target.closest('[data-dialog-action]')?.dataset.dialogAction;
  if (action === 'close') closeComposerDialog();
  else if (action === 'add-model') openCustomModelForm();
  else if (action === 'model-settings') openModelSettingsDialog();
  else if (action === 'confirm-logout') {
    closeComposerDialog();
    // 静态 Demo 没有登录会话，接入鉴权服务后在此执行真实退出。
    notifyComposer('当前页面尚未接入登录服务');
  }

});
/* 账户入口：按提供的截图只读展示；未接入登录、计费或远程模型服务。 */
const accountProfile = { name: '张灿', department: '技术研究院', team: 'AI及通用产品线', avatarUrl: '' };
const accountArea = document.querySelector('#accountArea');
const accountMenu = document.querySelector('#accountMenu');
let accountMenuInvoker = accountArea;

function renderAccountAvatar(container) {
  const initial = Array.from(accountProfile.name.trim())[0] || '用';
  container.textContent = initial;
  if (!accountProfile.avatarUrl) return;
  const avatar = new Image();
  avatar.alt = '';
  avatar.addEventListener('load', () => container.replaceChildren(avatar), { once: true });
  avatar.addEventListener('error', () => { container.textContent = initial; }, { once: true });
  avatar.src = accountProfile.avatarUrl;
}
function renderAccountProfile() {
  document.querySelector('#accountDepartment').textContent = accountProfile.department;
  document.querySelector('#accountName').textContent = accountProfile.name;
  accountArea.setAttribute('aria-label', `打开账户菜单，${accountProfile.department}，${accountProfile.name}`);
  renderAccountAvatar(document.querySelector('#accountAvatar'));
}
function positionAccountMenu() {
  if (accountMenu.hidden) return;
  const rect = accountArea.getBoundingClientRect();
  const collapsed = workspace.classList.contains('is-collapsed');
  const width = Math.min(194, window.innerWidth - 24);
  const height = accountMenu.offsetHeight;
  const preferredLeft = collapsed ? rect.right + 12 : rect.left;
  const preferredTop = collapsed ? rect.bottom - height : rect.top - height - 8;
  accountMenu.style.width = `${width}px`;
  accountMenu.style.left = `${Math.max(12, Math.min(preferredLeft, window.innerWidth - width - 12))}px`;
  accountMenu.style.top = `${Math.max(12, Math.min(preferredTop, window.innerHeight - height - 12))}px`;
}
function closeAccountMenu(returnFocus = false) {
  accountMenu.hidden = true;
  accountArea.setAttribute('aria-expanded', 'false');
  if (returnFocus) accountMenuInvoker.focus({ preventScroll: true });
}
function openAccountMenu(trigger, last = false) {
  closeRegionPopover();
  closeComposerPopover();
  accountMenuInvoker = trigger;
  accountMenu.hidden = false;
  accountArea.setAttribute('aria-expanded', 'true');
  positionAccountMenu();
  const items = accountMenu.querySelectorAll('[role="menuitem"]');
  items[last ? items.length - 1 : 0].focus({ preventScroll: true });
}
const accountDialogFooter = '<button type="button" class="primary" data-dialog-action="close">关闭</button>';
function openAccountProfileDialog() {
  openComposerDialog('个人信息', `<div class="account-profile-view"><span class="account-avatar" id="accountProfileAvatar" aria-hidden="true"></span><div class="account-profile-info"><h3>${escapeHtml(accountProfile.name)}</h3><p>${escapeHtml(accountProfile.team)}</p><p>${escapeHtml(accountProfile.department)}</p></div></div>`, accountDialogFooter, 'profile');
  renderAccountAvatar(document.querySelector('#accountProfileAvatar'));
}
function openAccountUsageDialog() {
  const usage = [{ label: 'Agent任务', value: 516200 }, { label: '专家 / 专家团', value: 168400 }, { label: '其他能力', value: 57900 }];
  const total = 2000000;
  const used = usage.reduce((sum, item) => sum + item.value, 0);
  const format = value => value.toLocaleString('en-US');
  openComposerDialog('账户管理', `<section class="account-plan"><span class="account-eyebrow">当前套餐</span><span class="account-availability">使用中</span><h3>企业专业版</h3><p>适用于企业多 Agent 协作、项目空间与高级模型能力</p></section><section aria-label="套餐使用情况"><div class="account-usage-heading"><h3>套餐使用情况</h3><span>本月自动重置</span></div><div class="account-quota"><p>平台 AI 资源</p><div class="account-quota-value"><strong>${format(used)}</strong><span>/ ${format(total)} Token</span></div><progress value="${used}" max="${total}" aria-label="平台 AI 资源使用量" aria-valuetext="已使用 ${format(used)}，共 ${format(total)} Token"></progress><small>剩余 ${format(total - used)} Token</small></div><div class="account-usage-grid">${usage.map(item => `<div><span>${item.label}</span><b>${format(item.value)}</b><small>Token</small></div>`).join('')}</div></section>`, accountDialogFooter, 'account');
}
function openAccountModelsDialog() {
  const configured = models.filter(model => model.managed || model.custom);
  openComposerDialog('模型管理', '<p class="composer-dialog-note">配置企业自有模型后，可在任务输入框的模型列表中直接选择。</p><div class="account-model-list">' + configured.map(model => `<div class="account-model-row"><span class="account-model-icon">${iconMarkup(getModelIcon(model))}</span><div class="account-model-copy"><b>${escapeHtml(model.label)}</b><small>${escapeHtml(model.protocol || 'OpenAI Compatible')} · ${model.custom ? '待验证' : '已连接'}</small></div><span class="account-availability${model.custom ? ' pending' : ''}">${model.custom ? '待验证' : '可用'}</span></div>`).join('') + '</div>', accountDialogFooter, 'models');
}
function openLogoutDialog() {
  openComposerDialog('退出登录', '<p class="composer-dialog-note">确认退出当前 TeldHub 账户？</p>', '<button type="button" data-dialog-action="close">取消</button><button type="button" class="primary" data-dialog-action="confirm-logout">退出登录</button>', 'logout');
}
accountArea.addEventListener('click', () => accountMenu.hidden ? openAccountMenu(accountArea) : closeAccountMenu(true));
accountArea.addEventListener('keydown', event => {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();
  openAccountMenu(accountArea, event.key === 'ArrowUp');
});
accountMenu.addEventListener('click', event => {
  const action = event.target.closest('[data-account-action]')?.dataset.accountAction;
  if (!action) return;
  closeAccountMenu(true);
  if (action === 'profile') openAccountProfileDialog();
  else if (action === 'account') openAccountUsageDialog();
  else if (action === 'models') openAccountModelsDialog();
  else if (action === 'logout') openLogoutDialog();
});
accountMenu.addEventListener('keydown', event => {
  if (event.key === 'Tab') { closeAccountMenu(true); return; }
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const items = [...accountMenu.querySelectorAll('[role="menuitem"]')];
  const index = items.indexOf(document.activeElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[next].focus();
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || accountMenu.hidden) return;
  event.preventDefault();
  closeAccountMenu(true);
});
document.addEventListener('pointerdown', event => {
  if (!accountMenu.hidden && !accountMenu.contains(event.target) && !accountArea.contains(event.target)) closeAccountMenu();
});
document.addEventListener('focusin', event => {
  if (!accountMenu.hidden && !accountMenu.contains(event.target) && !accountArea.contains(event.target)) closeAccountMenu();
});
window.addEventListener('resize', () => closeAccountMenu());
collapseButton.addEventListener('click', () => closeAccountMenu());
renderAccountProfile();

function submitComposerTask() {
  const draft = getTaskDraft();
  if (!draft.prompt.trim() || voiceActive || (currentView === 'task' && activeTask?.generating)) return;
  closeComposerPopover();
  const snapshot = JSON.parse(JSON.stringify(draft));
  snapshot.prompt = snapshot.prompt.trim();
  if (currentView === 'task') {
    appendTaskRound(activeTask, snapshot);
    Object.assign(draft, { prompt: '', index: -1 });
    syncTaskDraft();
  } else {
    const person = selectedExecutor();
    const id = `task-${++taskSequence}`;
    activeTask = {
      id, draftId: `draft:${id}`, expert: { ...person }, prompt: snapshot.prompt,
      region: composerRegion.textContent, project: snapshot.project,
      rounds: [], generating: false, deliverables: ['阶段分析结果.md', '任务数据明细.xlsx'],
      changes: initialTaskChanges.map(item => ({ ...item, time: taskTime() }))
    };
    registerRecentTask(activeTask);
    taskDrafts.set(activeTask.draftId, { ...snapshot, prompt: '', index: -1, refs: [...snapshot.refs] });
    setContentView('task');
    appendTaskRound(activeTask, snapshot);
    syncTaskDraft();
    document.querySelector('#taskBack').focus({ preventScroll: true });
  }
  taskComposer.dispatchEvent(new CustomEvent('tasksubmit', { bubbles: true, detail: {
    taskId: activeTask.id, profileId: activeTask.expert.id, prompt: snapshot.prompt,
    model: snapshot.model, project: snapshot.project, region: activeTask.region,
    stationScope: '全部场站', references: snapshot.refs, demo: true
  } }));
}
composerSend.addEventListener('click', () => {
  if (currentView === 'task' && activeTask?.generating) stopTaskGeneration();
  else submitComposerTask();
});
regionSelector.addEventListener('regionchange', event => {
  const scope = currentView === 'task' && activeTask ? activeTask.region : event.detail.name;
  composerRegion.textContent = scope;
  composerRegion.title = scope;
});

/* 专家 · 技能：独立目录页，任务入口复用当前输入框和每个执行对象的草稿。 */
const capabilitiesView = document.querySelector('#capabilitiesView');
const capabilitiesNav = document.querySelector('#capabilitiesNav');
const capabilityBack = document.querySelector('#capabilityBack');
const capabilitySearch = document.querySelector('#capabilitySearch');
const capabilitySearchClear = document.querySelector('#capabilitySearchClear');
const capabilityGrid = document.querySelector('#capabilityGrid');
const capabilityTabs = [...document.querySelectorAll('[data-cap-tab]')];
const capabilityScenes = [...document.querySelectorAll('[data-cap-scene]')];
const capabilityState = { type: 'expert', scene: 'all', query: '' };
const capabilityTypeNames = { expert: '专家', team: '专家团', skill: '技能' };

// 主视觉复用目录的专家 / 技能图标与配色，环绕运动由 CSS 完成。
const capabilityHero = document.querySelector('.capability-hero');
const capabilityHeroItems = [...capabilityCatalog, ...capabilityCatalog];
document.querySelector('#capabilityOrbit').innerHTML = capabilityHeroItems.map((item, index) => {
  return `<span class="capability-orbit-spoke" style="--orbit-angle:${index * 360 / capabilityHeroItems.length}deg;--avatar-bg:${avatarColors[item.color][0]}"><span class="capability-orbit-counter"><span class="capability-orbit-icon">${iconMarkup(item.icon)}</span></span></span>`;
}).join('');
let capabilityHeroInView = false;
function updateCapabilityHeroMotion() {
  capabilityHero.classList.toggle('is-motion-paused', document.hidden || capabilitiesView.hidden || !capabilityHeroInView);
}
const capabilityHeroObserver = new IntersectionObserver(([entry]) => {
  capabilityHeroInView = entry.isIntersecting;
  updateCapabilityHeroMotion();
}, { root: contentScroll });
capabilityHeroObserver.observe(capabilityHero);
document.addEventListener('visibilitychange', updateCapabilityHeroMotion);
updateCapabilityHeroMotion();

function setContentView(view) {
  stopVoiceDemo(false);
  closeComposerPopover();
  closeRegionPopover();
  if (currentView === 'task' && view !== 'task') stopTaskSpeech();
  currentView = view;
  const detail = view === 'task';
  const work = view === 'todos';
  todosView.hidden = !work;
  mainContent.classList.toggle('is-todos', work);
  todosNav.classList.toggle('is-active', work);
  if (work) todosNav.setAttribute('aria-current', 'page');
  else todosNav.removeAttribute('aria-current');
  todosNav.querySelector('use').setAttribute('href', iconUrl(work ? 'todo-filled' : 'todo'));
  taskDetailHeader.hidden = !detail;
  taskDetailView.hidden = !detail;
  mainContent.classList.toggle('is-task', detail);
  document.querySelector('#taskComposerTitle').innerHTML = iconMarkup('welcome-stars-filled') + (detail ? '继续描述你的需求' : '描述你的任务需求');
  taskPrompt.placeholder = detail ? '继续追问，或补充你的要求…' : `例如：${profileDetails[selection.expert].tasks[0].prompt}`;
  if (detail) {
    taskDetailTitle.textContent = activeTask.prompt;
    taskDetailTitle.title = activeTask.prompt;
    composerRegion.textContent = activeTask.region;
  } else {
    composerRegion.textContent = selectedArea.name;
  }
  composerRegion.title = composerRegion.textContent;
  const directory = view === 'capabilities';
  capabilitiesView.hidden = !directory;
  mainContent.classList.toggle('is-capabilities', directory);
  updateCapabilityHeroMotion();
  document.querySelector('.welcome-hero').hidden = directory || detail || work;
  businessContent.hidden = directory || detail || work;
  taskComposer.hidden = directory || work;
  capabilityBack.hidden = directory || detail || work || !launchedFromCapabilities;
  capabilitiesNav.classList.toggle('is-active', directory);
  if (directory) capabilitiesNav.setAttribute('aria-current', 'page');
  else capabilitiesNav.removeAttribute('aria-current');
  capabilitiesNav.querySelector('use').setAttribute('href', iconUrl(directory ? 'capabilities-filled' : 'capabilities'));
  peopleList.querySelectorAll('[data-person]').forEach(row => {
    const selected = !directory && !work && row.dataset.person === selection.expert;
    row.classList.toggle('is-active', selected);
    if (selected) row.setAttribute('aria-current', 'page');
    else row.removeAttribute('aria-current');
  });
  if (directory) mainContent.setAttribute('aria-label', '专家·技能内容区');
  else if (detail) mainContent.setAttribute('aria-label', '任务详情');
  else if (work) mainContent.setAttribute('aria-label', '我的待办内容区');
  if (!directory && !work) syncTaskDraft();
  contentScroll.scrollTop = 0;
}

function renderCapabilities() {
  const typeName = capabilityTypeNames[capabilityState.type];
  const query = capabilityState.query.trim().toLocaleLowerCase();
  const list = capabilityCatalog.filter(item => item.type === capabilityState.type
    && (capabilityState.scene === 'all' || item.scene === capabilityState.scene)
    && (!query || [item.name, item.description, item.scene, ...(item.tags || [])].join(' ').toLocaleLowerCase().includes(query)));
  capabilityTabs.forEach(tab => {
    const selected = tab.dataset.capTab === capabilityState.type;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected) document.querySelector('#capabilityResults').setAttribute('aria-labelledby', tab.id);
  });
  capabilityScenes.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.capScene === capabilityState.scene));
    button.querySelector('.capability-scene-count').textContent = capabilityCatalog.filter(item => item.type === capabilityState.type && (button.dataset.capScene === 'all' || item.scene === button.dataset.capScene)).length;
  });
  capabilitySearch.placeholder = capabilityState.type === 'skill' ? '搜索技能或场景' : `搜索${typeName}、标签或场景`;
  capabilitySearch.setAttribute('aria-label', `搜索${typeName}`);
  capabilitySearchClear.hidden = !capabilityState.query;
  document.querySelector('#capabilityResultsTitle').textContent = query ? '搜索结果' : `${capabilityState.scene === 'all' ? '全部' : capabilityState.scene + ' · '}${typeName}`;
  document.querySelector('#capabilityResultCount').textContent = `共 ${list.length} ${capabilityState.type === 'expert' ? '位专家' : capabilityState.type === 'team' ? '个专家团' : '项技能'}`;
  capabilityGrid.innerHTML = list.map(item => `<article class="capability-card${item.type === 'skill' ? ' is-skill' : ''}" aria-labelledby="cap-title-${item.id}">
    <div class="capability-card-head">
      <span class="capability-avatar" style="--avatar-bg:${avatarColors[item.color][0]}" aria-hidden="true">${iconMarkup(item.icon)}</span>
      <div><h3 id="cap-title-${item.id}">${escapeHtml(item.name)}</h3><span class="capability-card-scene">${escapeHtml(item.scene)}</span></div>
    </div>
    <p class="capability-card-description">${escapeHtml(item.description)}</p>
    ${item.tags ? `<ul class="capability-tags" aria-label="${escapeHtml(item.name)}标签">${item.tags.map(tag => `<li>${escapeHtml(tag)}</li>`).join('')}</ul>` : ''}
    <div class="capability-card-footer">
      <div class="capability-card-meta">${item.usage ? `<span>累计使用 <b>${escapeHtml(item.usage)}</b> 次</span>` : `<span>${iconMarkup('capabilities-filled')}可直接调用</span>`}</div>
      <button type="button" class="capability-use${item.authorized ? '' : ' is-locked'}" data-use-capability="${item.id}" aria-label="${item.authorized ? '使用' : '无权限：'}${escapeHtml(item.name)}">${item.authorized ? `使用${iconMarkup('task-arrow')}` : `${iconMarkup('capability-lock')}无权限`}</button>
    </div>
  </article>`).join('');
  capabilityGrid.hidden = !list.length;
  document.querySelector('#capabilityEmpty').hidden = Boolean(list.length);
}

function showCapabilities(reset = false) {
  if (reset) {
    capabilityState.scene = 'all';
    capabilityState.query = '';
    capabilitySearch.value = '';
  }
  setContentView('capabilities');
  renderCapabilities();
}

function selectCapabilityType(type) {
  capabilityState.type = type;
  capabilityState.scene = 'all';
  capabilityState.query = '';
  capabilitySearch.value = '';
  renderCapabilities();
}
capabilitiesNav.addEventListener('click', () => showCapabilities(true));
capabilityBack.addEventListener('click', () => showCapabilities());
capabilityTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCapabilityType(tab.dataset.capTab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? capabilityTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + capabilityTabs.length) % capabilityTabs.length;
    selectCapabilityType(capabilityTabs[next].dataset.capTab);
    capabilityTabs[next].focus();
  });
});
capabilityScenes.forEach(button => button.addEventListener('click', () => {
  capabilityState.scene = button.dataset.capScene;
  renderCapabilities();
}));
capabilitySearch.addEventListener('input', () => {
  capabilityState.query = capabilitySearch.value;
  renderCapabilities();
});
capabilitySearchClear.addEventListener('click', () => {
  capabilitySearch.value = '';
  capabilityState.query = '';
  renderCapabilities();
  capabilitySearch.focus();
});
document.querySelector('#capabilityReset').addEventListener('click', () => {
  capabilityState.scene = 'all';
  capabilityState.query = '';
  capabilitySearch.value = '';
  renderCapabilities();
  capabilitySearch.focus();
});
capabilityGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-use-capability]');
  if (!button) return;
  const item = capabilityCatalog.find(candidate => candidate.id === button.dataset.useCapability);
  if (!item || !item.authorized) {
    if (item) notifyComposer(`当前账号暂无「${item.name}」使用权限，请联系管理员开通`);
    return;
  }
  if (item.profileId) selection.expert = item.profileId;
  launchedFromCapabilities = true;
  selectGroup('expert');
  setContentView('expert');
  updateNav();
  if (item.type === 'skill') addComposerReference({ label: item.name, meta: item.scene, icon: item.icon, kind: 'skill' });
  taskPrompt.focus({ preventScroll: true });
  taskDraftStatus.textContent = item.type === 'skill' ? `已添加 ${item.name}，请描述任务需求。` : `已选择 ${item.name}，请描述任务需求。`;
});

/* v5 任务详情：本地对话演示，复用主输入框，不调用业务系统或模型接口。 */
const taskDetailHeader = document.querySelector('#taskDetailHeader');
const taskDetailTitle = document.querySelector('#taskDetailTitle');
const taskDetailView = document.querySelector('#taskDetailView');
const taskConversation = document.querySelector('#taskConversation');
const taskDrawer = document.querySelector('#taskDrawer');
const taskDrawerTitle = document.querySelector('#taskDrawerTitle');
const taskDrawerBody = document.querySelector('#taskDrawerBody');
const taskDrawerBack = document.querySelector('#taskDrawerBack');
let speakingRound = null;
const initialTaskChanges = [
  { title: '任务范围确认', text: '根据当前公司与项目上下文确认分析范围。' },
  { title: '能力路由调整', text: '根据任务意图选择当前专家及相关技能。' },
  { title: '分析步骤更新', text: '补充交叉验证步骤，避免仅依据单一指标判断。' },
  { title: '交付格式优化', text: '增加结构化结果与可查看产物，便于后续复用。' },
  { title: '上下文同步', text: '将当前任务结果同步到本次对话上下文。' }
];
const taskResultTemplates = {
  vehicle: {
    title: '爱车信息核对',
    description: '可以帮你查询车型和认证状态，也可以整理车型更正申请所需的信息。',
    conclusion: '当前页面尚未连接车辆信息服务，暂时不能查询真实车辆，也不会提交更正申请。下面列出了办理时需要核对的信息。',
    columns: ['想办理的事', '需要的信息', '可以核对什么'],
    rows: [['查询爱车', '车牌号或车架号（VIN）任选一种', '品牌、车型及系统识别出的可能车型'], ['核对认证', '对应车辆的认证记录', '认证状态与认证车型是否一致'], ['申请更正', '车辆信息及你确认的正确车型', '整理更正申请，提交后等待审核']],
    nextSteps: ['查询时可使用车牌号或车架号（VIN），两者任选一种。', '如果车型不一致，先核对正确的品牌与车型，再发起更正申请。', '提交更正申请后需等待审核，通过后再更新车型。']
  },
  ops: {
    title: '任务分析结果',
    description: '已结合当前业务范围、历史数据与相关能力完成第一轮分析，并将结论整理为可继续追问和执行的任务结果。',
    conclusion: '已识别充电量趋势及重点波动时段，并完成经营、用户与设备等因素的第一轮交叉验证，正在汇总结论与建议。',
    columns: ['日期', '充电量', '较基线', '备注'],
    rows: [['8月19日', '14,820 度', '-4.1%', '工作日稳定'], ['8月20日', '14,560 度', '-5.8%', '午间略低于基线'], ['8月21日', '14,230 度', '-8.2%', '晚高峰波动明显']]
  },
  device: {
    title: '设备异常诊断结果',
    description: '已完成设备状态、故障记录和历史工单的关联分析，重点关注重复故障、持续离线和可能影响经营的高风险终端。',
    conclusion: '已完成设备状态和历史工单的第一轮比对，发现高频离线与重复故障终端，当前正在验证主要故障链路并形成处置建议。',
    columns: ['设备 / 终端', '异常现象', '当前状态'],
    rows: [['终端 A-07', '高频离线，24小时内重复掉线 6 次', '待现场核查'], ['终端 B-12', '故障码重复出现，已关联历史工单', '执行中'], ['终端 C-03', '功率异常偏低，疑似模块问题', '待进一步诊断']]
  },
  price: {
    title: '价格与收益分析结果',
    description: '已完成当前价格、竞品水平与历史量价关系对比，并识别具备调整空间的重点时段。',
    conclusion: '已完成竞品价格与历史量价关系分析，识别出重点调价时段，当前正在测算调价空间和收益影响。',
    columns: ['时段', '当前服务费', '竞品均值', '建议动作'],
    rows: [['周五 18:00至22:00', '0.36 元/度', '0.39 元/度', '具备上调空间'], ['周六 全天', '0.36 元/度', '0.40 元/度', '建议小幅上调'], ['周日 全天', '0.36 元/度', '0.40 元/度', '建议保持与周六一致']]
  },
  user: {
    title: '用户运营分析结果',
    description: '已完成人群分层、活跃度与价值度分析，并识别需要优先干预的转化与召回机会。',
    conclusion: '已识别重点用户分层，并完成活跃度、价值度与价格敏感度的第一轮分析，正在整理对应运营动作。',
    columns: ['用户分层', '规模', '特征', '建议动作'],
    rows: [['高价值流失用户', '126 人', '近30天未复充，历史贡献高', '优先召回'], ['沉睡用户', '382 人', '近60天无活跃，价格敏感', '优惠券唤醒'], ['新用户待转化', '214 人', '完成首充但未形成复充', '复充激励']]
  }
};
const taskNextSteps = [
  '优先处理影响范围大、可快速验证的关键问题。',
  '需要执行生产系统写操作时，继续沿用权限校验与人工确认机制。',
  '任务结果可继续追问，也可通过下方“查看产物 / 查看变更”核对交付内容。'
];
function taskTime() { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }); }
function resultForTask(task) {
  if (task.expert.id === 'vehicle_expert') return taskResultTemplates.vehicle;
  const text = task.prompt;
  let kind = /设备|离线|故障/.test(text) ? 'device' : /调价|价格/.test(text) ? 'price' : /用户|召回|复充|沉睡/.test(text) ? 'user' : 'ops';
  if (kind === 'ops') {
    const name = task.expert.name;
    if (/设备|故障/.test(name)) kind = 'device';
    else if (/价格/.test(name)) kind = 'price';
    else if (/用户/.test(name)) kind = 'user';
  }
  return taskResultTemplates[kind];
}
function taskTable(result) {
  return `<div class="task-table-scroll" tabindex="0" role="region" aria-label="${escapeHtml(result.title)}数据表"><table class="task-result-table"><thead><tr>${result.columns.map(cell => `<th scope="col">${escapeHtml(cell)}</th>`).join('')}</tr></thead><tbody>${result.rows.map(row => `<tr>${row.map(cell => `<td${/^-[\d.]+%$/.test(cell) ? ' class="is-negative"' : ''}>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function isExecutionRequest(prompt) {
  return !/不要|暂不|先不|仅分析|只分析|只提供|不执行/.test(prompt) && /执行调价|执行方案|下发策略|发放优惠券|写入系统|确认执行|直接执行|批量重启/.test(prompt);
}
function appendTaskRound(task, snapshot) {
  recordExpertQuestion(task.expert.id);
  // 新追问取代尚未批准的旧方案，避免旧审批按钮仍可执行。
  task.rounds.forEach(round => { if (round.state === 'waiting') round.state = 'superseded'; });
  const round = {
    id: `${task.id}-round-${task.rounds.length + 1}`, prompt: snapshot.prompt,
    refs: snapshot.refs.map(ref => ({ ...ref })), model: models.find(model => model.id === snapshot.model)?.label || snapshot.model,
    project: snapshot.project, time: taskTime(), state: 'generating', feedback: null, version: 1,
    followup: task.rounds.length > 0, result: resultForTask(task)
  };
  task.rounds.push(round);
  if (round.followup) task.changes.push({ title: '补充任务要求', text: snapshot.prompt, time: round.time });
  generateTaskRound(task, round);
}
function generateTaskRound(task, round) {
  clearTimeout(round.generationTimer);
  task.generating = true;
  round.state = 'generating';
  renderTaskConversation(true);
  updateComposerControls();
  touchRecentTask(task);
  const generationVersion = round.version;
  round.generationTimer = setTimeout(() => {
    if (round.version !== generationVersion || round.state !== 'generating') return;
    round.generationTimer = null;
    round.state = isExecutionRequest(round.prompt) && round === task.rounds.at(-1) ? 'waiting' : 'completed';
    round.time = taskTime();
    task.generating = false;
    touchRecentTask(task);
    if (activeTask === task && currentView === 'task') {
      const nearBottom = contentScroll.scrollHeight - contentScroll.scrollTop - contentScroll.clientHeight < 140;
      renderTaskConversation(nearBottom && task.rounds.length > 1);
      updateComposerControls();
      taskDraftStatus.textContent = round.state === 'waiting' ? '方案已生成，等待你的确认。' : '本轮分析已完成，可以继续追问。';
    }
  }, 2400);
}
function stopTaskGeneration() {
  const task = activeTask;
  if (currentView !== 'task' || !task?.generating) return;
  const round = task.rounds.find(item => item.state === 'generating');
  if (!round) return;
  clearTimeout(round.generationTimer);
  round.generationTimer = null;
  round.state = 'stopped';
  round.time = taskTime();
  task.generating = false;
  touchRecentTask(task);
  task.changes.push({ title: '停止生成', text: `已停止第 ${task.rounds.indexOf(round) + 1} 轮回复。`, time: round.time });
  renderTaskConversation();
  updateComposerControls();
  taskDraftStatus.textContent = '已停止生成，可以重新生成或继续追问。';
  taskPrompt.focus({ preventScroll: true });
}
function taskAnswerBody(round, fullReport = false) {
  if (round.followup && !fullReport) return '<p class="task-followup-note">已收到补充要求，我会沿用当前任务上下文继续处理，并在现有结果基础上补充分析。</p>';
  const result = round.result;
  return `${round.followup ? '<p class="task-followup-note">已收到补充要求，我会沿用当前任务上下文继续处理，并在现有结果基础上补充分析。</p>' : ''}
    <h2>${escapeHtml(result.title)}</h2><p class="task-answer-description">${escapeHtml(result.description)}</p>
    <div class="task-key-conclusion"><span>${iconMarkup('welcome-stars-filled')}当前结论</span><p>${escapeHtml(result.conclusion)}</p></div>
    ${taskTable(result)}<h3>下一步建议</h3><ul>${(result.nextSteps || taskNextSteps).map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul>`;
}
function taskApproval(round) {
  if (round.state === 'waiting') return `<section class="task-approval"><div><b>需要你的确认</b><p>方案涉及业务变更，请确认后继续。</p></div><div class="task-approval-actions"><button type="button" data-task-action="adjust">调整方案</button><button type="button" class="primary" data-task-action="approve">批准并继续</button></div></section>`;
  if (round.state === 'approved') return '<p class="task-approval-result">方案已确认。</p>';
  if (round.state === 'superseded') return '<p class="task-approval-result">已收到调整要求，原方案不再等待确认。</p>';
  return '';
}
function taskAction(action, icon, label, extra = '') {
  return `<button type="button" class="task-icon-action" data-task-action="${action}" title="${label}" aria-label="${label}" ${extra}>${iconMarkup(icon)}</button>`;
}
function renderTaskConversation(scrollToEnd = false) {
  if (!activeTask || currentView !== 'task') return;
  const person = activeTask.expert;
  taskConversation.innerHTML = activeTask.rounds.map(round => {
    const generating = round.state === 'generating';
    const stopped = round.state === 'stopped';
    const status = generating ? '正在分析' : stopped ? '已停止生成' : round.state === 'waiting' ? '待确认' : '本轮完成';
    return `<section class="task-round" data-round-id="${round.id}" aria-label="第 ${activeTask.rounds.indexOf(round) + 1} 轮对话">
      <div class="task-user-message"><p>${escapeHtml(round.prompt)}</p>${round.refs.length ? `<div class="task-message-refs">${round.refs.map(ref => `<span>${iconMarkup(ref.icon)}${escapeHtml(ref.label)}</span>`).join('')}</div>` : ''}</div>
      <article class="task-ai-message" aria-busy="${generating}">
        <header class="task-answer-heading"><span class="task-expert-avatar" style="--avatar-bg:${avatarColors[person.color][0]}">${iconMarkup(`${person.icon}-filled`)}</span><b>${escapeHtml(person.name)}</b><span class="task-round-status${generating ? ' is-generating' : ''}${round.state === 'waiting' ? ' is-waiting' : ''}">${generating ? '<i></i>' : ''}${status}</span></header>
        <div class="task-answer-content">${generating ? '<div class="task-thinking" role="status"><span></span><span></span><span></span><p>正在梳理任务信息与分析结果…</p></div>' : stopped ? `<p class="task-followup-note">你可以重新生成，或补充需求后继续发送。</p><div class="task-result-links"><button type="button" data-task-action="regenerate" ${activeTask.generating ? 'disabled' : ''}>${iconMarkup('task-regenerate')}重新生成</button></div>` : `${taskAnswerBody(round)}${taskApproval(round)}
          <div class="task-result-links"><button type="button" data-task-action="reply">${iconMarkup('task-reply')}回复</button><button type="button" data-task-action="artifacts">${iconMarkup('composer-file')}查看所有产物 <span>${activeTask.deliverables.length}</span></button><button type="button" data-task-action="changes">${iconMarkup('composer-settings')}查看所有变更 <span>${activeTask.changes.length}</span></button></div>
          <footer class="task-answer-footer"><div class="task-answer-actions">${taskAction('copy','task-copy','复制回复')}${taskAction('like','task-like','点赞', `aria-pressed="${round.feedback === 'like'}"`)}${taskAction('dislike','task-dislike','点踩', `aria-pressed="${round.feedback === 'dislike'}"`)}${taskAction('speak',speakingRound === round.id ? 'task-stop' : 'task-volume',speakingRound === round.id ? '停止朗读' : '朗读回复', `aria-pressed="${speakingRound === round.id}"`)}${taskAction('regenerate','task-regenerate','重新生成', activeTask.generating ? 'disabled' : '')}</div><span class="task-answer-meta">${escapeHtml(round.model)}<span>·</span>Token 1,280<span>·</span>${round.time}${round.version > 1 ? `<span>·</span>第 ${round.version} 版` : ''}</span></footer>`}</div>
      </article></section>`;
  }).join('');
  if (scrollToEnd) requestAnimationFrame(() => { contentScroll.scrollTop = contentScroll.scrollHeight; });
}
function taskAnswerText(round) {
  if (round.followup) return '已收到补充要求，我会沿用当前任务上下文继续处理，并在现有结果基础上补充分析。';
  return [round.result.title, round.result.description, '当前结论', round.result.conclusion, round.result.columns.join(' | '), ...round.result.rows.map(row => row.join(' | ')), '下一步建议', ...(round.result.nextSteps || taskNextSteps)].join('\n\n');
}
function stopTaskSpeech() {
  const wasSpeaking = speakingRound !== null;
  speakingRound = null;
  if (wasSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}
function speakTaskRound(round) {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { notifyComposer('当前浏览器暂不支持朗读'); return; }
  const shouldStop = speakingRound === round.id;
  stopTaskSpeech();
  if (shouldStop) { renderTaskConversation(); return; }
  const utterance = new SpeechSynthesisUtterance(taskAnswerText(round));
  utterance.lang = 'zh-CN'; utterance.rate = 1;
  speakingRound = round.id;
  const finish = event => {
    if (speakingRound !== round.id) return;
    speakingRound = null; renderTaskConversation();
    if (event.type === 'error') notifyComposer('朗读暂不可用，请检查浏览器语音支持');
  };
  utterance.onend = finish; utterance.onerror = finish;
  window.speechSynthesis.speak(utterance);
  renderTaskConversation();
}
function latestTaskResult() { return [...activeTask.rounds].reverse().find(round => !['generating', 'stopped'].includes(round.state)); }
let taskDrawerOpenFrame = 0;
let taskDrawerCloseTimer = null;
function openTaskDrawer() {
  if (taskDrawer.open && !taskDrawer.classList.contains('is-closing')) return;
  clearTimeout(taskDrawerCloseTimer);
  cancelAnimationFrame(taskDrawerOpenFrame);
  taskDrawer.classList.remove('is-closing');
  if (!taskDrawer.open) {
    taskDrawer.classList.remove('is-visible');
    taskDrawer.showModal();
    // 先建立位于右侧屏幕外的初始状态，再过渡到可见位置。
    void taskDrawer.offsetWidth;
  }
  taskDrawerOpenFrame = requestAnimationFrame(() => {
    taskDrawer.classList.add('is-visible');
    taskDrawerOpenFrame = 0;
  });
}
function finishTaskDrawerClose() {
  if (!taskDrawer.classList.contains('is-closing')) return;
  clearTimeout(taskDrawerCloseTimer);
  taskDrawer.close();
  taskDrawer.classList.remove('is-visible', 'is-closing');
}
function closeTaskDrawer() {
  if (!taskDrawer.open || taskDrawer.classList.contains('is-closing')) return;
  cancelAnimationFrame(taskDrawerOpenFrame);
  taskDrawerOpenFrame = 0;
  taskDrawer.classList.add('is-closing');
  taskDrawer.classList.remove('is-visible');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishTaskDrawerClose();
    return;
  }
  // 等滑出结束再关闭原生 dialog，保留遮罩和焦点约束；定时器兜底。
  taskDrawerCloseTimer = setTimeout(finishTaskDrawerClose, 280);
}
taskDrawer.addEventListener('transitionend', event => {
  if (event.target === taskDrawer && event.propertyName === 'transform') finishTaskDrawerClose();
});
taskDrawer.addEventListener('cancel', event => {
  event.preventDefault();
  closeTaskDrawer();
});
function showTaskDrawer(type) {
  workDrawerContext = null;
  closeComposerPopover();
  taskDrawerBack.hidden = true;
  if (type === 'artifacts') {
    taskDrawerTitle.textContent = '任务产物';
    taskDrawerBody.innerHTML = `<p class="task-drawer-note">共 ${activeTask.deliverables.length} 项 · 随当前任务更新</p><div class="task-artifact-list">${activeTask.deliverables.map((name, index) => `<button type="button" class="task-artifact" data-artifact-index="${index}"><span class="task-file-icon">${iconMarkup(index ? 'benefit-chart' : 'composer-file')}</span><span><b>${escapeHtml(name)}</b><small>${index ? '结构化数据 · 表格预览' : '分析结论与建议 · 报告预览'}</small></span><span class="task-artifact-open">查看 ${iconMarkup('task-arrow')}</span></button>`).join('')}</div>`;
  } else {
    taskDrawerTitle.textContent = '任务变更';
    taskDrawerBody.innerHTML = `<p class="task-drawer-note">共 ${activeTask.changes.length} 项变更 · 按发生顺序展示</p><ol class="task-change-list">${activeTask.changes.map(item => `<li><div><b>${escapeHtml(item.title)}</b><time>${item.time}</time></div><p>${escapeHtml(item.text)}</p></li>`).join('')}</ol>`;
  }
  openTaskDrawer();
}
function showTaskArtifact(index) {
  const round = latestTaskResult();
  if (!round) { notifyComposer('当前还没有生成结果'); return; }
  taskDrawerTitle.textContent = activeTask.deliverables[index];
  taskDrawerBack.hidden = false;
  taskDrawerBody.innerHTML = `<p class="task-drawer-note">${escapeHtml(activeTask.region)}${activeTask.project ? ' · ' + escapeHtml(activeTask.project) : ''}</p><div class="task-artifact-preview">${index ? taskTable(round.result) : taskAnswerBody(round, true)}</div>`;
  taskDrawerBody.scrollTop = 0;
  taskDrawerBack.focus();
}
taskConversation.addEventListener('click', async event => {
  const button = event.target.closest('[data-task-action]');
  if (!button) return;
  const round = activeTask.rounds.find(item => item.id === button.closest('[data-round-id]').dataset.roundId);
  if (!round) return;
  const action = button.dataset.taskAction;
  if (action === 'reply') { taskPrompt.focus({ preventScroll: true }); return; }
  if (action === 'artifacts' || action === 'changes') { showTaskDrawer(action); return; }
  if (action === 'copy') {
    try { await navigator.clipboard.writeText(taskAnswerText(round)); notifyComposer('回复已复制'); }
    catch { notifyComposer('暂时无法复制，请选中文字手动复制'); }
  } else if (action === 'like' || action === 'dislike') {
    round.feedback = round.feedback === action ? null : action;
    renderTaskConversation();
    taskConversation.querySelector(`[data-round-id="${round.id}"] [data-task-action="${action}"]`)?.focus({ preventScroll: true });
  } else if (action === 'speak') speakTaskRound(round);
  else if (action === 'regenerate' && !activeTask.generating) {
    stopTaskSpeech(); round.version++; round.feedback = null;
    activeTask.changes.push({ title: '重新生成分析', text: `已重新生成第 ${activeTask.rounds.indexOf(round) + 1} 轮回复，保留原任务上下文。`, time: taskTime() });
    generateTaskRound(activeTask, round);
  } else if (action === 'adjust' && round.state === 'waiting') {
    const draft = getTaskDraft();
    draft.prompt = '请调整当前方案，先不要执行生产系统写操作。';
    draft.index = -1; syncTaskDraft(); taskPrompt.focus({ preventScroll: true });
  } else if (action === 'approve' && round.state === 'waiting') {
    round.state = 'approved';
    activeTask.changes.push({ title: '方案确认', text: '已确认当前方案。', time: taskTime() });
    touchRecentTask(activeTask);
    renderTaskConversation(); notifyComposer('方案已确认');
  }
});
function returnFromTask(fresh = false) {
  if (!activeTask) return;
  selection.expert = activeTask.expert.id;
  selectGroup('expert');
  if (fresh) {
    const draft = getTaskDraft(selection.expert);
    taskDrafts.set(selection.expert, { prompt: '', index: -1, refs: [], model: draft.model, project: null });
  }
  setContentView('expert'); updateNav();
  taskPrompt.focus({ preventScroll: true });
}
document.querySelector('#taskBack').addEventListener('click', () => returnFromTask());
document.querySelector('#taskNew').addEventListener('click', () => returnFromTask(true));
document.querySelector('#taskDrawerClose').addEventListener('click', closeTaskDrawer);
taskDrawerBack.addEventListener('click', () => showTaskDrawer('artifacts'));
taskDrawer.addEventListener('click', event => {
  if (taskDrawer.classList.contains('is-closing')) return;
  const artifact = event.target.closest('[data-artifact-index]');
  if (artifact) { showTaskArtifact(Number(artifact.dataset.artifactIndex)); return; }
  if (event.target !== taskDrawer) return;
  const rect = taskDrawer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeTaskDrawer();
});
window.addEventListener('pagehide', stopTaskSpeech);

/* 我的待办：v5 的审批事项、定时任务与运行记录，所有操作仅在本页演示。 */
const todosView = document.querySelector('#todosView');
const todosNav = document.querySelector('#todosNav');
const workState = { tab: 'todo', todoTab: 'pending', scheduleTab: 'list', query: '', type: 'all', sort: 'newest' };
let workDrawerContext = null;
const seedNow = Date.now();
const todoItems = [
  { id: 'WF-20260825-0186', title: '济钢充电站周末调价方案审批', type: '调价审批', from: '智慧价格专家', time: '8分钟前', updatedAt: seedNow - 8 * 60000, description: '服务费建议上调 0.03 元/度，生效范围：济钢充电站。', status: '待处理', actionable: true, views: ['pending'] },
  { id: 'WF-20260825-0179', title: 'PLUS会员召回活动预算审批', type: '营销审批', from: '用户运营专家', time: '16分钟前', updatedAt: seedNow - 16 * 60000, description: '拟向 286 名高价值 PLUS 会员发放 5 元充电券，预计预算 1,430 元。', status: '待处理', actionable: true, views: ['pending', 'initiated'], initiatedTitle: '济钢站用户召回活动', initiatedDescription: '等待公司负责人审批活动预算。' },
  { id: 'WF-20260825-0164', title: '设备异常工单升级确认', type: '工单审批', from: '设备运维工作流', time: '31分钟前', updatedAt: seedNow - 31 * 60000, description: '3 台终端连续故障，建议升级为紧急工单并派发区域运维。', status: '待处理', actionable: true, views: ['pending', 'received'] },
  { id: 'WF-20260824-0392', title: '青岛公司高峰调价方案', type: '调价审批', from: '智慧价格专家', time: '昨天 17:42', updatedAt: seedNow - 86400000, description: '已批准并进入运营平台执行流程。', status: '已批准', views: ['processed'] },
  { id: 'WF-20260824-0321', title: '设备巡检工单批量创建', type: '工单审批', from: '设备运维专家团', time: '昨天 15:16', updatedAt: seedNow - 87000000, description: '已确认创建 18 条设备巡检工单。', status: '已处理', views: ['processed'] },
  { id: 'WF-20260825-0201', title: '济南公司本周经营复盘审批', type: '经营审批', from: '我发起', time: '4分钟前', updatedAt: seedNow - 4 * 60000, description: '提交经营复盘结论与下周重点动作等待区域负责人确认。', status: '审批中', views: ['initiated'] },
  { id: 'WF-20260825-0152', title: '经营周报发布确认', type: '报告确认', from: '经营报表Skill', time: '1小时前', updatedAt: seedNow - 3600000, description: '周报已生成，发布前需要确认。', status: '待确认', views: ['received'] }
];
const todoVisuals = {
  '调价审批': ['price-filled', 'violet'], '营销审批': ['promotion-filled', 'orange'],
  '工单审批': ['maintenance-filled', 'teal'], '经营审批': ['analysis-filled', 'blue'], '报告确认': ['todo-filled', 'blue']
};
function workStatus(status) {
  const tone = /批准|已处理|成功|已启用/.test(status) ? 'success' : /驳回|失败/.test(status) ? 'danger' : /待|审批中|修改/.test(status) ? 'pending' : /运行中/.test(status) ? 'running' : 'neutral';
  return `<span class="work-status ${tone}"><i aria-hidden="true"></i>${escapeHtml(status)}</span>`;
}
function workEmpty(message, resetAction = '') {
  return `<div class="work-empty">${iconMarkup('composer-file')}<b>${escapeHtml(message)}</b><p>${resetAction ? '试试其他关键词或筛选条件。' : '新的事项会显示在这里。'}</p>${resetAction ? `<button type="button" class="work-button" data-work-reset="${resetAction}">重置筛选</button>` : ''}</div>`;
}
function todoDisplay(item) {
  const initiated = workState.todoTab === 'initiated';
  return { ...item, title: initiated && item.initiatedTitle ? item.initiatedTitle : item.title, from: initiated ? '我发起' : item.from, description: initiated && !item.decision && item.initiatedDescription ? item.initiatedDescription : item.description, status: initiated && !item.decision && item.status === '待处理' ? '审批中' : item.status };
}
function renderTodos() {
  const count = todoItems.filter(item => item.actionable).length;
  const badge = document.querySelector('#todoNavCount');
  badge.textContent = count; badge.hidden = count === 0;
  todosNav.setAttribute('aria-label', `我的待办，${count} 项`);
  document.querySelector('#todoPendingCount').textContent = count;
  const q = workState.query.trim().toLocaleLowerCase();
  const rows = todoItems.filter(item => item.views.includes(workState.todoTab)).map(todoDisplay).filter(item =>
    (workState.type === 'all' || item.type === workState.type) && (!q || [item.title, item.id, item.from].join(' ').toLocaleLowerCase().includes(q))
  ).sort((a, b) => workState.sort === 'newest' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt);
  document.querySelector('#todoSearchClear').hidden = !workState.query;
  document.querySelector('#todoList').innerHTML = rows.length ? rows.map(item => {
    const [icon, color] = todoVisuals[item.type];
    return `<article class="todo-card" aria-label="${escapeHtml(item.title)}"><span class="todo-category-icon" style="--avatar-bg:${avatarColors[color][0]}">${iconMarkup(icon)}</span><div class="todo-card-content"><div class="todo-title-row"><h2>${escapeHtml(item.title)}</h2><span class="todo-type">${item.type}</span></div><p class="todo-description">${escapeHtml(item.description)}</p><div class="todo-meta"><span class="todo-id">${item.id}</span><span>发起：${escapeHtml(item.from)}</span><span>${iconMarkup('clock')}${item.time}</span></div><div class="todo-card-actions">${!item.actionable || workState.todoTab === 'initiated' ? workStatus(item.status) : ''}<button type="button" class="work-button" data-todo-view="${item.id}">查看</button>${item.actionable && workState.todoTab !== 'initiated' ? `<button type="button" class="work-button primary" data-todo-process="${item.id}">处理</button>` : ''}</div></div></article>`;
  }).join('') : workEmpty(q || workState.type !== 'all' ? '没有找到相关待办' : workState.todoTab === 'pending' ? '待办已全部处理' : '暂无相关事项', q || workState.type !== 'all' ? 'todo' : '');
  document.querySelector('#todoListSummary').textContent = `共 ${rows.length} 项`;
}
function openTodoDetail(id) {
  const item = todoItems.find(item => item.id === id); if (!item) return;
  workDrawerContext = { type: 'todo', id };
  taskDrawerBack.hidden = true;
  taskDrawerTitle.textContent = '待办详情';
  taskDrawerBody.innerHTML = `<div class="work-detail-heading">${workStatus(item.status)}<span class="todo-type">${item.type}</span></div><h3 class="work-detail-title">${escapeHtml(item.title)}</h3><dl class="work-detail-meta"><div><dt>流程单号</dt><dd>${item.id}</dd></div><div><dt>发起来源</dt><dd>${escapeHtml(item.from)}</dd></div><div><dt>更新时间</dt><dd>${item.time}</dd></div><div><dt>业务来源</dt><dd>运营平台工作流</dd></div></dl><section class="work-detail-section"><h3>事项说明</h3><p>${escapeHtml(item.description)}</p></section>${item.decision ? `<section class="work-detail-section"><h3>处理结果</h3><p>${escapeHtml(item.status)}</p><p class="work-detail-opinion">${escapeHtml(item.opinion || '未填写处理意见')}</p></section>` : ''}${item.actionable ? `<div class="work-detail-actions"><button type="button" class="work-button primary" data-todo-process="${item.id}">处理审批</button></div>` : ''}`;
  taskDrawerBody.scrollTop = 0; openTaskDrawer();
}
function openTodoApproval(id) {
  const item = todoItems.find(item => item.id === id); if (!item?.actionable) return;
  openComposerDialog('处理审批', `<form id="todoApprovalForm" class="work-form" data-id="${item.id}"><div class="work-form-context"><span class="todo-type">${item.type}</span><b>${escapeHtml(item.title)}</b><p>${escapeHtml(item.description)}</p><small>${item.id}</small></div><fieldset class="work-decision"><legend>处理结果</legend>${['批准', '驳回', '退回修改'].map((value, i) => `<label><input type="radio" name="decision" value="${value}" ${!i ? 'checked' : ''}><span>${value}</span></label>`).join('')}</fieldset><label><span>处理意见<small class="work-optional">选填</small></span><textarea name="opinion" placeholder="请输入处理意见" maxlength="500" rows="4"></textarea></label></form>`, '<button type="button" data-dialog-action="close">取消</button><button type="submit" form="todoApprovalForm" class="primary">提交结果</button>');
}
function selectWorkTab(tab) {
  workState.tab = tab;
  document.querySelectorAll('[data-work-tab]').forEach(button => {
    const active = button.dataset.workTab === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#todoWorkPanel').hidden = tab !== 'todo';
  document.querySelector('#scheduleWorkPanel').hidden = tab !== 'schedule';
  if (tab === 'todo') renderTodos(); else { renderSchedules(); renderRuns(); }
}
function bindWorkTabs(selector, dataKey, change) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => change(button.dataset[dataKey]));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      change(buttons[next].dataset[dataKey]); buttons[next].focus();
    });
  });
}
bindWorkTabs('[data-work-tab]', 'workTab', selectWorkTab);
bindWorkTabs('[data-todo-tab]', 'todoTab', tab => {
  workState.todoTab = tab;
  document.querySelectorAll('[data-todo-tab]').forEach(button => {
    const active = button.dataset.todoTab === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
    if (active) document.querySelector('#todoListPanel').setAttribute('aria-labelledby', button.id);
  });
  renderTodos();
});
bindWorkTabs('[data-schedule-tab]', 'scheduleTab', tab => {
  workState.scheduleTab = tab;
  document.querySelectorAll('[data-schedule-tab]').forEach(button => { const active = button.dataset.scheduleTab === tab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
  document.querySelector('#schedulePanel').hidden = tab !== 'list'; document.querySelector('#runsPanel').hidden = tab !== 'runs';
  renderSchedules(); renderRuns();
});
todosNav.addEventListener('click', () => { setContentView('todos'); selectWorkTab(workState.tab); });
document.querySelector('#todoSearch').addEventListener('input', event => { workState.query = event.target.value; renderTodos(); });
document.querySelector('#todoSearchClear').addEventListener('click', () => { workState.query = ''; document.querySelector('#todoSearch').value = ''; renderTodos(); document.querySelector('#todoSearch').focus(); });
document.querySelector('#todoTypeFilter').addEventListener('change', event => { workState.type = event.target.value; renderTodos(); });
document.querySelector('#todoSort').addEventListener('change', event => { workState.sort = event.target.value; renderTodos(); });

let workSequence = 0;
const schedules = [
  { id: 'schedule-1', name: '每日经营晨报', prompt: '生成每日经营晨报，汇总充电量、收入和异常站点。', cadence: 'daily', time: '08:30', project: '济南公司智慧运营', status: 'on', last: '今日 08:30' },
  { id: 'schedule-2', name: '每周运营复盘', prompt: '生成每周运营复盘，分析经营变化并提出下一周的重点动作。', cadence: 'weekly', weekday: 1, time: '09:00', project: '济南公司智慧运营', status: 'on', last: '昨日 09:00' },
  { id: 'schedule-3', name: '设备离线巡检', prompt: '检查设备离线情况，汇总异常终端并给出处置建议。', cadence: 'daily', time: '10:00', project: '设备健康专项', status: 'pause', last: '昨日 10:00' },
  { id: 'schedule-4', name: '月度经营报告', prompt: '生成月度经营报告，包含经营指标、异常归因和改进建议。', cadence: 'monthly', monthday: 1, time: '08:00', project: '济南公司智慧运营', status: 'on', last: '本月1日 08:00' }
];
function localDateText(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function seedRunDate(days, time) { const date = new Date(); date.setDate(date.getDate() - days); const [h, m] = time.split(':').map(Number); date.setHours(h, m, 0, 0); return date.getTime(); }
const runRecords = [
  { id: 'run-1', scheduleId: 'schedule-1', name: '每日经营晨报', status: 'done', trigger: '定时触发', at: seedRunDate(0, '08:30'), deliver: '经营日报.pdf' },
  { id: 'run-2', scheduleId: 'schedule-2', name: '每周运营复盘', status: 'done', trigger: '定时触发', at: seedRunDate(1, '09:00'), deliver: '运营复盘.md' },
  { id: 'run-3', scheduleId: 'schedule-3', name: '设备离线巡检', status: 'fail', trigger: '手动执行', at: seedRunDate(1, '10:06'), deliver: '部分数据读取失败' },
  { id: 'run-4', scheduleId: 'schedule-4', name: '月度经营报告', status: 'done', trigger: '定时触发', at: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 8).getTime(), deliver: '经营月报.pdf' }
];
function scheduleRule(item) {
  return (item.cadence === 'weekly' ? `每周${'日一二三四五六'[item.weekday]}` : item.cadence === 'monthly' ? `每月${item.monthday}日` : '每天') + ` ${item.time}`;
}
function nextScheduleDate(item) {
  const now = new Date(), next = new Date(now), [hours, minutes] = item.time.split(':').map(Number);
  next.setHours(hours, minutes, 0, 0);
  if (item.cadence === 'weekly') { next.setDate(next.getDate() + (item.weekday - next.getDay() + 7) % 7); if (next <= now) next.setDate(next.getDate() + 7); }
  else if (item.cadence === 'monthly') {
    const dateInMonth = month => new Date(now.getFullYear(), month, Math.min(item.monthday, new Date(now.getFullYear(), month + 1, 0).getDate()), hours, minutes);
    return dateInMonth(now.getMonth()) > now ? dateInMonth(now.getMonth()) : dateInMonth(now.getMonth() + 1);
  } else if (next <= now) next.setDate(next.getDate() + 1);
  return next;
}
function workDateTime(value) { const date = new Date(value); return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`; }
function renderSchedules() {
  const q = document.querySelector('#scheduleSearch').value.trim().toLowerCase(), status = document.querySelector('#scheduleStatusFilter').value, project = document.querySelector('#scheduleProjectFilter').value;
  const rows = schedules.filter(item => (!q || item.name.toLowerCase().includes(q)) && (status === 'all' || item.status === status) && (project === 'all' || item.project === project));
  document.querySelector('#scheduleCount').textContent = `共 ${rows.length} 个任务`;
  document.querySelector('#scheduleRows').innerHTML = rows.length ? rows.map(item => `<tr><td><div class="work-table-name"><span class="work-schedule-icon">${iconMarkup('calendar-filled')}</span><div><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.project || '未归属项目')}</small></div></div></td><td>${scheduleRule(item)}</td><td>${item.status === 'pause' ? '<span class="work-muted">—</span>' : workDateTime(nextScheduleDate(item))}</td><td>${workStatus(item.status === 'on' ? '已启用' : '已暂停')}</td><td>${escapeHtml(item.last)}</td><td><div class="work-row-actions"><button type="button" class="primary" data-schedule-action="run" data-id="${item.id}" ${item.running ? 'disabled' : ''}>${item.running ? '执行中' : '立即执行'}</button><button type="button" data-schedule-action="toggle" data-id="${item.id}">${item.status === 'on' ? '暂停' : '启用'}</button><button type="button" class="danger" data-schedule-action="delete" data-id="${item.id}">删除</button></div></td></tr>`).join('') : `<tr><td colspan="6">${workEmpty('没有找到相关定时任务', q || status !== 'all' || project !== 'all' ? 'schedule' : '')}</td></tr>`;
}
function renderRuns() {
  const q = document.querySelector('#runSearch').value.trim().toLowerCase(), status = document.querySelector('#runStatusFilter').value, time = document.querySelector('#runTimeFilter').value;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const cutoff = time === 'today' ? today.getTime() : ['7', '30'].includes(time) ? today.getTime() - (Number(time) - 1) * 86400000 : 0;
  const rows = runRecords.filter(item => (!q || `${item.name} ${localDateText(new Date(item.at))}`.toLowerCase().includes(q)) && (status === 'all' || item.status === status) && item.at >= cutoff).sort((a, b) => b.at - a.at);
  document.querySelector('#runCount').textContent = `共 ${rows.length} 条记录`;
  document.querySelector('#runRows').innerHTML = rows.length ? rows.map(item => `<tr><td><div class="work-table-name"><span class="work-schedule-icon record">${iconMarkup('composer-file')}</span><div><b>${escapeHtml(item.name)} · ${localDateText(new Date(item.at))}</b><small>${escapeHtml(item.deliver)}</small></div></div></td><td>${workStatus(item.status === 'done' ? '成功' : item.status === 'fail' ? '失败' : '运行中')}</td><td>${item.trigger}</td><td>${workDateTime(item.at)}</td><td><div class="work-row-actions"><button type="button" class="primary" data-run-action="view" data-id="${item.id}">查看详情</button><button type="button" class="danger" data-run-action="delete" data-id="${item.id}" ${item.status === 'running' ? 'disabled title="执行结束后可删除"' : ''}>删除</button></div></td></tr>`).join('') : `<tr><td colspan="5">${workEmpty('没有找到相关运行记录', q || status !== 'all' || time !== 'all' ? 'runs' : '')}</td></tr>`;
}
function openRunDetail(id) {
  const item = runRecords.find(item => item.id === id); if (!item) return;
  workDrawerContext = { type: 'run', id }; taskDrawerBack.hidden = true; taskDrawerTitle.textContent = '运行详情';
  const status = item.status === 'done' ? '成功' : item.status === 'fail' ? '失败' : '运行中';
  taskDrawerBody.innerHTML = `<div class="work-detail-heading">${workStatus(status)}</div><h3 class="work-detail-title">${escapeHtml(item.name)}</h3><dl class="work-detail-meta"><div><dt>触发方式</dt><dd>${item.trigger}</dd></div><div><dt>执行时间</dt><dd>${workDateTime(item.at)}</dd></div><div class="full-width"><dt>执行结果</dt><dd>${escapeHtml(item.deliver)}</dd></div></dl><section class="work-detail-section"><h3>交付物 / 日志</h3><p>${item.status === 'fail' ? '部分设备数据读取失败，可重新执行或检查连接器。' : item.status === 'running' ? '任务正在执行，完成后将在这里更新运行结果。' : '任务执行完成，交付物已归档。'}</p>${item.status === 'done' ? `<div class="work-delivery">${iconMarkup('composer-file')}<span>${escapeHtml(item.deliver)}</span><small>已归档</small></div>` : ''}</section>`;
  taskDrawerBody.scrollTop = 0; openTaskDrawer();
}
function openScheduleForm() {
  openComposerDialog('添加定时任务', `<form id="workScheduleForm" class="work-form"><label>任务名称<input name="name" placeholder="例如：每日经营晨报" required maxlength="50"></label><label>任务指令<textarea name="prompt" placeholder="描述需要 TeldHub 定时完成的任务" required maxlength="2000" rows="3"></textarea></label><div class="work-form-grid"><label>执行周期<select name="preset"><option value="daily">每天 08:30</option><option value="weekly">每周一 09:00</option><option value="monthly">每月1日 08:00</option><option value="custom">自定义</option></select></label><label>所属项目<select name="project"><option value="">无</option><option>济南公司智慧运营</option><option>设备健康专项</option></select></label></div><div class="work-custom-period" id="workCustomPeriod" hidden><div class="work-form-grid"><label>重复频率<select name="cadence" disabled><option value="daily">每天</option><option value="weekly">每周</option><option value="monthly">每月</option></select></label><label>执行时间<input name="time" type="time" value="08:30" disabled></label><label id="workWeekdayField" hidden>执行日<select name="weekday" disabled>${[1, 2, 3, 4, 5, 6, 0].map(day => `<option value="${day}">星期${'日一二三四五六'[day]}</option>`).join('')}</select></label><label id="workMonthdayField" hidden>每月几号<input name="monthday" type="number" min="1" max="31" value="1" disabled></label></div><p>按当前设备时区执行；当月没有对应日期时取当月最后一天。</p></div></form>`, '<button type="button" data-dialog-action="close">取消</button><button type="submit" form="workScheduleForm" class="primary">创建</button>');
}
function runSchedule(id) {
  const item = schedules.find(item => item.id === id); if (!item || item.running) return;
  item.running = true; item.last = '执行中';
  const run = { id: `manual-run-${++workSequence}`, scheduleId: id, name: item.name, status: 'running', trigger: '手动执行', at: Date.now(), deliver: '执行中' };
  runRecords.unshift(run); renderSchedules(); renderRuns(); notifyComposer('任务已开始，可在运行记录中查看');
  setTimeout(() => {
    item.running = false; item.last = '刚刚'; run.status = 'done'; run.deliver = `${item.name}.md`;
    renderSchedules(); renderRuns();
    if (taskDrawer.open && !taskDrawer.classList.contains('is-closing') && workDrawerContext?.type === 'run' && workDrawerContext.id === run.id) openRunDetail(run.id);
  }, 1400);
}
function confirmWorkDelete(kind, id) {
  const item = (kind === 'schedule' ? schedules : runRecords).find(item => item.id === id); if (!item || (kind === 'run' && item.status === 'running')) return;
  openComposerDialog(kind === 'schedule' ? '删除定时任务' : '删除运行记录', `<form id="workDeleteForm" data-kind="${kind}" data-id="${id}"><p class="work-delete-title">${escapeHtml(item.name)}</p><p class="composer-dialog-note">${kind === 'schedule' ? '删除后将移除该计划，历史运行记录仍会保留。' : '删除后，该条记录将从运行记录列表移除。'}</p></form>`, '<button type="button" data-dialog-action="close">取消</button><button type="submit" form="workDeleteForm" class="work-delete-confirm">删除</button>');
}
composerDialog.addEventListener('input', event => {
  if (event.target.closest('#workScheduleForm')) event.target.setCustomValidity?.('');
});
composerDialog.addEventListener('change', event => {
  const form = event.target.closest('#workScheduleForm'); if (!form) return;
  const custom = form.elements.preset.value === 'custom';
  form.querySelector('#workCustomPeriod').hidden = !custom;
  form.elements.time.required = custom;
  form.elements.time.disabled = !custom;
  form.elements.cadence.disabled = !custom;
  form.elements.weekday.disabled = !custom || form.elements.cadence.value !== 'weekly';
  form.elements.monthday.disabled = !custom || form.elements.cadence.value !== 'monthly';
  form.elements.monthday.required = custom && form.elements.cadence.value === 'monthly';
  form.querySelector('#workWeekdayField').hidden = form.elements.cadence.value !== 'weekly';
  form.querySelector('#workMonthdayField').hidden = form.elements.cadence.value !== 'monthly';
});
composerDialog.addEventListener('submit', event => {
  const form = event.target;
  if (!['todoApprovalForm', 'workScheduleForm', 'workDeleteForm'].includes(form.id)) return;
  event.preventDefault();
  if (form.id === 'todoApprovalForm') {
    const item = todoItems.find(item => item.id === form.dataset.id); if (!item?.actionable) return;
    const data = new FormData(form); item.decision = data.get('decision'); item.opinion = String(data.get('opinion') || '').trim();
    item.status = { '批准': '已批准', '驳回': '已驳回', '退回修改': '退回修改' }[item.decision];
    item.actionable = false; item.views = [...new Set([...item.views.filter(view => view !== 'pending'), 'processed'])]; item.time = '刚刚'; item.updatedAt = Date.now();
    closeComposerDialog(); renderTodos();
    if (taskDrawer.open && workDrawerContext?.type === 'todo' && workDrawerContext.id === item.id) openTodoDetail(item.id);
    notifyComposer(`已${item.decision === '退回修改' ? '退回修改' : item.decision}，处理结果已保存`);
  } else if (form.id === 'workScheduleForm') {
    const data = new FormData(form), name = String(data.get('name')).trim(), prompt = String(data.get('prompt')).trim();
    if (!name || !prompt) { const field = !name ? form.elements.name : form.elements.prompt; field.setCustomValidity(!name ? '请输入任务名称' : '请输入任务指令'); field.reportValidity(); return; }
    const preset = data.get('preset'), cadence = preset === 'custom' ? data.get('cadence') : preset;
    schedules.unshift({ id: `created-schedule-${++workSequence}`, name, prompt, project: String(data.get('project')), cadence, time: preset === 'custom' ? data.get('time') : preset === 'weekly' ? '09:00' : preset === 'monthly' ? '08:00' : '08:30', weekday: preset === 'custom' ? Number(data.get('weekday')) : 1, monthday: preset === 'custom' ? Number(data.get('monthday')) : 1, status: 'on', last: '尚未执行' });
    closeComposerDialog(); resetWorkFilters('schedule'); renderSchedules(); notifyComposer('定时任务已创建');
  } else {
    const list = form.dataset.kind === 'schedule' ? schedules : runRecords, index = list.findIndex(item => item.id === form.dataset.id);
    if (index >= 0) list.splice(index, 1);
    closeComposerDialog(); renderSchedules(); renderRuns(); notifyComposer('已删除');
  }
});
function resetWorkFilters(kind) {
  if (kind === 'todo') {
    workState.query = ''; workState.type = 'all'; workState.sort = 'newest';
    document.querySelector('#todoSearch').value = ''; document.querySelector('#todoTypeFilter').value = 'all'; document.querySelector('#todoSort').value = 'newest'; renderTodos();
  } else if (kind === 'schedule') {
    document.querySelector('#scheduleSearch').value = ''; document.querySelector('#scheduleStatusFilter').value = 'all'; document.querySelector('#scheduleProjectFilter').value = 'all'; renderSchedules();
  } else {
    document.querySelector('#runSearch').value = ''; document.querySelector('#runStatusFilter').value = 'all'; document.querySelector('#runTimeFilter').value = 'all'; renderRuns();
  }
}
function handleWorkClick(event) {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.todoView) openTodoDetail(button.dataset.todoView);
  else if (button.dataset.todoProcess) openTodoApproval(button.dataset.todoProcess);
  else if (button.dataset.workReset) resetWorkFilters(button.dataset.workReset);
  else if (button.dataset.scheduleAction) {
    const item = schedules.find(item => item.id === button.dataset.id); if (!item) return;
    if (button.dataset.scheduleAction === 'run') runSchedule(item.id);
    else if (button.dataset.scheduleAction === 'delete') confirmWorkDelete('schedule', item.id);
    else { item.status = item.status === 'on' ? 'pause' : 'on'; renderSchedules(); }
  } else if (button.dataset.runAction === 'view') openRunDetail(button.dataset.id);
  else if (button.dataset.runAction === 'delete') confirmWorkDelete('run', button.dataset.id);
}
todosView.addEventListener('click', handleWorkClick);
taskDrawerBody.addEventListener('click', handleWorkClick);
document.querySelector('#newScheduleButton').addEventListener('click', openScheduleForm);
['scheduleSearch', 'scheduleStatusFilter', 'scheduleProjectFilter'].forEach(id => document.getElementById(id).addEventListener(id === 'scheduleSearch' ? 'input' : 'change', renderSchedules));
['runSearch', 'runStatusFilter', 'runTimeFilter'].forEach(id => document.getElementById(id).addEventListener(id === 'runSearch' ? 'input' : 'change', renderRuns));
renderTodos(); renderSchedules(); renderRuns();

/* 顶部最近工作、通知、反馈：依据 v5 功能，数据仅保存在当前页面内存。 */
const topbarDrawer = document.querySelector('#topbarDrawer');
const topbarDrawerBody = document.querySelector('#topbarDrawerBody');
const topbarDrawerTitle = document.querySelector('#topbarDrawerTitle');
const topbarDrawerBack = document.querySelector('#topbarDrawerBack');
const topbarActions = {
  recent: document.querySelector('#recentTasksButton'),
  notifications: document.querySelector('#notificationsButton'),
  feedback: document.querySelector('#feedbackButton')
};
const recentState = { tab: 'tasks', tasksQuery: '', artifactsQuery: '', artifact: null };
const recentTaskRecords = new Map();
const feedbackEntries = [];
let topbarPanel = '';
let topbarOpenFrame = 0;
let topbarCloseTimer = null;
let topbarAfterClose = null;
let topbarReturnFocus = null;

const recentTaskSeeds = [
  { id: 'recent-ops', title: '济南公司近7天经营异常分析', expertId: 'ops_expert', state: 'generating', minutes: 3, prompt: '分析济南公司近7天所有场站经营情况，识别异常站点，并给出处理策略。', project: '济南公司智慧运营', files: ['济南公司经营异常分析.xlsx', '经营异常分析报告.md'] },
  { id: 'recent-recall', title: '济钢PLUS会员召回策略', expertId: 'user_expert', state: 'waiting', minutes: 10, prompt: '分析济钢充电站PLUS会员流失情况并生成召回策略。', project: '济南公司智慧运营', files: ['PLUS会员召回名单.xlsx', '召回策略说明.md'] },
  { id: 'recent-morning', title: '每日经营晨报', expertId: 'ops_expert', state: 'completed', minutes: 90, prompt: '生成每日经营晨报，汇总充电量、收入和异常站点。', project: '济南公司智慧运营', files: ['每日经营晨报.md'] },
  { id: 'recent-price', title: '济钢周末热门调价方案', expertId: 'price_expert', state: 'completed', minutes: 1440, prompt: '分析济钢充电站周末热门时段的调价空间并生成方案。', project: '济南公司智慧运营', files: ['周末调价方案.xlsx', '收益测算.md'] },
  { id: 'recent-device', title: '设备故障Top20根因诊断', expertId: 'device_expert', state: 'completed', minutes: 2880, prompt: '分析设备故障Top20并定位主要根因。', project: '设备健康专项', files: ['故障Top20分析.xlsx'] }
];
recentTaskSeeds.forEach(seed => {
  const task = {
    id: seed.id, title: seed.title, draftId: `draft:${seed.id}`, expert: { ...groups.expert.find(item => item.id === seed.expertId) },
    prompt: seed.prompt, region: selectedArea.name, project: seed.project, generating: seed.state === 'generating',
    deliverables: seed.files, updatedAt: Date.now() - seed.minutes * 60000,
    changes: initialTaskChanges.map(item => ({ ...item, time: '08:30' }))
  };
  task.rounds = [{ id: `${task.id}-round-1`, prompt: task.prompt, refs: [], model: 'Auto', project: task.project, time: '08:30', state: seed.state, feedback: null, version: 1, followup: false, result: resultForTask(task) }];
  recentTaskRecords.set(task.id, task);
});
const notificationItems = [
  { id: 'notice-approval', title: '1个任务等待审批', detail: '济钢PLUS会员召回策略', time: '10分钟前', icon: 'clock', kind: 'waiting', taskId: 'recent-recall', read: false },
  { id: 'notice-morning', title: '每日经营晨报已生成', detail: '充电量、收入与异常站点已汇总', time: '今天 08:36', icon: 'selected-check', kind: 'completed', taskId: 'recent-morning', read: false, artifact: 0 }
];
function registerRecentTask(task) {
  task.updatedAt = Date.now();
  recentTaskRecords.set(task.id, task);
}
function touchRecentTask(task) {
  if (!recentTaskRecords.has(task.id)) return;
  task.updatedAt = Date.now();
  if (topbarDrawer.open && topbarPanel === 'recent' && !recentState.artifact) renderRecentList();
}
function recentStatus(task) {
  const state = task.rounds.at(-1)?.state;
  if (task.generating) return { kind: 'running', label: '进行中' };
  if (state === 'waiting') return { kind: 'waiting', label: '待审批' };
  if (state === 'stopped') return { kind: 'stopped', label: '已停止' };
  return { kind: 'completed', label: '已完成' };
}
function recentTime(task) {
  const minutes = Math.max(0, Math.floor((Date.now() - task.updatedAt) / 60000));
  return minutes < 1 ? '刚刚' : minutes < 60 ? `${minutes}分钟前` : minutes < 1440 ? `${Math.floor(minutes / 60)}小时前` : `${Math.floor(minutes / 1440)}天前`;
}
function recentTasksSorted() { return [...recentTaskRecords.values()].sort((a, b) => b.updatedAt - a.updatedAt); }
function recentResult(task) { return [...task.rounds].reverse().find(round => !['generating', 'stopped'].includes(round.state))?.result; }
function recentArtifacts() {
  return recentTasksSorted().flatMap(task => recentResult(task) ? task.deliverables.map((name, index) => ({ task, name, index })) : []);
}
function openTopbarPanel(panel) {
  stopVoiceDemo(false); closeComposerPopover(); closeRegionPopover(); closeAccountMenu();
  clearTimeout(topbarCloseTimer); cancelAnimationFrame(topbarOpenFrame); topbarAfterClose = null;
  topbarPanel = panel; recentState.artifact = null;
  topbarReturnFocus = topbarActions[panel];
  topbarDrawerBack.hidden = true;
  Object.entries(topbarActions).forEach(([key, button]) => button.setAttribute('aria-expanded', String(key === panel)));
  if (panel === 'recent') { recentState.tab = 'tasks'; renderRecentPanel(); }
  else if (panel === 'notifications') renderNotifications();
  else renderFeedback();
  topbarDrawer.classList.remove('is-closing');
  if (!topbarDrawer.open) {
    topbarDrawer.classList.remove('is-visible'); topbarDrawer.showModal(); void topbarDrawer.offsetWidth;
  }
  topbarOpenFrame = requestAnimationFrame(() => { topbarDrawer.classList.add('is-visible'); topbarOpenFrame = 0; });
}
function finishTopbarClose() {
  if (!topbarDrawer.classList.contains('is-closing')) return;
  clearTimeout(topbarCloseTimer);
  const afterClose = topbarAfterClose; topbarAfterClose = null;
  topbarDrawer.close(); topbarDrawer.classList.remove('is-visible', 'is-closing');
  topbarDrawerBody.replaceChildren(); // 联系方式随表单关闭清空，不写入存储或反馈记录。
  Object.values(topbarActions).forEach(button => button.setAttribute('aria-expanded', 'false'));
  topbarReturnFocus?.focus({ preventScroll: true });
  topbarPanel = ''; afterClose?.();
}
function closeTopbarPanel(afterClose = null) {
  if (!topbarDrawer.open) { afterClose?.(); return; }
  if (topbarDrawer.classList.contains('is-closing')) return;
  topbarAfterClose = afterClose;
  cancelAnimationFrame(topbarOpenFrame);
  topbarDrawer.classList.add('is-closing'); topbarDrawer.classList.remove('is-visible');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishTopbarClose();
  else topbarCloseTimer = setTimeout(finishTopbarClose, 280);
}
Object.entries(topbarActions).forEach(([panel, button]) => button.addEventListener('click', () => openTopbarPanel(panel)));
document.querySelector('#topbarDrawerClose').addEventListener('click', () => closeTopbarPanel());
topbarDrawer.addEventListener('cancel', event => { event.preventDefault(); closeTopbarPanel(); });
topbarDrawer.addEventListener('transitionend', event => { if (event.target === topbarDrawer && event.propertyName === 'transform') finishTopbarClose(); });
topbarDrawer.addEventListener('click', event => {
  if (event.target !== topbarDrawer) return;
  const rect = topbarDrawer.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeTopbarPanel();
});
function renderRecentPanel() {
  topbarDrawerTitle.textContent = '最近工作'; topbarDrawerBack.hidden = true; recentState.artifact = null;
  const artifacts = recentState.tab === 'artifacts';
  const query = artifacts ? recentState.artifactsQuery : recentState.tasksQuery;
  topbarDrawerBody.innerHTML = `<div class="utility-tabs" role="tablist" aria-label="最近工作类型"><button type="button" role="tab" id="recentTasksTab" aria-controls="recentResults" aria-selected="${!artifacts}" tabindex="${artifacts ? -1 : 0}" data-recent-tab="tasks">最近任务</button><button type="button" role="tab" id="recentArtifactsTab" aria-controls="recentResults" aria-selected="${artifacts}" tabindex="${artifacts ? 0 : -1}" data-recent-tab="artifacts">最近产物</button></div>
    <div class="utility-search">${iconMarkup('search')}<input type="search" id="recentSearchInput" aria-label="搜索${artifacts ? '最近产物' : '最近任务'}" placeholder="${artifacts ? '搜索文件名称或来源任务' : '搜索任务名称、专家或项目'}" value="${escapeHtml(query)}" autocomplete="off"><button type="button" data-utility-action="clear-search" aria-label="清空搜索" ${query ? '' : 'hidden'}>${iconMarkup('composer-remove')}</button></div>
    <section id="recentResults" role="tabpanel" aria-labelledby="${artifacts ? 'recentArtifactsTab' : 'recentTasksTab'}"></section>`;
  renderRecentList();
}
function renderRecentList() {
  const box = document.querySelector('#recentResults'); if (!box) return;
  const artifacts = recentState.tab === 'artifacts';
  const query = (artifacts ? recentState.artifactsQuery : recentState.tasksQuery).trim().toLocaleLowerCase();
  const list = artifacts ? recentArtifacts().filter(item => `${item.name} ${item.task.title || item.task.prompt}`.toLocaleLowerCase().includes(query)) : recentTasksSorted().filter(task => `${task.title || task.prompt} ${task.prompt} ${task.project || ''} ${task.expert.name}`.toLocaleLowerCase().includes(query));
  if (!list.length) {
    box.innerHTML = `<div class="utility-empty">${iconMarkup(query ? 'search' : artifacts ? 'composer-file' : 'history')}<h3>${query ? '没有找到相关内容' : artifacts ? '还没有可查看的产物' : '还没有任务记录'}</h3><p>${query ? '换个关键词试试，或清空搜索。' : artifacts ? '任务生成的文件会显示在这里。' : '开始一个任务后，可以在这里继续查看。'}</p>${query ? '<button type="button" data-utility-action="clear-search">清空搜索</button>' : ''}</div>`;
    return;
  }
  box.innerHTML = `<div class="recent-work-list">${list.map(item => {
    if (artifacts) {
      const sheet = /\.(xlsx?|csv)$/i.test(item.name);
      return `<button type="button" class="recent-work-row recent-file-row" data-recent-artifact="${item.index}" data-recent-task="${item.task.id}" aria-label="预览 ${escapeHtml(item.name)}"><span class="recent-file-icon${sheet ? ' is-sheet' : ''}">${iconMarkup(sheet ? 'benefit-chart' : 'composer-file')}</span><span class="recent-work-copy"><b>${escapeHtml(item.name)}</b><span>来自：${escapeHtml(item.task.title || item.task.prompt)}</span><small>${recentTime(item.task)} · ${sheet ? '数据表格' : '分析报告'}</small></span><span class="recent-row-chevron">${iconMarkup('chevron-left')}</span></button>`;
    }
    const state = recentStatus(item);
    return `<button type="button" class="recent-work-row" data-open-recent="${item.id}" aria-label="打开任务 ${escapeHtml(item.title || item.prompt)}"><span class="recent-expert-icon" style="--avatar-bg:${avatarColors[item.expert.color][0]}">${iconMarkup(`${item.expert.icon}-filled`)}</span><span class="recent-work-copy"><b>${escapeHtml(item.title || item.prompt)}</b><span>${escapeHtml(item.expert.name)}${item.project ? ' · ' + escapeHtml(item.project) : ''}</span><small>${recentTime(item)}</small></span><span class="recent-status is-${state.kind}"><i></i>${state.label}</span></button>`;
  }).join('')}</div>`;
}
function openRecentTask(id) {
  const task = recentTaskRecords.get(id); if (!task) return;
  closeTopbarPanel(() => {
    stopTaskSpeech(); activeTask = task; selection.expert = task.expert.id; launchedFromCapabilities = false;
    if (!taskDrafts.has(task.draftId)) taskDrafts.set(task.draftId, { prompt: '', index: -1, refs: [], model: 'Auto', project: task.project });
    selectGroup('expert'); setContentView('task'); renderTaskConversation(); syncTaskDraft();
    const pending = task.rounds.find(round => round.state === 'generating');
    if (pending && !pending.generationTimer) generateTaskRound(task, pending);
    document.querySelector('#taskBack').focus({ preventScroll: true });
  });
}
function showRecentArtifact(taskId, index, origin = 'recent') {
  const task = recentTaskRecords.get(taskId); const name = task?.deliverables[index]; const result = task && recentResult(task);
  if (!name || !result) return;
  recentState.artifact = { taskId, index, origin };
  topbarDrawerTitle.textContent = '产物预览'; topbarDrawerBack.hidden = false;
  topbarDrawerBack.setAttribute('aria-label', origin === 'notifications' ? '返回通知' : '返回最近产物');
  const sheet = /\.(xlsx?|csv)$/i.test(name);
  const round = { result, followup: false };
  topbarDrawerBody.innerHTML = `<div class="utility-artifact-heading"><span class="recent-file-icon${sheet ? ' is-sheet' : ''}">${iconMarkup(sheet ? 'benefit-chart' : 'composer-file')}</span><div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(task.expert.name)} · ${recentTime(task)}</p></div></div><button type="button" class="utility-source-task" data-open-recent="${task.id}">来源任务：${escapeHtml(task.title || task.prompt)}${iconMarkup('task-arrow')}</button><div class="utility-artifact-actions"><button type="button" class="utility-primary" data-utility-action="download">${iconMarkup('utility-download')}${sheet ? '导出 CSV' : '下载 Markdown'}</button><button type="button" class="utility-secondary" data-utility-action="cite">引用到新任务</button></div><div class="utility-artifact-preview task-artifact-preview">${sheet ? taskTable(result) : taskAnswerBody(round, true)}</div>`;
  topbarDrawerBody.scrollTop = 0;
}
function downloadRecentArtifact() {
  const artifact = recentState.artifact; if (!artifact) return;
  const task = recentTaskRecords.get(artifact.taskId); const result = recentResult(task); if (!result) return;
  const name = task.deliverables[artifact.index]; const sheet = /\.(xlsx?|csv)$/i.test(name);
  const csvCell = value => `"${String(value).replace(/"/g, '""')}"`;
  const content = sheet ? '\uFEFF' + [result.columns, ...result.rows].map(row => row.map(csvCell).join(',')).join('\r\n') : `# ${result.title}\n\n${result.description}\n\n## 当前结论\n\n${result.conclusion}\n\n| ${result.columns.join(' | ')} |\n| ${result.columns.map(() => '---').join(' | ')} |\n${result.rows.map(row => '| ' + row.join(' | ') + ' |').join('\n')}\n\n## 下一步建议\n\n${(result.nextSteps || taskNextSteps).map(item => '- ' + item).join('\n')}\n`;
  const blob = new Blob([content], { type: sheet ? 'text/csv;charset=utf-8' : 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = name.replace(/\.[^.]+$/, '') + (sheet ? '.csv' : '.md'); link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function citeRecentArtifact() {
  const artifact = recentState.artifact; if (!artifact) return;
  const task = recentTaskRecords.get(artifact.taskId); const name = task.deliverables[artifact.index];
  closeTopbarPanel(() => {
    stopTaskSpeech(); selection.expert = task.expert.id; launchedFromCapabilities = false;
    selectGroup('expert'); setContentView('expert'); updateNav();
    addComposerReference({ label: name, meta: task.title || task.prompt, icon: 'composer-file', kind: 'conversation' });
    taskPrompt.focus({ preventScroll: true });
  });
}
function updateNotificationBadge() {
  const count = notificationItems.filter(item => !item.read).length;
  document.querySelector('#notificationDot').hidden = count === 0;
  topbarActions.notifications.setAttribute('aria-label', count ? `通知，${count}条未读` : '通知');
}
function renderNotifications() {
  topbarDrawerTitle.textContent = '通知'; topbarDrawerBack.hidden = true; recentState.artifact = null;
  const unread = notificationItems.filter(item => !item.read).length;
  topbarDrawerBody.innerHTML = `<div class="notification-toolbar"><span>${unread ? `${unread} 条未读消息` : '所有消息已读'}</span><button type="button" data-utility-action="read-all" ${unread ? '' : 'disabled'}>${iconMarkup('selected-check')}全部已读</button></div><div class="notification-list">${notificationItems.map(item => {
    const waiting = item.kind === 'waiting' && recentStatus(recentTaskRecords.get(item.taskId)).kind === 'waiting';
    const title = item.kind === 'waiting' && !waiting ? '审批任务已处理' : item.title;
    return `<button type="button" class="notification-row${item.read ? '' : ' is-unread'}" data-notification="${item.id}" aria-label="${escapeHtml(title)}，${escapeHtml(item.detail)}${item.read ? '' : '，未读'}"><span class="notification-category is-${waiting ? 'waiting' : 'completed'}">${iconMarkup(waiting ? 'clock' : 'selected-check')}</span><span class="notification-copy"><b>${escapeHtml(title)}${item.read ? '' : '<i aria-label="未读"></i>'}</b><p>${escapeHtml(item.detail)}</p><small>${item.time}${item.artifact !== undefined ? ' · 1个交付物' : ''}</small><span class="notification-open">${waiting ? '查看审批任务' : item.artifact !== undefined ? '查看报告' : '查看任务'}${iconMarkup('chevron-left')}</span></span></button>`;
  }).join('')}</div>`;
}
function renderFeedback() {
  topbarDrawerTitle.textContent = '意见反馈'; topbarDrawerBack.hidden = true;
  const types = ['产品建议', '功能问题', '交互体验', '其他'];
  topbarDrawerBody.innerHTML = `<p class="feedback-intro">哪里不够好用，或希望增加什么功能？告诉我们你的想法。</p><form id="utilityFeedbackForm" class="utility-feedback-form" novalidate><fieldset><legend>反馈类型</legend><div class="feedback-type-options">${types.map((type, index) => `<label><input type="radio" name="feedbackType" value="${type}" ${index === 0 ? 'checked' : ''}><span>${type}</span></label>`).join('')}</div></fieldset><div class="feedback-field"><label for="utilityFeedbackContent">反馈内容<span class="feedback-required">*</span></label><textarea id="utilityFeedbackContent" name="content" maxlength="2000" required aria-describedby="feedbackContentError" placeholder="请描述遇到的问题，或你希望改善的地方…"></textarea><div class="feedback-field-meta"><span id="feedbackContentError" role="alert"></span><span id="feedbackCharCount">0 / 2000</span></div></div><div class="feedback-field"><label for="utilityFeedbackContact">联系方式<span class="work-optional">选填</span></label><input type="text" id="utilityFeedbackContact" name="contact" autocomplete="off" maxlength="100" placeholder="手机号或邮箱，方便进一步沟通"></div><div class="feedback-actions"><button type="submit" class="utility-primary">提交反馈${iconMarkup('task-arrow')}</button></div></form>`;
}
topbarDrawerBody.addEventListener('input', event => {
  if (event.target.id === 'recentSearchInput') {
    recentState[recentState.tab === 'tasks' ? 'tasksQuery' : 'artifactsQuery'] = event.target.value;
    topbarDrawerBody.querySelector('.utility-search button').hidden = !event.target.value;
    renderRecentList();
  }
  if (event.target.id === 'utilityFeedbackContent') {
    document.querySelector('#feedbackCharCount').textContent = `${event.target.value.length} / 2000`;
    if (event.target.value.trim()) {
      event.target.removeAttribute('aria-invalid'); document.querySelector('#feedbackContentError').textContent = '';
    }
  }
});
topbarDrawerBody.addEventListener('submit', event => {
  if (event.target.id !== 'utilityFeedbackForm') return;
  event.preventDefault(); const form = event.target; const content = form.elements.content.value.trim();
  if (!content) {
    document.querySelector('#feedbackContentError').textContent = '请填写反馈内容';
    form.elements.content.setAttribute('aria-invalid', 'true'); form.elements.content.focus(); return;
  }
  // 仅暂存类型和内容；不读取联系方式，也不调用网络或浏览器持久化存储。
  feedbackEntries.push({ type: form.elements.feedbackType.value, content }); form.reset();
  topbarDrawerBody.innerHTML = `<div class="feedback-success" role="status"><span>${iconMarkup('selected-check')}</span><h3>谢谢你的反馈</h3><p>反馈已暂存，感谢你帮助我们改进体验。</p><button type="button" class="utility-primary" data-utility-action="feedback-done">完成</button></div>`;
  topbarDrawerBody.querySelector('button').focus();
});
topbarDrawerBack.addEventListener('click', () => {
  if (recentState.artifact?.origin === 'notifications') renderNotifications();
  else { recentState.tab = 'artifacts'; renderRecentPanel(); }
});
topbarDrawerBody.addEventListener('keydown', event => {
  const tab = event.target.closest('[data-recent-tab]'); if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault(); recentState.tab = event.key === 'Home' ? 'tasks' : event.key === 'End' ? 'artifacts' : recentState.tab === 'tasks' ? 'artifacts' : 'tasks';
  renderRecentPanel(); document.querySelector(`[data-recent-tab="${recentState.tab}"]`).focus();
});
topbarDrawerBody.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button || topbarDrawer.classList.contains('is-closing')) return;
  if (button.dataset.recentTab) { recentState.tab = button.dataset.recentTab; renderRecentPanel(); document.querySelector(`[data-recent-tab="${recentState.tab}"]`).focus(); }
  else if (button.dataset.openRecent) openRecentTask(button.dataset.openRecent);
  else if (button.dataset.recentArtifact !== undefined) showRecentArtifact(button.dataset.recentTask, Number(button.dataset.recentArtifact));
  else if (button.dataset.notification) {
    const item = notificationItems.find(item => item.id === button.dataset.notification); item.read = true; updateNotificationBadge();
    if (item.artifact !== undefined) showRecentArtifact(item.taskId, item.artifact, 'notifications');
    else openRecentTask(item.taskId);
  } else {
    const action = button.dataset.utilityAction;
    if (action === 'clear-search') {
      recentState[recentState.tab === 'tasks' ? 'tasksQuery' : 'artifactsQuery'] = '';
      const input = document.querySelector('#recentSearchInput'); input.value = '';
      topbarDrawerBody.querySelector('.utility-search button').hidden = true; renderRecentList(); input.focus();
    } else if (action === 'download') downloadRecentArtifact();
    else if (action === 'cite') citeRecentArtifact();
    else if (action === 'read-all') { notificationItems.forEach(item => { item.read = true; }); updateNotificationBadge(); renderNotifications(); }
    else if (action === 'feedback-done') closeTopbarPanel();
  }
});
document.addEventListener('keydown', event => {
  if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k' || document.querySelector('dialog[open]')) return;
  event.preventDefault(); recentState.tab = 'tasks'; openTopbarPanel('recent'); document.querySelector('#recentSearchInput').focus();
});
updateNotificationBadge();

renderCapabilities();
renderPeople();
updateNav();
