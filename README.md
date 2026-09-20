# AI Hub · 高保真 Demo

**[在线预览](https://wangyekai918-star.github.io/AI_Hub/)** · [GitHub 仓库](https://github.com/wangyekai918-star/AI_Hub) · [图标库（Yesicon / Solar 中文版）](https://yesicon.app/zh-Hans/solar)

纯静态前端交互 Demo，使用示例数据；AI 回复、语音录入、模型连接与任务执行未接入真实业务服务。

当前最新产品原型为 **`TeldHub_最终版本_v5.html`**，后续业务内容与交互以此版本为准。顶部品牌使用用户提供的 **AIHubLOGO.svg**，项目目录为 **AI Hub**。视觉沿用 AI 管家的基础样式及用户已确认的 AI Hub 调整，独立于原项目维护。

## 原型参考版本

- 最新原型：`TeldHub_最终版本_v5.html`（仅作本地需求参考，不随仓库发布），于 2026-09-20 确认为后续参考基准。
- v5 主要更新了专家 / 专家团能力卡与使用入口、新建任务的执行对象展示，以及任务详情的对话式结构和相关交互。后续实现对应模块时，以 v5 的实际内容与行为核对需求。
- 基础页面基于 v2 及用户逐轮确认的设计搭建；专家介绍区的介绍、能力点和任务文案已同步 v5 原文，其他模块尚未全面同步 v5。
- 原型用于确定业务内容、功能与状态，视觉和布局继续遵循已确认的高保真方案；不直接照搬原型样式。

## 本轮内容

- 顶部导航横向通栏，包含完整 Logo、区域选择、最近任务、通知、反馈。Logo 固定显示在左上角；桌面展开侧栏时，区域选择与下方卡片左边缘对齐。
- 左侧区域从顶部导航下方延伸到底部，紧贴左侧、无外边距、无圆角，依次为我的待办、专家·技能、专属专家 / 我的员工、示例账户。主导航“我的待办”“专家·技能”的默认文字和图标颜色为 `#111827`，选中态保留主题紫。
- 保留原型的 4 位专属专家、8 位数字员工与示例最后使用日期；默认选中经营分析专家。
- 列表每项左侧为 Icon，右侧独立文字区：名称在上，“最后使用09-07”在下；两行左对齐、间距 0，统一应用于所有专家和员工，Icon 与整个文字区垂直居中。列表项四边内边距均为 8px，高度随内容撑开，不设额外最小高度。
- 右侧顶部欢迎区：左侧品牌、主标题与说明，右侧透明背景的 3D 机器人；直接铺在页面底色上，与下方白色业务容器平级。
- 下方白色区域为专家介绍卡片：对应专家图标与简短介绍、不可点击的利益点、可点击的任务胶囊，以及右侧 16:9 视频封面。`#mainContent` 是右侧整体区域。

已实现：侧栏折叠 / 展开、分组切换、四位专家选中态、列表内部滚动、分组键盘切换、区域选择浮层、专家资料联动、任务输入框演示交互，以及专家·技能目录与使用流程。

“专属专家”的四位专家保留原介绍页；“专家·技能”进入独立目录页，从目录使用专家团时复用任务页面，更新为专家团的介绍、能力与案例。“我的待办”进入独立待办与定时任务页面；八位员工条目仍仅展示外观，不复用专家页面。“我的员工”分组仅切换侧栏名单，不改变右侧内容。

侧栏展开 / 收起使用 280ms 缓动：侧栏与内容区同步改变宽度，顶部 Logo 和区域选择保持稳定，文字淡入淡出，图标位置和箭头旋转平滑过渡。快速反向操作直接接续当前状态；首次加载和响应式自动切换不播放动画，系统开启“减少动态效果”时关闭过渡。原有 8px 内边距、6px 列表间距和 36px 图标容器保持不变。折叠按钮位于侧栏右侧的垂直中心，点击区域为 20 × 48px，外层容器使用 999px 胶囊圆角，箭头保持 14px；展开、收起时均居中。

最近任务、通知、反馈仍仅展示外观，没有接入业务页面或提交操作。底部账户支持个人信息、账户管理和模型管理，见下方说明。

## 顶部欢迎区

- 按用户最新参考图采用三层文案：顶部紫色小标题 `AI 驱动 · 专家随行 · 让充电运营更简单`；中间主标题 `TeldHub, 你的经营分析超级助手`，品牌文字与右侧文案使用相同的深黑色，统一 44px，品牌后使用英文逗号加一个空格，不额外设置水平间距；底部说明 `连接数据 · 洞察业务 · 释放增长潜力`，分隔点左右间距各 4px，使用正常字间距。
- 主标题随左侧选中项更新：去掉专家名称末尾的“专家”，例如“经营分析专家”对应“你的经营分析超级助手”，“智慧价格专家”对应“你的智慧价格超级助手”。只由四位专家的选中状态更新；侧栏分组切换不改变右侧欢迎文案。
- 顶部小标题使用随文字宽度自适应的纯白胶囊，内边距上下及左侧 4px、右侧 12px，无描边和投影；左侧增加 28px 紫色渐变圆形星芒徽标，内部 18px Solar 填充星芒，与文案间距 8px。小标题与主标题、主标题与说明之间的间距均为 8px。TeldHub 品牌文字下方保留蓝紫渐变弧形笔触（#5552FF → #8C52FF），SVG 二次贝塞尔弧线、6.5px 描边和圆润端点，显示高度 16px、宽度跟随品牌文字；相对上一版下移 4px（bottom 为 -7px）；标题背后补充局部淡紫光晕，加强左侧视觉分量。装饰均不接受点击、不增加额外文案。
- 欢迎区没有白色填充、描边、投影或卡片圆角；背景由主标题后的柔白补光、中部淡紫光晕（中心不透明度 7%、过渡处 3%）、机器人后的淡青蓝光晕组成，叠加一层很淡的斜向柔光；所有装饰光层均添加横向与纵向相交的渐隐遮罩（左右 24–72px 自适应、顶部 24px、底部 32px），并限制在自身区域内，使光色在滚动容器边界前归零；正文和图标不参与遮罩。以静态 CSS 渐变实现。下方白色业务容器是独立兄弟节点，间距 12px。
- 桌面欢迎区最小高度 244px、左右内边距 32px，小标题 16px、主标题 44px、说明 16px；右侧为 502px 的气泡与机器人区域，高度 250px，整体向左偏移 20px，使用独立两列布局、固定 12px 间距，插画显示尺寸 250 × 250px，保持原图比例与气泡可用宽度，不与气泡重叠。内容宽度不超过 1100px 时右侧区域收至 390px、插画 176px，820px 以下放到欢迎文案下方并取消横向偏移、插画 180px，600px 以下隐藏装饰插画、保留可点击的完整宽度气泡。主标题保持 44px，侧栏宽度变化时自动适配。
- 气泡采用 `#FFFFFF 70%` 填充、1px `#FFFFFF` 描边，无投影，16px 圆角；文字和图标保持不透明，悬停时填充不变；“试试问我”标题 14px、字重 600，与前方填充星星及右侧箭头统一使用主题紫 `#5552FF`，正文 15px、字重 600。右侧尾巴使用更圆润的尖角，尖端采用 3px 半径圆弧，保持 12×18px 尺寸，向外 12px，与主体共用 70% 纯白填充与 1px 纯白外轮廓，连接处不叠色、不留竖向描边，保留与机器人之间的空间。
- 机器人旁增加“试试问我”案例气泡，文案直接复用当前专家的 6 个任务案例，每 6 秒循环切换，切换专家后从新专家的第一条开始。气泡正文 15px / 22px、字重 600，使用轻微淡入，保留稳定的内容高度。点击气泡与点击下方案例共用 `fillExpertTask()`：填入当前专家的输入框、同步案例选中态、聚焦底部输入框，保留上方页面滚动位置，不自动开始任务。
- 鼠标悬停或键盘聚焦气泡时暂停轮播，离开后重新计时；页面进入后台或气泡滚出可视区域时暂停。机器人用 4.8 秒循环、向上 8px 的轻微漂浮动画，动画不改变页面布局。系统启用“减少动态效果”时关闭漂浮和自动轮播，气泡仍可点击填入。
- 插画通过用户指定的 Codex 网关生图方式生成，文件为 `assets/welcome-robot.png`，1254 × 1254px、RGBA 透明背景。图片仅用于装饰；界面文案均保留为可编辑的 HTML 文字。

<details>
<summary>机器人插画生成提示词</summary>

```text
Use case: stylized-concept. Asset type: a single high fidelity 3D illustration for the right side of a professional AI assistant web dashboard welcome area. Create an original friendly small floating robot with a large rounded white ceramic head, a dark navy glossy face screen, two cyan oval glowing eyes and a tiny cyan smile, subtle violet side ear pieces, a short antenna with a cyan tip, compact white rounded body and small floating feet. The robot faces slightly left toward the page text, one arm extended toward one small translucent glass analytics panel on its left; panel contains only a simple bar chart and small circular chart, no words. One delicate cyan orbit arc gently wraps around the lower body. Restrained premium soft 3D product illustration, white porcelain and pale lavender accents, brand accent violet #5552FF, subtle cyan lights, soft studio illumination, smooth clean surfaces. Composition: the entire robot and panel centered in a square canvas, full body entirely visible, generous 10 percent safe margin all around, compact balanced silhouette, no cropping. Background must be truly transparent with alpha, no checkerboard drawn, no colored rectangular backdrop, no card, no floor, no strong cast shadow. No text, letters, numbers, logos, badges, watermark, extra characters or decorative clutter. This is an isolated reusable illustration asset, not a screenshot or page mockup.
```

</details>

## 专家 · 技能目录

- 点击左侧“专家·技能”进入独立目录页。只从 v5 读取功能、业务文案和示例状态，视觉使用当前 AI Hub 的 `#5552FF` 主题色、`#EDF1FC` 底色、16px 白色卡片及本地 Solar SVG。
- 目录布局参考[千问 AI 平台技能市场](https://www.qianwenai.com/hub/skills)：整个右侧内容区为纯白底、16px 圆角，与左侧导航并排通栏；目录卡片使用常驻的 1px 浅灰描边，无悬停变色描边或投影。内部左右间距 24px，窄屏缩为 16px。桌面保留 156px 场景分类栏，显示当前类型下各场景数量，右侧展示卡片。技能头像继续使用 Solar Bold 面型图标及彩色圆形背景。
- 顶部为 304px 高的居中主视觉，标题 44px，技能文字使用主题紫渐变；说明沿用原文，分两行。12 个专家、专家团与技能图标及配色直接从目录数据读取，每项在圆环中出现两次，共 24 个图标，按 15° 等距排列，外层为纯圆容器（桌面 56px、窄屏 48px），沿圆弧进行 140 秒一周的匀速循环，图标通过反向旋转抵消轨道角度，始终保持 0° 正向，不额外倾斜，边缘渐隐，背景使用淡紫与淡蓝光晕。不下载千问素材、不引入动画依赖。动效不接受点击；页面隐藏、离开目录或主视觉滚出内容区时暂停，系统设置减少动态效果时显示静态排布。
- 搜索放在主视觉下方，与专家 / 专家团 / 技能 Tab 同行并右对齐，保持内容检索入口靠近列表。操作按钮保留键盘焦点提示。
- 原型最终生效的数据来自 `abilitySceneData` 与末尾 `v3-capability-task-detail-script` 中的 `capabilityMeta`，不是较早的 `capData`。包含专家、专家团、技能三个页签，各 4 项；创建按钮已在最终脚本中移除，不包含连接器入口。
- 支持全部 / 经营分析 / 智慧价格 / 用户运营 / 设备运维场景筛选，搜索名称、描述、场景及已有标签；场景与搜索组合生效。支持结果数量、清空搜索、空态和重置筛选。切换类型重置搜索与场景，返回目录保留当前筛选；页签支持方向键、Home / End。
- 专家和专家团显示业务介绍、标签、累计使用次数及使用权限；次数沿用原型。用户运营专家、用户增长专家团按原型显示“无权限”，点击提示联系管理员，不进入任务流程。权限为前端示例状态，不代替服务端权限校验。
- “使用”专家 / 专家团进入对应任务页面，更新介绍、案例、输入占位、执行对象及语音示例。专家团的 3 条案例使用原型原文。技能的“使用”进入当前执行对象的任务页并添加技能引用，重复选择不重复添加。返回目录入口独立显示，原有四位专属专家仍可从侧栏直接切换。
- 每个执行对象分别保留页面内草稿；从目录进入时保留已有输入，不覆盖用户内容、不自动提交。任务提交后进入对话式任务详情，没有接入真实 AI 服务或后台权限接口。
- 列表在一般桌面显示 3 列；内容区至少 1440px 显示 4 列，不超过 1040px 为 2 列，不超过 720px 为 1 列。内容区不超过 900px 时场景分类改为横向换行选项；720px 以下搜索移到主视觉与 Tab 之间独占一行。侧栏选中态与目录同步。
- 本轮验证覆盖：标签搜索、搜索与场景组合空态、重置、无权限提示、三个可用专家团进入任务、任务详情、技能添加 / 去重 / 移除、返回筛选保留，以及原专家草稿恢复。

## 专家介绍与视频区

- 介绍、能力点和任务文案均采用 v5 原型的 `expertProfiles` 和 `expertTaskExtras` 原文，维护在 `app.js` 的 `profileDetails`。4 位专家各有 6 个任务入口；任务按钮直接展示完整任务文本，空间不足时换行。员工页面留待后续单独设计。
- 左侧按“图标与名称 → 介绍 → 能力点 → 专家能帮你做什么”排列。头像复用侧栏的独立 SVG 文件、渐变配色与 36px 圆形容器。专家能力点保留“图标＋能力名称＋完整说明”，说明来自 v5 的 `abilitySubs`，不可省略为标签；桌面三列，窄内容区改为单列。能力点不可点击、不设悬停效果。能力名称 16px，辅助描述 13px。
- 案例标题 17px；任务使用带紫色箭头的浅色胶囊，桌面每行 3 个、共 2 行。内容区宽度不超过 960px 时改为两列，不超过 400px 时单列。点击后回填下方常驻输入框，并聚焦任务文本；可以继续编辑。每位专家保留独立的页面内草稿，切换专家不串内容，刷新后重置。
- 任务回填后，`#businessContent` 冒泡派发 `expertpromptselect`，内容为 `{ profileId, label, prompt }`。输入框同时支持文件与能力引用、模型选择及本地任务提交演示，未接入真实 AI 执行服务。
- 右侧为纯前端绘制的视频封面，严格使用 `aspect-ratio: 16 / 9`，最大宽度 420px（高度约 236px），随选中专家更新名称与图标。封面上方覆盖 `#000000 20%` 遮罩，播放标记在封面水平、垂直中心，层级位于遮罩之上。用户已确认本轮仅做封面占位；显示“视频即将上线”，没有伪造视频时长或可用的播放按钮。接入视频时可将 `.video-cover` 替换为真实 `<video controls>`。
- 白色卡片左右内容顶部对齐，高度由内容自然撑开；视频不再按宽屏比例持续放大。桌面卡片内边距 24px、两列间距 24px。右侧内容宽度不超过 720px 时改为上下排布，视频仍限制为最大 420px，不超过 400px 时任务胶囊改为一列。员工条目没有绑定页面交互；“我的待办”和“专家·技能”分别使用独立页面。

## 任务输入框

- 功能参考 v5 首页 `#composer`，适用于四位专属专家与从能力中心进入的专家团。输入区固定在右侧主内容区底部，距窗口底部 20px、水平居中，宽度随可用空间收缩、最大 1000px。上方介绍和目录内容独立滚动，输入区占据独立空间，不覆盖正文；切换到专家·技能目录时隐藏输入区并释放空间。输入区内容过多或窗口较矮时内部可滚动，最大高度为主内容区的 60% 且不超过 440px。独立白色容器、24px 圆角，所有屏幕下四边内边距均为 16px，外层无描边、无投影，聚焦时也不增加光晕。顶部展示“描述你的任务需求”标题，17px、字重 600，搭配 20px 紫色填充星星；标题与文本输入区间距 12px，不添加分割线或嵌套描边。下方为圆形添加按钮与胶囊工具栏；添加按钮无描边，使用与普通范围标签一致的灰底 `#F6F7FA`，加号和麦克风默认颜色为 `#344054`。不提供右上角一键清空按钮，文本区不再为该按钮预留右侧空间。
- 输入区自动增高（88px 至 224px），支持 Enter 发送、Shift + Enter 换行，中文输入法选词时不会误发送。空白输入时“开始任务”按钮禁用；按钮为 38px 高胶囊形，向上箭头位于“开始任务”文字左侧，间距 4px，箭头线宽 2（原 1.8），文字字重 600，保留紫色渐变。
- 底部仅展示当前专家和公司 / 大区，范围跟随顶部区域选择更新，默认显示“济南特来电新能源有限公司”。不再展示“全部场站”和项目状态标签；项目仍可通过添加菜单引用。提交后保留所选模型与项目。
- “＋”菜单包含上传文件、专家 / 专家团、技能、项目和资料库。选择内容后生成可移除的引用标签，移除图标使用无外圈的叉号，保留 20px 点击区域；选择新的项目替换旧项目，移除项目引用时同步清除项目标签。
- 本地文件支持图片、Excel、CSV、PDF、Markdown、文本、Word 和 PPT；可多选或拖入输入框。仅保留文件名与大小等页面内元数据，不读取或上传文件内容。
- 输入 `@` 可引用原型中的对话文件，输入 `/` 可搜索专家、专家团和技能；可在正文末尾或光标所在位置直接输入，无需先加空格。选择后仅将当前触发符号及搜索词转为可移除的引用标签，保留前后正文。支持继续输入筛选、方向键选择、Enter 确认、Esc 关闭，中文输入法选词时不触发任务。保留“＋”手动引用菜单；不展示 `@`、`/` 引导或底部快捷键说明。菜单根据视口空间向上或向下展开。
- 模型图标：GLM-5.3 / GLM-5.2 使用 Z.ai 标识，MiniMax-M3 与 Qwen3-235B 使用对应品牌彩色 SVG；选择列表、当前模型按钮和自定义模型配置列表同步展示。Auto 与无法识别的自定义模型使用通用线框立方体图标（Solar `box-minimalistic-linear`）；新增 GLM、MiniMax、Qwen 家族模型可按模型 ID 自动匹配。
- 模型选项沿用原型：Auto、GLM-5.3、GLM-5.2、MiniMax-M3、Qwen3-235B，保留原型倍率；按账户管理截图补充企业 DeepSeek 模型。自定义模型弹窗可添加演示模型到列表；不测试远程接口，不读取或保存 API Key，关闭弹窗即清空表单。
- 语音按钮放在左侧添加按钮右边，两者均使用无描边的 `#F6F7FA` 灰底。语音图标采用简约麦克风，移除麦克风内部右侧两条横线。点击后在麦克风正上方展开紧凑操作面板，“完成录入”和“取消”紧邻排列，不再横跨输入框；面板不占文档流，录音前后麦克风位置不变。再次点击原位置的麦克风也可完成，取消 / Esc 后焦点回到麦克风，完成后聚焦输入框。语音仅复现原型的模拟流程；完成后填入当前专家的示例任务，不访问麦克风。
- 点击“开始任务”后进入任务详情。首页草稿与追问草稿分别保留，返回恢复当前专家及首页草稿；“新建任务”回到同一专家并清空新任务输入。
- `#taskComposer` 派发 `tasksubmit` 事件，detail 为 `{ taskId, profileId, prompt, model, project, region, stationScope, references, demo: true }`。所有草稿、引用和模型配置仅保存在页面内，刷新后重置，不写入本地存储、不发起外部请求。
- 桌面工具栏横排，窄屏自动换行；弹层放在页面根部，避免被滚动容器裁切。关闭弹窗及菜单时保持键盘可用。

## 我的待办与定时任务

- 侧栏“我的待办”进入独立工作区，沿用 20px 外边距、纯白容器、#5552FF 主题色和 Solar 图标；本页隐藏专家欢迎区与输入框。顶部保留“我的待办 / 定时任务”两层业务入口，选中指示线按完整 Tab 居中。
- 待办包含“待处理、已处理、我发起的、我收到的”，使用 v5 原型的调价、营销、工单、经营与报告确认示例。支持按标题 / 单号 / 发起人搜索，按业务类型筛选和更新时间排序，以及空结果重置。
- 同一流程单号只维护一份状态。批准、驳回、退回修改及选填意见保存在当前页面中，处理后移入已处理，并同步我发起的、我收到的与侧栏待办数量。数量为 0 时隐藏侧栏角标；选中“我的待办”时，数量使用主题紫底白字。
- 每条待办的“查看 / 处理”按钮位于元信息下方，与标题左对齐。定时任务的文字操作使用清晰的紫色、深灰和红色，悬停不添加下划线。
- 待办详情与运行详情复用现有滑入 / 滑出抽屉，使用 24px 深色纯 X。审批和新建计划通过表单弹窗完成，提供取消和必填校验。
- 定时任务支持搜索、状态 / 所属项目筛选、创建、立即执行、暂停 / 启用和删除确认。执行周期包含每日、每周一、每月1日和自定义频率、时间、星期或月内日期；按照所选周期计算下一次执行时间，月内日期不存在时取最后一天。名称、指令、周期与项目均保存至页面内模型。
- 运行记录包含成功、失败与运行中状态，可按名称、状态和时间筛选并查看详情。手动执行会新增运行记录，再更新模拟结果；删除计划保留历史运行记录。记录日期按当前日期生成示例，周期执行不接入真实调度服务。
- 这是本地交互 Demo，审批不提交到运营平台，定时任务不会在后台定期运行，也不会调用真实 AI。数据只保存在页面内，刷新后恢复原型示例。

## 任务详情二级页

- 业务交互以 v5 原型最终的 `v3-capability-task-detail-script` 为准：左上角返回、任务标题、右侧新建任务，下方为用户问题与专家回复的对话流。
- 中央对话与底部输入区均最大 1000px、水平居中。顶部标题与底部输入区保持可见，中间对话独立滚动；所有页面外围留白继续为 20px。底部原有添加、上传引用、`@`、`/`、模型选择、项目、语音演示及键盘发送功能全部复用。
- 首轮按经营、价格、用户、设备任务展示原型的示例分析结论、数据表与建议；追问追加到同一任务上下文。每轮支持复制、点赞 / 点踩互斥、系统朗读与停止、重新生成（保留其他轮次）。浏览器不支持朗读或复制失败时显示实际提示。
- “查看所有产物”在右侧抽屉展示报告、表格，支持本地预览与返回列表；“查看所有变更”展示范围确认、能力路由、分析步骤及后续追问 / 重生成 / 确认记录。所有抽屉右上角统一使用 24×24px 的纯 X 关闭图标，点击热区保持 32×32px，默认颜色为 #111827，无外围圆圈、底色或描边，悬停时不改变颜色。打开时从右侧滑入（280ms），关闭时向右滑出（220ms），遮罩同步淡入淡出。关闭按钮、Esc 和遮罩点击均等待滑出结束后关闭抽屉并恢复焦点；内部报告 / 列表切换不重复播放动画。系统开启减少动态效果时直接切换。
- 输入“请执行调价方案”等明确执行指令可以查看待确认状态，支持批准并继续、调整方案。提交调整后旧方案不再等待确认。
- 界面已移除“演示”角标和提示文案。回复与 Token 数值使用示例数据，生成、确认均不调用 AI 或写入业务系统；上传仅引用本地文件元信息；刷新后任务和草稿重置。

## 底部账户与管理弹窗

- 侧栏底部上方为部门，下方为人名，内容按用户提供的截图展示。账户信息集中维护在 `app.js` 的 `accountProfile` 中；`avatarUrl` 可接入头像，留空或加载失败时用姓名首字兜底。侧栏和个人信息弹窗保持一致，不读取或写入浏览器个人资料缓存。
- 整个底部账户区域为单一按钮，点击头像、部门、人名、三个点或区域内空白都能切换“个人信息 / 账户管理 / 模型管理”菜单；折叠侧栏仍可点击。支持 Enter / 空格打开，菜单避开屏幕边缘，支持外部点击、Esc 关闭、上下方向键与 Home / End 导航，关闭弹窗后焦点返回账户区域。
- 个人信息只读展示姓名、产品线、部门和头像。账户管理展示企业专业版、套餐状态、平台 AI 资源总量及三个分类的用量；已用量由分类相加，剩余量和进度条同步计算。
- 模型管理展示 DeepSeek、GLM-5.2、MiniMax-M3 的协议、连接和可用状态，使用真实品牌图标。它们共用输入框的模型数据；原有添加自定义模型功能保留，新添加的模型也出现在管理列表，以“待验证”显示。
- 弹窗沿用当前主题紫、纯白容器和 24px 深色纯 X 关闭图标。本模块只复现截图中的本地展示数据，套餐额度和模型连接状态未查询真实账户或远程服务，不新增购买、退出登录或个人信息编辑流程。

## 区域选择

- 顶部选择框不显示建筑图标，保留下拉箭头；桌面尺寸 240 × 38px，文字 14px、字重 600，桌面左边缘为 238px，与展开侧栏时的右侧卡片对齐；折叠侧栏不移动顶部区域选择。窄窗口下宽度自适应，680px 以下文字 13px。
- 点击顶部“区域选择”打开浮层，支持“大区列表 / 公司列表”切换。两者是平级列表，不做大区与公司的层级联动，沿用开发原型的 5 个大区、5 家公司示例数据。
- 按编号或名称即时搜索，编号不区分大小写；切换列表保留搜索词，支持一键清空及无匹配结果提示。
- 点击任意行后回填顶部名称并关闭浮层，给出选择提示；再次打开会标记当前选中项。较长的公司名在顶部省略，悬停可查看全名，列表内完整展示。
- 点击外部或按 Esc 关闭。支持键盘切换列表、上下选择条目及 Enter / 空格确认；Esc 或选择完成后焦点返回顶部按钮。
- 浮层宽度 440px，随窄窗口收缩并保留左右 12px 边距；高度不足时结果列表独立滚动。
- 默认选中“济南特来电新能源有限公司”（C3701），首次打开浮层展示公司列表并标记该公司，不存在未选择状态。当前选择仅保留在页面内，刷新后恢复该默认公司。示例数据维护在 `app.js` 的 `areaData`；选择后由 `#regionSelector` 冒泡派发 `regionchange` 事件，`event.detail` 为 `{ type, code, name }`，供后续业务模块接入数据范围切换。

## 文件

```text
AI Hub/
├── index.html
├── style.css
├── app.js
├── README.md
└── assets/
    ├── AIHubLOGO.svg
    ├── teldhub-mark.svg
    ├── welcome-robot.png
    └── icons/                 # 每个图标一个独立 SVG 文件
        ├── account-models.svg
        ├── analysis-filled.svg
        └── …
```

无构建依赖，无第三方网络请求。顶部导航 Logo 使用用户最新提供的 `阿瓦打我打我的.svg`（600 × 180），保存为 `assets/AIHubLOGO.svg`，保持原始 SVG 内容，整体替换旧图形、品牌文字和副标题。显示高度 44px、等比宽度约 147px，在 60px 顶部导航内垂直居中。补偿原 SVG 左侧自带的约 3.67px 透明留白，使可见图形左缘保持 15px 的左侧内边距。侧栏收起时完整 Logo 保持不变，不再跟随裁切；窄屏也保留完整 Logo，区域选择框按剩余宽度自适应。取消 Logo 下方横线，右侧也不显示竖线。浏览器页签图标采用用户提供的 `ico.svg`（150 × 150），原样保存为 `assets/teldhub-mark.svg`。

## 图标规范

- 图标集合已拆为 `assets/icons/` 下的 79 个独立 SVG 文件，每个都保留图形路径、viewBox 和来源信息，可直接预览或导入设计工具。
- HTML 使用 `<svg class="icon"><use href="./assets/icons/account-models.svg#account-models"></use></svg>` 直接引用对应文件的根 SVG；动态图标通过 `iconUrl(name)` / `iconMarkup(name)` 引用同一目录。每个文件无需依赖其他图标文件或原集合。
- 独立文件继续通过 `currentColor` 继承界面颜色，选中、悬停、禁用等状态保持原样，品牌图标保留自带配色。替换时保留同名文件及根 SVG 的 `id`，即可更新所有引用位置。
- 已清理旧图标集合和未使用的独立图标。后续修改以独立文件为准；Logo 与网页图标维持原有独立 SVG 引用。

界面图标主要选用 [Yesicon 的 Solar 图标库](https://yesicon.app/zh-Hans/solar)：顶部工具、主导航和展开箭头使用 **Linear**，区域选择的选中标记使用 **Bold 面型**；专家 / 员工列表使用 **Bold 填充图标**，白色图形配明亮彩色渐变背景。后续新增图标延续对应场景的样式，不使用原型的近似绘制图标。底部账户使用 36px 圆形头像；无头像或加载失败时显示姓名首字。账户菜单图标继续使用 Solar Bold，DeepSeek 模型使用 Lobe Icons 品牌标识。

设备诊断专家使用 用户提供的 `SolarHeartPulseBold.svg`，对应 [Yesicon / Solar 心形心电图面型图标](https://yesicon.app/zh-Hans/solar/heart-pulse-bold)，保留原始路径，仅将固定灰色填充改为继承界面图标颜色，沿用 CC BY 4.0 授权和 24 × 24 viewBox。侧栏、目录卡片、介绍页、视频封面、任务执行对象、专家引用和顶部循环同步引用该独立 SVG，青绿色圆形背景保持不变。

列表图标容器为 36 × 36px，使用 50% 圆角形成正圆，内部图标保持 19px。背景采用 145° 轻渐变：蓝 `#4C71F5 → #6AAFFF`、紫 `#6550EC → #9275FA`、橙 `#FF8543 → #FFBC63`、青绿 `#0BBCAF → #4AD8C8`，图标为 `#FFFFFF`。不加高光、内阴影或外部投影；专家和员工列表保持同一配色体系。

作者：**480 Design**。来源：[Solar 原始设计](https://www.figma.com/community/file/1166831539721848736)，授权：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。SVG 数据从 Iconify Solar 集合提取，与 Yesicon 的图标数据来源一致。本地保留原始路径和 24 × 24 画布，按现有界面尺寸缩放并继承颜色，分别保存到 `assets/icons/`。根据界面调整，线性图标的描边由原始 1.5 加粗至 1.8（基于 24 × 24 画布）；白底中性图标默认为 `#344054`，左侧两个主导航入口加深为 `#111827`。账户右侧的更多图标改用同库 Bold 实心版本。

| 位置 | Solar 图标 |
| --- | --- |
| 区域搜索 / 清空 / 已选 | magnifier / close-circle / check-circle-bold（面型勾选） |
| 任务箭头 / 视频封面播放标记 | arrow-right / play-bold |
| 输入框添加 / 文件 / 项目 / 资料库 | add-circle / paperclip / folder / book |
| 通用模型 / 账户模型管理 | box-minimalistic-linear / box-minimalistic-bold |
| 语音 / 发送 / 设置 / 输入框标题 | microphone / arrow-up / settings / stars-bold |
| 数据查询 / 经营分析 / 趋势诊断 | database / chart-2 / graph-up |
| 智慧定价 / 竞品分析 / 收益测算 | tag-price / radar-2 / calculator |
| 用户运营 / 新客转化 / 流失召回 | users-group-rounded / user-check-rounded / restart-circle |
| 故障诊断 / 离线巡检 / 工单建议 | cpu-bolt / wi-fi-off / clipboard-list |
| 最近任务 / 通知 / 反馈 | history-2 / bell / chat-round-dots |
| 我的待办 / 专家·技能 | checklist-minimalistic / widget-2 |
| 专属专家 / 我的员工 | medal-star / case-round-minimalistic |
| 经营分析 / 智慧价格 | chart-square-bold / tag-price-bold |
| 用户运营 / 设备管理 | users-group-rounded-bold / cpu-bolt-bold |
| 促销运营 / 竞争洞察 | ticket-sale-bold / radar-2-bold |
| 现场服务 / 监控值守 | map-point-wave-bold / monitor-camera-bold |
| 舆情回复 | chat-round-dots-bold |
| 下拉 / 收起侧栏 | alt-arrow-down / alt-arrow-left |
| 账户右侧更多 | menu-dots-bold（实心） |

未注明 `-bold` 的名称使用 `-linear` 后缀。列表与顶部反馈分别引用独立 SVG 文件，修改列表样式不影响顶部工具；所有图标均在本地加载，不增加运行时网络依赖。TeldHub 品牌标识单独维护，不作为界面功能图标使用。

### 新增或替换图标

**优先在 [Yesicon / Solar](https://yesicon.app/zh-Hans/solar) 按功能名称搜索**。Yesicon 是检索入口，Solar 的原作者是 **480 Design**；[Iconify Solar 数据](https://github.com/iconify/icon-sets/blob/master/json/solar.json) 提供同源 SVG 路径。功能图标沿用 Solar：普通工具使用 Linear，专家、员工、能力和账户菜单使用 Bold，避免混用不同图标库的风格。

1. 下载所选 SVG，保存到 `assets/icons/`，使用小写英文和短横线命名，例如 `new-feature.svg`。每个图标单独一个文件。
2. 保留原有 `viewBox`、路径及 `defs`；普通图标使用 `currentColor` 继承组件颜色，模型品牌图标保留品牌配色。根 `<svg>` 添加与文件名一致的 `id="new-feature"`，以及真实来源 `data-icon="solar:实际图标名称"`。现有文件可作为格式参考。
3. HTML 使用下方方式引用；JS 动态内容复用现有 `iconUrl(name)` / `iconMarkup(name)`，传入不带扩展名的本地图标名称。
4. 图标尺寸、颜色、选中态由 `.icon` 和所在组件的 CSS 控制。新下载的线性图标可参照相邻图标调整线宽，不要改动 Bold 面型图标的路径。
5. 替换已有图标时保留文件名与根 `id`；新增不同来源时在本 README 补充作者、原始链接和授权说明。若有渐变、遮罩、裁切路径，保留对应 `id` 和引用关系。
6. 通过本地 HTTP 服务检查默认、悬停和选中状态，并确认网络请求没有 404。外部 SVG `<use>` 不建议通过 `file://` 预览。

```html
<!-- assets/icons/new-feature.svg 的根节点格式；内容使用下载的真实路径 -->
<svg xmlns="http://www.w3.org/2000/svg" id="new-feature"
     viewBox="0 0 24 24" data-icon="solar:实际图标名称">
  <!-- 保留下载 SVG 的路径与 defs -->
</svg>

<!-- 页面引用 -->
<svg class="icon" aria-hidden="true">
  <use href="./assets/icons/new-feature.svg#new-feature"></use>
</svg>
```

```js
// 动态内容：名称来自项目维护的图标映射，不直接接收外部输入。
iconMarkup('new-feature');
// 返回单个 SVG 的引用地址。
iconUrl('new-feature'); // ./assets/icons/new-feature.svg#new-feature
```

已有图标的准确库名称可查看文件根节点的 `data-icon`。`composer-remove.svg`、`panel-close.svg` 是本项目的简洁叉号图形；Logo 与 favicon 是用户提供的品牌设计资产，分别为 `assets/AIHubLOGO.svg`、`assets/teldhub-mark.svg`，不适用 Solar / LobeHub 的开源授权。

### 能力目录的独立图标

不同功能使用不同的 Solar Bold 图形，同一功能在目录卡片、顶部动效、专家团介绍和任务执行对象中保持一致。

| 功能 | 图形 | Solar 图标 |
| --- | --- | --- |
| 经营分析专家 | 柱状图 | chart-square-bold |
| 智慧价格专家 | 价格标签 | tag-price-bold |
| 用户运营专家 | 用户群 | users-group-rounded-bold |
| 设备诊断专家 | 心形心电图 | solar:heart-pulse-bold |
| 智慧运营专家团 | 协同节点 | share-circle-bold |
| 经营提升专家团 | 上升趋势 | graph-up-bold |
| 用户增长专家团 | 新增用户 | user-plus-bold |
| 设备运维专家团 | 运维齿轮 | settings-bold |
| 充电量异常根因分析 | 异常放大镜 | magnifier-bug-bold |
| 竞品价格空间分析 | 竞品雷达 | radar-2-bold |
| 用户流失召回 | 用户回归确认 | user-check-rounded-bold |
| 设备故障诊断 | 故障虫形 | bug-bold |

## 预览

在此目录运行：

```sh
python3 -m http.server 8770 --bind 127.0.0.1
```

访问 <http://127.0.0.1:8770/>。请通过 HTTP 预览，浏览器对直接打开本地 HTML 时加载外部 SVG 图标可能有限制。

## 基础样式

- 顶栏 60px，侧栏 218px，折叠侧栏 72px。
- 侧边栏展开、收起时的四边内边距均为 8px；专家和员工列表项之间的间距为 6px。
- 侧栏右侧主内容区四周留白统一为 20px，专家介绍页、专家团页面与专家·技能目录共用该规则；侧栏展开、收起及窄屏下均保持 20px。卡片内部间距仍使用各自组件规范。桌面顶部区域选择同步与下方内容左边缘对齐。
- 页面底色 `#EDF1FC`，白色容器，圆角 16px。
- 主色 `#5552FF`，选中浅底 `#F1F1FF`，悬停浅底 `#F7F7FF`，主题浅描边 `#D5D4FF`。统一应用于主导航、专家 / 员工切换、成员选中标题、待办数量、折叠按钮悬停和键盘焦点。
- 专家 / 员工选中项的“最后使用时间”使用浅紫色 `#928FE8`，未选中项保持原辅助灰色。
- 正文 PingFang SC，导航 13px，辅助信息按层级降低字号。
- 主内容随窗口伸缩；侧栏列表独立滚动，账户固定在底部。680px 以下默认收起侧栏。

本仓库仅维护 AI Hub 前端页面、样式、交互代码与所需素材，不包含产品原型全文、PRD、其他项目、历史备份或本地临时文件。

## 模型品牌图标来源

图标来自 [LobeHub Icons](https://github.com/lobehub/lobe-icons)，以独立 SVG 文件保存到 `assets/icons/`。GLM、MiniMax、Qwen 使用 `@lobehub/icons-static-svg@1.95.0` 中的资源；DeepSeek 后续取自该项目的静态 SVG 目录。保持原图形与品牌配色，使用 MIT 授权（全文见下）；运行时不依赖外部图标服务。品牌名称和标识归各自权利人所有。

| 本地文件 | 品牌 | 上游文件 |
| --- | --- | --- |
| `model-glm.svg` | Z.ai / GLM | `zai.svg` |
| `model-minimax.svg` | MiniMax | `minimax-color.svg` |
| `model-qwen.svg` | Qwen | `qwen-color.svg` |
| `model-deepseek.svg` | DeepSeek | `deepseek-color.svg` |

新增模型品牌图标从 [LobeHub 静态 SVG 目录](https://github.com/lobehub/lobe-icons/tree/master/packages/static-svg/icons) 获取；无法识别的模型继续使用 `composer-model.svg` 兜底。

<details>
<summary>LobeHub Icons MIT License</summary>

```text
MIT License

Copyright (c) 2023 LobeHub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</details>
