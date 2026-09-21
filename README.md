# AI Hub · 高保真 Demo

**[在线预览](https://wangyekai918-star.github.io/AI_Hub/)** · [GitHub 仓库](https://github.com/wangyekai918-star/AI_Hub) · [图标库（Yesicon / Solar 中文版）](https://yesicon.app/zh-Hans/solar)

纯静态前端交互 Demo，使用示例数据；AI 回复、语音录入、模型连接与任务执行未接入真实业务服务。

最新版本：**2026-09-21 · 专家介绍与案例视频区更新**。详情见[本次更新说明](./CHANGELOG.md#2026-09-21专家介绍与案例视频区更新)。

开发与 AI 编程工具请先阅读：[AI Hub 视觉规范：专家、技能、数字员工与全局配色](./AI_Hub_视觉规范.md)。该独立文档汇总已确认的配色、图标映射、尺寸、组件例外与验收规则。

当前最新产品原型为 **`TeldHub_最终版本_v5.html`**，后续业务内容与交互以此版本为准。顶部品牌使用用户提供的 **AIHubLOGO.svg**，项目目录为 **AI Hub**。视觉沿用 AI 管家的基础样式及用户已确认的 AI Hub 调整，独立于原项目维护。

## 原型参考版本

- 最新原型：`TeldHub_最终版本_v5.html`（仅作本地需求参考，不随仓库发布），于 2026-09-20 确认为后续参考基准。
- v5 主要更新了专家 / 专家团能力卡与使用入口、新建任务的执行对象展示，以及任务详情的对话式结构和相关交互。后续实现对应模块时，以 v5 的实际内容与行为核对需求。
- 基础页面基于 v2 及用户逐轮确认的设计搭建；专家介绍区的介绍、能力点和任务文案已同步 v5 原文，其他模块尚未全面同步 v5。
- 原型用于确定业务内容、功能与状态，视觉和布局继续遵循已确认的高保真方案；不直接照搬原型样式。

## 本轮内容

- 顶部导航横向通栏，包含完整 Logo、区域选择、最近任务、通知、反馈。Logo 固定显示在左上角；桌面展开侧栏时，区域选择与下方卡片左边缘对齐。
- 左侧区域从顶部导航下方延伸到底部，紧贴左侧、无外边距、无圆角，依次为我的待办、专家·技能、专属专家 / 数字员工、示例账户。主导航“我的待办”“专家·技能”的默认文字和图标颜色为 `#111827`，选中态保留主题紫。
- 展示 5 位专属专家与8位数字员工；仅专属专家展示最近一次提问时间；默认选中经营分析专家。
- 列表每项左侧为Icon，右侧独立文字区：专属专家名称在上，最近一次提问时间在下；不显示“最后使用”四个字，两行左对齐、间距0。数字员工只展示名称，不显示时间或空占位；Icon与文字区垂直居中。列表项四边内边距均为 8px，高度随内容撑开，不设额外最小高度。
- 右侧顶部介绍区：独立的22px圆角浅蓝紫渐变板块，左侧为当前专家名称、描述与三个紧凑利益点标签；桌面上下16px、左右32px内边距。右侧为机器人和固定问候气泡，下方叠加低对比度的简化楼宇、车辆与充电桩纹理，纹理整体下移20px。
- 下方并排展示两张独立卡片：左侧“专家能帮你做点什么？”展示两列两行共四个案例，标题行右侧提供“换一批”；右侧为当前专家的视频封面。`#mainContent` 是右侧整体区域。

已实现：侧栏折叠 / 展开、分组切换、五位专家选中态、列表内部滚动、分组键盘切换、区域选择浮层、专家资料联动、任务输入框演示交互，以及专家·技能目录与使用流程。

“专属专家”的五位专家保留原介绍页；“专家·技能”进入独立目录页，从目录使用专家团时复用任务页面，更新为专家团的介绍、能力与案例。“我的待办”进入独立待办与定时任务页面；八位员工条目仍仅展示外观，不复用专家页面。“数字员工”分组仅切换侧栏名单，不改变右侧内容。

侧栏展开 / 收起使用 280ms 缓动：侧栏与内容区同步改变宽度，顶部 Logo 和区域选择保持稳定，文字淡入淡出，图标位置和箭头旋转平滑过渡。快速反向操作直接接续当前状态；首次加载和响应式自动切换不播放动画，系统开启“减少动态效果”时关闭过渡。原有 8px 内边距、6px 列表间距和 36px 图标容器保持不变。折叠按钮位于侧栏右侧的垂直中心，点击区域为 20 × 48px，外层容器使用 999px 胶囊圆角，箭头保持 14px；展开、收起时均居中。

最近任务、通知和反馈均已支持本地交互，使用统一的右侧滑出面板。底部账户支持个人信息、账户管理和模型管理，见下方说明。

## 顶部专家介绍区

- 主标题直接展示当前专家名称，例如“经营分析专家”“智慧价格专家”；不再展示“TeldHub, 你的……超级助手”、品牌下划线或标题左侧的专家图标。标题桌面44px、字重600；上方小标题采用32px独立圆形星芒＋浅紫胶囊文字。
- 标题下方展示 `profileDetails` 中当前专家的描述，与大标题间距 4px，使用 15px / 26px 辅助灰色，不在白色案例卡片中重复展示。经营分析专家介绍精简为“分析充电量、收入与用户变化，定位异常原因，提供运营建议。”。
- 三个能力与利益点位于左侧专家描述下方，改为仅含 18px Solar Bold 面型图标与 14px / 600 标题（`#667085`）的短标签，移除详细描述和图标外圈。标签按内容宽度横排、不拉伸填满，每项高 36px，采用纯白底、无描边、`0 3px 10px #5552FF 7%` 淡紫投影、8px 圆角，上下 6px、左右 12px 内边距；图文间距 6px，标签间距 8px。图标使用橙、蓝、青绿、玫瑰粉等丰富配色，由 `benefitIconColors` 按语义固定映射，不随排列位置改变、不局限于主题紫。不可点击，空间不足时自然换行。
- 顶部介绍为独立22px圆角板块，桌面上下16px、左右32px内边距、最小高度272px，使用112deg浅色渐变 `#FCFCFF → #F3F5FF → #E8F0FF → #E4EAFF`，叠加柔白与淡青光影，1px白色90%描边、无投影。左侧介绍与右侧主视觉采用两列，下方案例卡片与其间距16px。内容区不超过1100px时上下20px、左右24px，最小高度244px；不超过600px时四边20px、高度随内容自然撑开。
- 背景下部和右侧使用本地 `assets/expert-charging-texture.png`，由网关参考用户确认的局部图片生成。仅有简化的半透明楼宇方块、车辆与充电桩，低细节、哑光、浅蓝紫，不使用写实街景、反射或复杂建筑。整体65%不透明度，左侧与顶部渐隐；仅作装饰，不接受交互。
- 右侧继续展示250px透明机器人，视觉布局层压缩至238px并垂直居中，为浮动预留空间；气泡与图片间距12px；这组主视觉整体左移20px（内容区≤900px时12px，≤600px取消偏移），减少对背景车辆和充电桩的遮挡。气泡为 `#FFFFFF 70%` 填充、1px纯白描边、16px圆角及圆润尖角；“Hi! 👋”18px / 600、主题紫，后一句15px / 600。
- 气泡固定显示“Hi! 👋 / 有什么可以帮你的吗？”，使用普通段落；取消案例轮播、星星、点击箭头、点击填入与悬停状态，不进入Tab焦点顺序。切换任何专家或专家团后文案均保持固定；下方案例仍可点击填入。
- 机器人保留 4.8 秒循环、向上 8px 的漂浮效果。较窄内容区缩小插画并调整气泡排布；600px 以下隐藏装饰插画，保留气泡和完整专家信息。
- 机器人插画通过用户指定的 Codex 网关生成，文件为 `assets/welcome-robot.png`，1254 × 1254px、RGBA透明背景。新增场景纹理为独立的本地PNG装饰，不属于功能图标库。标题、描述、利益点、案例和视频入口名称随专家 / 专家团同步更新；功能SVG继续引用 `assets/icons/` 本地文件。

<details>
<summary>充电场景纹理的生成方式与最终提示词</summary>

方式：Codex Gateway Imagegen，使用用户确认的局部截图作为风格参考。最终资源：`assets/expert-charging-texture.png`。只生成背景纹理，气泡、文字与机器人仍是页面中的独立元素。

```text
Use case: stylized-concept. The supplied image is a STYLE REFERENCE. Generate ONLY a very faint simplified background texture matching the little car, charger and buildings along the bottom of this reference. Do NOT recreate the foreground robot, the speech bubble, text, handwriting, frame, or UI. The reference background objects are intentionally primitive soft 3D shapes, almost flat monochrome silhouettes, not realistic objects. Match that exact low-detail rendering: a small toy-like white car with simple solid lavender windows, perfectly round plain wheels, no spokes, no grille detail, no headlight detail, no seams, no badge, no reflections. Beside it is a tall pale periwinkle rounded cuboid charging pedestal with one simple white lightning symbol and a smaller socket post with a simple curved cable. A few translucent rectangular building blocks at lower left, no individual windows, no detailed facades. Shapes are matte milky translucent pastel plastic with broad soft gradients and rounded edges, very low contrast. Everything should be soft, ghosted and desaturated, looking like a decorative UI background, not a scene photograph. Palette almost white, pale lavender, light icy blue. Put the simplified vehicle and charging posts close together at the far bottom-right, occupying the bottom 34 percent and rightmost 42 percent of the image. A small pair of abstract building blocks at lower center-left. Lots of empty softly luminous white-blue background above and to the left. Very subtle low flowing translucent wave along the bottom. No ground reflection, no streets, no trees, no glass skyscrapers, no realistic architecture, no photographic materials, no complex details, no outlines, no robot, no people, no words, no UI, no border. All objects gently fade into pale fog at their bases. This is a texture behind a separate foreground robot; the reference background softness and simplicity are essential.
```

</details>

<details>
<summary>机器人插画生成提示词</summary>

```text
Use case: stylized-concept. Asset type: a single high fidelity 3D illustration for the right side of a professional AI assistant web dashboard welcome area. Create an original friendly small floating robot with a large rounded white ceramic head, a dark navy glossy face screen, two cyan oval glowing eyes and a tiny cyan smile, subtle violet side ear pieces, a short antenna with a cyan tip, compact white rounded body and small floating feet. The robot faces slightly left toward the page text, one arm extended toward one small translucent glass analytics panel on its left; panel contains only a simple bar chart and small circular chart, no words. One delicate cyan orbit arc gently wraps around the lower body. Restrained premium soft 3D product illustration, white porcelain and pale lavender accents, brand accent violet #5552FF, subtle cyan lights, soft studio illumination, smooth clean surfaces. Composition: the entire robot and panel centered in a square canvas, full body entirely visible, generous 10 percent safe margin all around, compact balanced silhouette, no cropping. Background must be truly transparent with alpha, no checkerboard drawn, no colored rectangular backdrop, no card, no floor, no strong cast shadow. No text, letters, numbers, logos, badges, watermark, extra characters or decorative clutter. This is an isolated reusable illustration asset, not a screenshot or page mockup.
```

</details>

### 车型复盘专家

- 侧栏新增第 5 位“车型复盘专家”，介绍为“输入车牌号或车架号，查清爱车信息；车型不对，帮你提交更正申请。”利益点为“查爱车信息 / 看认证状态 / 申请改车型”。文案由用户提供的功能说明转为用户日常表达，不直接复制内部需求措辞。
- 沿用专家介绍、三案例＋末位视频、换一批、固定问候气泡与底部输入框；共6条车型查询、认证核对与纠错案例。目录归属“车辆服务”，侧栏、目录、引用选择与任务详情同步使用同一身份。
- 车辆查询与更正仍是本地交互演示，不连接真实车辆服务、不提交申请；更正语义为“提交申请、等待审核”，不展示已直接修改车型的结果。
- 原设备诊断专家统一更名为“故障诊断专家”，保留 `device_expert` 标识、青绿底座与心形心电图，不更改“设备故障诊断”技能的名称。

### 专属专家的最近提问时间

- 字段为 `lastAskedAt`（毫秒时间戳）。不足1分钟显示“刚刚”；1分钟至不足1小时显示“几分钟前”；1小时至不足24小时显示“几小时前”；24小时至不足30天显示“几天前”；30天及以上显示“几月几日”（不补零，例如8月16日）。一个月统一按30天计算，不按自然月切换。
- 仅首次发送任务和发送追问时更新对应专家时间。浏览、切换、填入案例、打开历史任务、重新生成、停止生成或审批确认均不更新。专属专家按最近提问时间倒序排列，最新的在最上面；发送或追问后即时重排，刷新和切换回来仍按时间排序。相同时间保持原始顺序，没有时间的排在末尾；数字员工保持原有顺序，选中样式不变。
- 每分钟刷新相对时间，页面回到前台时立即刷新。没有历史提问时间的专家不展示时间占位；数字员工不渲染时间节点或含时间的无障碍标签。
- 提问时间仅保存到本地 `localStorage` 的 `ai-hub-expert-last-asked-v1`，只包含专家ID和时间戳，不保存问题正文。首次使用示例时间初始化，此后发送与追问更新对应时间；刷新恢复已记录时间，不重新生成示例时间影响排序。本地存储不可用时退回页面内存。

## 顶部最近任务、通知与反馈

- 功能依据 v5 原型的 `openRecentWorkDrawer`、`openNotificationDrawer` 和 `openFeedbackDrawer`。顶部保留现有胶囊入口，悬停与打开态使用主题紫；侧栏宽480px、窄屏自适应，沿用280ms移入 / 220ms移出动画、24px纯X和32px关闭热区。支持Esc、遮罩关闭和关闭后焦点返回。
- 最近工作包含“最近任务 / 最近产物”两个Tab，顶部入口默认打开最近任务，可分别搜索任务、专家、项目或文件、来源任务。沿用原型4条任务，补充通知中的“每日经营晨报”以连通报告入口；新建任务自动进入最近列表，可重开、继续追问，生成 / 待审批 / 停止 / 完成状态同步，切换任务时保留各自草稿。
- 产物列表只展示已有结果的任务文件，支持预览、返回搜索结果、打开来源任务和引用到新任务。Markdown下载实际生成的 `.md`；原型中的表格提供“导出CSV”，下载真实UTF-8 CSV内容，不把文本伪装成XLSX。新增下载图标先存到本地 `assets/icons/utility-download.svg`，来源 [Solar download-minimalistic-linear](https://yesicon.app/zh-Hans/solar/download-minimalistic-linear)（480 Design / CC BY 4.0）。
- 通知包含召回策略待审批、经营晨报完成两条消息；支持未读提示、点击标已读、全部已读。审批消息打开对应任务，报告消息打开产物预览。全部已读后顶部红点消失，打开列表本身不自动标记已读。
- 反馈提供“产品建议 / 功能问题 / 交互体验 / 其他”、必填内容、字数提示和选填联系方式；空白内容有就地校验，提交后展示感谢反馈状态。类型及内容仅暂存当前页面内存，联系方式不读取、不写入记录，提交或关闭时清空。
- 本模块不发送网络请求、不向外部提交反馈、不调用真实业务审批；最近任务、通知已读状态和反馈暂存均在刷新后恢复初始示例。

## 专家 · 技能目录

- 点击左侧“专家·技能”进入独立目录页。只从 v5 读取功能、业务文案和示例状态，视觉使用当前 AI Hub 的 `#5552FF` 主题色、`#EDF1FC` 底色、16px 白色卡片及本地 Solar SVG。
- 目录布局参考[千问 AI 平台技能市场](https://www.qianwenai.com/hub/skills)：整个右侧内容区为纯白底、16px 圆角，与左侧导航并排通栏；目录卡片使用常驻的 1px 浅灰描边，无悬停变色描边或投影。内部左右间距 24px，窄屏缩为 16px。桌面保留 156px 场景分类栏，显示当前类型下各场景数量，右侧展示卡片。技能头像继续使用 Solar Bold 面型图标及彩色圆形背景。
- 顶部为 304px 高的居中主视觉，标题 44px，技能文字使用主题紫渐变；说明沿用原文，分两行。13 个专家、专家团与技能图标及配色直接从目录数据读取，每项在圆环中出现两次，共 26 个图标，按约 13.85° 等距排列，外层为纯圆容器（桌面 56px、窄屏 48px），沿圆弧进行 140 秒一周的匀速循环，图标通过反向旋转抵消轨道角度，始终保持 0° 正向，不额外倾斜，边缘渐隐，背景使用淡紫与淡蓝光晕。不下载千问素材、不引入动画依赖。动效不接受点击；页面隐藏、离开目录或主视觉滚出内容区时暂停，系统设置减少动态效果时显示静态排布。
- 搜索放在主视觉下方，与专家 / 专家团 / 技能 Tab 同行并右对齐，保持内容检索入口靠近列表。操作按钮支持键盘操作，不显示焦点描边。
- 原型最终生效的数据来自 `abilitySceneData` 与末尾 `v3-capability-task-detail-script` 中的 `capabilityMeta`，不是较早的 `capData`。包含专家、专家团、技能三个页签；当前分别为 5 位专家、4 个专家团、4 项技能（新增车型复盘专家）；创建按钮已在最终脚本中移除，不包含连接器入口。
- 支持全部 / 经营分析 / 智慧价格 / 用户运营 / 设备运维场景筛选，搜索名称、描述、场景及已有标签；场景与搜索组合生效。支持结果数量、清空搜索、空态和重置筛选。切换类型重置搜索与场景，返回目录保留当前筛选；页签支持方向键、Home / End。
- 专家和专家团显示业务介绍、标签、累计使用次数及使用权限；次数沿用原型。用户运营专家、用户增长专家团按原型显示“无权限”，点击提示联系管理员，不进入任务流程。权限为前端示例状态，不代替服务端权限校验。
- “使用”专家 / 专家团进入对应任务页面，更新介绍、案例、输入占位、执行对象及语音示例。专家团保留原型前 2 条案例并补充至 6 条案例池，每次展示 3 条，能力介绍视频固定放在第四位。技能的“使用”进入当前执行对象的任务页并添加技能引用，重复选择不重复添加。返回目录入口独立显示，原有五位专属专家仍可从侧栏直接切换。
- 每个执行对象分别保留页面内草稿；从目录进入时保留已有输入，不覆盖用户内容、不自动提交。任务提交后进入对话式任务详情，没有接入真实 AI 服务或后台权限接口。
- “适用场景”中的“设备运维”使用本地 `maintenance-filled.svg`（Solar `settings-bold`）面型齿轮，避免小尺寸下芯片图标的复杂细节；与运维语义一致，故障诊断专家仍使用心形心电图。
- 列表在一般桌面显示 3 列；内容区至少 1440px 显示 4 列，不超过 1040px 为 2 列，不超过 720px 为 1 列。内容区不超过 900px 时场景分类改为横向换行选项；720px 以下搜索移到主视觉与 Tab 之间独占一行。侧栏选中态与目录同步。
- 本轮验证覆盖：标签搜索、搜索与场景组合空态、重置、无权限提示、三个可用专家团进入任务、任务详情、技能添加 / 去重 / 移除、返回筛选保留，以及原专家草稿恢复。

## 专家案例与视频区

- 案例和视频为同一行的两张独立卡片，外层 `expert-resources` 只负责布局，不加白色底。左侧案例卡自适应剩余宽度，右侧视频约占36%，桌面列宽限制为340–480px；卡片间距16px、顶部对齐、圆角均为22px。并排时视频封面为16:9，不被左侧案例高度拉伸。
- 案例卡四边16px内边距，标题20px / 600、前方保留24px本地渐变AI消息图标。“换一批”在标题行右侧。
- 五位专家和四个专家团每次展示四个案例，两列两行，格子间距10px；每位仍保留六条候选案例，换批以四条为步长循环，各自记录偏移，不修改输入草稿。
- 案例最小高76px、四边16px内边距、12px圆角、浅色填充与固定细描边；文案14px / 22px、最多两行，悬停可查看完整文字，点击回填完整问题。箭头移至右侧28px浅紫圆底内，不保留选中态。
- 右侧整张封面均可点击，展示“TeldHub 使用视频”、当前专家名称、能力与使用方式说明和正中心的白色播放按钮。封面增加1px纯白描边；左上角文字距顶部和左侧均24px，左下角主副标题距底部和左右均24px，副标题14px / 22px；标题与说明固定在底部，专家图标降为浅色背景装饰，移除重复的右下角观看标签。封面用CSS浅蓝紫渐变、装饰圆环及对应的本地面型专家SVG组成，不需要额外位图或外部素材；切换专家时名称、图标、可访问名称与视频资源同步更新。
- 内容区不超过900px时两张卡片上下排列，视频铺满可用宽度、高240px、不限制比例，案例仍为两列；不超过500px时案例单列。短屏继续沿用正文滚动与底部悬浮输入框渐隐，不压缩视频到案例入口里。
- 点击视频打开独立观看弹窗，不填入输入框、不改变草稿；支持关闭按钮、Esc与遮罩关闭，关闭后焦点回到视频封面。视频源在 `profileDetails.videoSrc` 维护，配置后使用浏览器原生16:9播放器，无额外依赖。
- 当前尚未提供实际视频，弹窗显示“视频即将上线”，不伪造时长或播放进度。播放图标复用本地 `assets/icons/video-play.svg`。

## 任务输入框

- 功能参考 v5 首页 `#composer`，适用于五位专属专家与从能力中心进入的专家团。输入区固定在右侧主内容区底部，距窗口底部 20px、水平居中，宽度随可用空间收缩、最大 1000px。正文滚动区延伸到主内容区底部，输入框以悬浮层覆盖在正文之上，不再占据单独布局空间；切换到专家·技能或待办页面时隐藏输入框及遮罩。输入区内容过多或窗口较矮时内部可滚动，最大高度为主内容区的 60% 且不超过 440px。独立白色容器、24px 圆角，所有屏幕下四边内边距均为 16px，外层无描边、无投影，聚焦时也不增加光晕。顶部展示“描述你的任务需求”标题，17px、字重 600，搭配 20px 紫色填充星星；标题与文本输入区间距 12px，不添加分割线或嵌套描边。下方为圆形添加按钮与胶囊工具栏；添加按钮无描边，使用与普通范围标签一致的灰底 `#F6F7FA`，加号和麦克风默认颜色为 `#344054`。不提供右上角一键清空按钮，文本区不再为该按钮预留右侧空间。
- 输入框上方增加 48px 的透明至页面背景色 `#EDF1FC` 渐变，下方继续使用相同底色遮住经过输入框背后的正文；渐变不拦截鼠标滚动。通过原生 `ResizeObserver` 同步输入框真实高度，正文底部增加相应滚动余量，使最后一条回复及操作按钮能完整滚出遮罩。输入框增高且原本停在对话底部时，自动保持在底部。首页与任务二级页共用该效果，最大宽度仍为 1000px。
- 输入区自动增高（88px 至 224px），支持 Enter 发送、Shift + Enter 换行，中文输入法选词时不会误发送。空白输入时“开始任务”按钮禁用；按钮为 38px 高胶囊形，向上箭头位于“开始任务”文字左侧，间距 4px，箭头线宽 2（原 1.8），文字字重 600，保留紫色渐变。
- 底部仅展示当前专家和公司 / 大区，范围跟随顶部区域选择更新，默认显示“济南特来电新能源有限公司”。不再展示“全部场站”和项目状态标签；项目仍可通过添加菜单引用。提交后保留所选模型与项目。
- “＋”菜单包含上传文件、专家 / 专家团、技能、项目和资料库。选择内容后生成可移除的引用标签，移除图标使用无外圈的叉号，保留 20px 点击区域；选择新的项目替换旧项目，移除项目引用时同步清除项目标签。
- 本地文件支持图片、Excel、CSV、PDF、Markdown、文本、Word 和 PPT；可多选或拖入输入框。仅保留文件名与大小等页面内元数据，不读取或上传文件内容。
- 输入 `@` 可引用原型中的对话文件，输入 `/` 可搜索专家、专家团和技能；可在正文末尾或光标所在位置直接输入，无需先加空格。选择后仅将当前触发符号及搜索词转为可移除的引用标签，保留前后正文。支持继续输入筛选、方向键选择、Enter 确认、Esc 关闭，中文输入法选词时不触发任务。保留“＋”手动引用菜单；不展示 `@`、`/` 引导或底部快捷键说明。菜单根据视口空间向上或向下展开。
- 模型图标：GLM-5.3 / GLM-5.2 使用 Z.ai 标识，MiniMax-M3 与 Qwen3-235B 使用对应品牌彩色 SVG；选择列表、当前模型按钮和自定义模型配置列表同步展示。Auto 与无法识别的自定义模型使用通用线框立方体图标（Solar `box-minimalistic-linear`）；新增 GLM、MiniMax、Qwen 家族模型可按模型 ID 自动匹配。
- 模型选项沿用原型：Auto、GLM-5.3、GLM-5.2、MiniMax-M3、Qwen3-235B，保留原型倍率；按账户管理截图补充企业 DeepSeek 模型。自定义模型弹窗可添加演示模型到列表；不测试远程接口，不读取或保存 API Key，关闭弹窗即清空表单。
- 语音按钮放在左侧添加按钮右边，两者均使用无描边的 `#F6F7FA` 灰底。语音图标采用简约麦克风，移除麦克风内部右侧两条横线。点击后在麦克风正上方展开紧凑操作面板，“完成录入”和“取消”紧邻排列，不再横跨输入框；面板不占文档流，录音前后麦克风位置不变。再次点击原位置的麦克风也可完成，取消 / Esc 后焦点回到麦克风，完成后聚焦输入框。语音仅复现原型的模拟流程；完成后填入当前专家的示例任务，不访问麦克风。
- 点击“开始任务”后进入任务详情。首页草稿与追问草稿分别保留，返回恢复当前专家及首页草稿；“新建任务”回到同一专家并清空新任务输入。
- 首轮、追问及重新生成的等待期间，发送按钮切换为 38px 深色圆形停止按钮，内部使用白色实心方块，悬停提示和无障碍名称为“停止生成”；即使输入为空也可点击。点击立即取消本轮计时器并标记“已停止生成”，保留问题、历史轮次和当前追问草稿，恢复发送状态。输入框内按 Enter 不会误触停止。当前 Demo 等待时间为 2.4 秒，不调用真实模型。
- 发送 / 停止形态双向切换时，宽度用 260ms 缓动收缩或展开，底色用 180ms 淡入淡出，箭头与文字和停止图标交叉淡入淡出并轻微缩放；按钮高度保持 38px，切换立即生效，不等待动画才能停止。图标预先引用本地 SVG，避免替换资源时闪变；系统开启减少动态效果时取消过渡。
- 按钮只在最外层做一次圆角裁切，内部背景层不重复设置圆角；灰色禁用态及深色停止态完成切换后，紫色渐变层透明度为0，避免圆角边缘出现紫色细边或毛刺。
- `#taskComposer` 派发 `tasksubmit` 事件，detail 为 `{ taskId, profileId, prompt, model, project, region, stationScope, references, demo: true }`。所有草稿、引用和模型配置仅保存在页面内，刷新后重置，不写入本地存储、不发起外部请求。
- 桌面工具栏横排，窄屏自动换行；弹层放在页面根部，避免被滚动容器裁切。关闭弹窗及菜单时保持键盘可用。

## 我的待办与定时任务

- 侧栏“我的待办”进入独立工作区，沿用 20px 外边距、纯白容器、#5552FF 主题色和 Solar 图标；本页隐藏专家欢迎区与输入框。顶部保留“我的待办 / 定时任务”两层业务入口，选中指示线按完整 Tab 居中。
- “我的待办”和“定时任务”标题下不展示副标题介绍；主Tab与下方分类 / 筛选栏间距为20px，不保留原介绍文案的占位。
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
- 已停止的轮次只展示停止状态和“重新生成”入口，不展示完成结果、审批按钮或 Token 数；停止后旧回调不会补出结果，产物预览只读取已完成的回复。可以重试当前轮次，也可以补充要求开始下一轮。
- “查看所有产物”在右侧抽屉展示报告、表格，支持本地预览与返回列表；“查看所有变更”展示范围确认、能力路由、分析步骤及后续追问 / 重生成 / 确认记录。所有抽屉右上角统一使用 24×24px 的纯 X 关闭图标，点击热区保持 32×32px，默认颜色为 #111827，无外围圆圈、底色或描边，悬停时不改变颜色。打开时从右侧滑入（280ms），关闭时向右滑出（220ms），遮罩同步淡入淡出。关闭按钮、Esc 和遮罩点击均等待滑出结束后关闭抽屉并恢复焦点；内部报告 / 列表切换不重复播放动画。系统开启减少动态效果时直接切换。
- 输入“请执行调价方案”等明确执行指令可以查看待确认状态，支持批准并继续、调整方案。提交调整后旧方案不再等待确认。
- 界面已移除“演示”角标和提示文案。回复与 Token 数值使用示例数据，生成、确认均不调用 AI 或写入业务系统；上传仅引用本地文件元信息；刷新后任务和草稿重置。

## 底部账户与管理弹窗

- 侧栏底部上方为部门，下方为人名，内容按用户提供的截图展示。账户信息集中维护在 `app.js` 的 `accountProfile` 中；`avatarUrl` 可接入头像，留空或加载失败时用姓名首字兜底。侧栏和个人信息弹窗保持一致，不读取或写入浏览器个人资料缓存。
- 整个底部账户区域为单一按钮，点击头像、部门、人名、三个点或区域内空白都能切换“个人信息 / 账户管理 / 模型管理 / 退出登录”菜单；折叠侧栏仍可点击。支持 Enter / 空格打开，菜单避开屏幕边缘，支持外部点击、Esc 关闭、上下方向键与 Home / End 导航，关闭弹窗后焦点返回账户区域。
- 个人信息只读展示姓名、产品线、部门和头像。账户管理展示企业专业版、套餐状态、平台 AI 资源总量及三个分类的用量；已用量由分类相加，剩余量和进度条同步计算。
- 模型管理展示 DeepSeek、GLM-5.2、MiniMax-M3 的协议、连接和可用状态，使用真实品牌图标。它们共用输入框的模型数据；原有添加自定义模型功能保留，新添加的模型也出现在管理列表，以“待验证”显示。
- 弹窗沿用当前主题紫、纯白容器和 24px 深色纯 X 关闭图标。本模块只复现截图中的本地展示数据，套餐额度和模型连接状态未查询真实账户或远程服务，不新增购买或个人信息编辑流程。
- 账户菜单底部增加“退出登录”，通过 `1px solid #f0f1f6` 分割线与上方三个信息管理项区分；文字与图标使用红色 `#DC2626`，悬停和键盘聚焦时使用浅红底色。点击后展示确认弹窗，支持取消、Esc 和关闭按钮。当前静态页面没有真实登录会话，确认后提示尚未接入登录服务，不伪造退出成功或清除其他数据。后续可在 `confirm-logout` 分支接入退出接口。

## 区域选择

- 顶部选择框不显示建筑图标，保留下拉箭头；桌面尺寸 320 × 38px，名称文字 14px、字重 600，桌面左边缘为 238px，与展开侧栏时的右侧卡片对齐；折叠侧栏不移动顶部区域选择。框内名称前增加“公司 / 大区”标签，随实际选中范围更新，浏览列表Tab时不改变当前标签。标签为12px / 500、20px高、4px圆角，底色 `#F1F1FF`、文字 `#5552FF`。窄窗口下选择框自适应收缩，保留类型标签，长名称省略；680px 以下名称13px、标签11px，悬停提示与无障碍名称均包含类型和完整名称。
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
├── CHANGELOG.md
├── AI_Hub_视觉规范.md
└── assets/
    ├── AIHubLOGO.svg
    ├── teldhub-mark.svg
    ├── welcome-robot.png
    ├── expert-charging-texture.png # 顶部浅色半透明充电场景纹理
    └── icons/                 # 每个图标一个独立 SVG 文件
        ├── account-models.svg
        ├── analysis-filled.svg
        └── …
```

无构建依赖，无第三方网络请求。顶部导航 Logo 使用用户最新提供的 `阿瓦打我打我的.svg`（600 × 180），保存为 `assets/AIHubLOGO.svg`，保持原始 SVG 内容，整体替换旧图形、品牌文字和副标题。显示高度 44px、等比宽度约 147px，在 60px 顶部导航内垂直居中。补偿原 SVG 左侧自带的约 3.67px 透明留白，使可见图形左缘保持 15px 的左侧内边距。侧栏收起时完整 Logo 保持不变，不再跟随裁切；窄屏也保留完整 Logo，区域选择框按剩余宽度自适应。取消 Logo 下方横线，右侧也不显示竖线。浏览器页签图标采用用户提供的 `ico.svg`（150 × 150），原样保存为 `assets/teldhub-mark.svg`。

## 图标规范

- 图标均保存为 `assets/icons/` 下的独立 SVG 文件，每个都保留图形路径、viewBox 和来源信息，可直接预览或导入设计工具。
- HTML 使用 `<svg class="icon"><use href="./assets/icons/account-models.svg#account-models"></use></svg>` 直接引用对应文件的根 SVG；动态图标通过 `iconUrl(name)` / `iconMarkup(name)` 引用同一目录。每个文件无需依赖其他图标文件或原集合。
- 独立文件继续通过 `currentColor` 继承界面颜色，选中、悬停、禁用等状态保持原样，品牌图标保留自带配色。替换时保留同名文件及根 SVG 的 `id`，即可更新所有引用位置。
- 已清理旧图标集合和未使用的独立图标。后续修改以独立文件为准；Logo 与网页图标维持原有独立 SVG 引用。

界面图标主要选用 [Yesicon 的 Solar 图标库](https://yesicon.app/zh-Hans/solar)：顶部工具、主导航和展开箭头使用 **Linear**，区域选择的选中标记使用 **Bold 面型**；专家 / 员工列表使用 **Bold 填充图标**，白色图形配明亮彩色渐变背景。后续新增图标延续对应场景的样式，不使用原型的近似绘制图标。底部账户使用 36px 圆形头像；无头像或加载失败时显示姓名首字。账户菜单图标继续使用 Solar Bold，DeepSeek 模型使用 Lobe Icons 品牌标识。

故障诊断专家使用 用户提供的 `SolarHeartPulseBold.svg`，对应 [Yesicon / Solar 心形心电图面型图标](https://yesicon.app/zh-Hans/solar/heart-pulse-bold)，保留原始路径，仅将固定灰色填充改为继承界面图标颜色，沿用 CC BY 4.0 授权和 24 × 24 viewBox。侧栏、目录卡片、介绍页、任务执行对象、专家引用和顶部循环同步引用该独立 SVG，青绿色圆形背景保持不变。

“专家能帮你做什么”标题图标来自用户提供的 `MingcuteMessage3AiFill.svg`（MingCute / message-3-ai-fill），本地保存为 `assets/icons/expert-ai-message.svg`，根 SVG 的 id 为 `expert-ai-message`。保留原始路径和 24 × 24 viewBox，内部使用左上至右下的 `#5552FF → #8C52FF` 线性渐变，通过独立 SVG 引用，与“开始任务”按钮渐变保持一致。

列表图标容器为 36 × 36px，使用 50% 圆角形成正圆，内部图标保持 19px。背景采用 145° 轻渐变：蓝 `#4C71F5 → #6AAFFF`、紫 `#6550EC → #9275FA`、橙 `#FF8543 → #FFBC63`、青绿 `#0BBCAF → #4AD8C8`，图标为 `#FFFFFF`。不加高光、内阴影或外部投影；专家和员工列表保持同一配色体系。

作者：**480 Design**。来源：[Solar 原始设计](https://www.figma.com/community/file/1166831539721848736)，授权：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。SVG 数据从 Iconify Solar 集合提取，与 Yesicon 的图标数据来源一致。本地保留原始路径和 24 × 24 画布，按现有界面尺寸缩放并继承颜色，分别保存到 `assets/icons/`。根据界面调整，线性图标的描边由原始 1.5 加粗至 1.8（基于 24 × 24 画布）；白底中性图标默认为 `#344054`，左侧两个主导航入口加深为 `#111827`。账户右侧的更多图标改用同库 Bold 实心版本。

| 位置 | Solar 图标 |
| --- | --- |
| 区域搜索 / 清空 / 已选 | magnifier / close-circle / check-circle-bold（面型勾选） |
| 任务箭头 / 视频入口播放图标 | arrow-right / play-bold |
| 输入框添加 / 文件 / 项目 / 资料库 | add-circle / paperclip / folder / book |
| 通用模型 / 账户模型管理 | box-minimalistic-linear / box-minimalistic-bold |
| 语音 / 发送 / 设置 / 输入框标题 | microphone / arrow-up / settings / stars-bold |
| 生成中的停止按钮 | stop-bold（本地 `assets/icons/composer-stop.svg`，来自 Iconify Solar 集合） |
| 数据查询 / 经营分析 / 趋势诊断 | database / chart-2 / graph-up |
| 智慧定价 / 竞品分析 / 收益测算 | tag-price / radar-2 / calculator |
| 用户运营 / 新客转化 / 流失召回 | users-group-rounded / user-check-rounded / restart-circle |
| 故障诊断 / 离线巡检 / 工单建议 | cpu-bolt / wi-fi-off / clipboard-list |
| 最近任务 / 通知 / 反馈 | history-2 / bell / chat-round-dots |
| 我的待办 / 专家·技能 | checklist-minimalistic / widget-2 |
| 专属专家 / 数字员工 | medal-star / case-round-minimalistic |
| 经营分析 / 智慧价格 | chart-square-bold / tag-price-bold |
| 用户运营 / 设备管理 | users-group-rounded-bold / cpu-bolt-bold |
| 促销运营 / 竞争洞察 | ticket-sale-bold / radar-2-bold |
| 现场服务 / 监控值守 | map-point-wave-bold / monitor-camera-bold |
| 舆情回复 | chat-round-dots-bold |
| 下拉 / 收起侧栏 | alt-arrow-down / alt-arrow-left |
| 账户右侧更多 | menu-dots-bold（实心） |
| 退出登录 | logout-2-bold（面型，`account-logout.svg`） |

未注明 `-bold` 的名称使用 `-linear` 后缀。列表与顶部反馈分别引用独立 SVG 文件，修改列表样式不影响顶部工具；所有图标均在本地加载，不增加运行时网络依赖。TeldHub 品牌标识单独维护，不作为界面功能图标使用。

退出登录图标来自 [Solar / logout-2-bold](https://yesicon.app/zh-Hans/solar/logout-2-bold)，从 [Iconify SVG 接口](https://api.iconify.design/solar/logout-2-bold.svg) 下载后保存为 `assets/icons/account-logout.svg`，使用 CC BY 4.0 授权；页面只引用该本地文件。

车型复盘专家的身份图标使用用户提供的 `TabIcon.svg` 汽车图形，保存为 `vehicle-filled.svg`；保留原始路径与 28×28 viewBox，仅将固定黑色改为 `currentColor`，在身份圆底内显示为白色。三个利益点图标仍来自 Solar（480 Design / CC BY 4.0），通过 Iconify 下载后独立保存；页面无外部图标请求。用户提供的汽车素材不标注为 Solar 来源：

| 本地文件 | 来源 | 用途 |
| --- | --- | --- |
| `vehicle-filled.svg` | 用户提供 `TabIcon.svg` | 车型复盘专家，蓝色圆底＋白色汽车 |
| `benefit-vehicle.svg` | [wheel-bold](https://yesicon.app/zh-Hans/solar/wheel-bold) | 查爱车信息 |
| `benefit-vehicle-auth.svg` | [shield-check-bold](https://yesicon.app/zh-Hans/solar/shield-check-bold) | 看认证状态 |
| `benefit-vehicle-correction.svg` | [pen-new-square-bold](https://yesicon.app/zh-Hans/solar/pen-new-square-bold) | 申请改车型 |

五位专属专家及四个专家团的利益点统一采用 Solar Bold 面型，按 `benefitIcons` 显式映射。专用 `benefit-*.svg` 均已下载对应 Bold 版本，根元素 `data-icon` 记录具体来源；智慧定价、竞品分析、用户运营、促销运营及协同类复用现有本地 `*-filled.svg`。不修改其他场景使用的线型资源，不给利益点图标加圆形底座。

故障诊断专家的利益点采用更简洁的面型：故障诊断使用 `benefit-diagnosis.svg`（[Solar danger-triangle-bold](https://yesicon.app/zh-Hans/solar/danger-triangle-bold)，实心警示三角），离线巡检使用 `benefit-offline.svg`（[Solar cloud-cross-bold](https://yesicon.app/zh-Hans/solar/cloud-cross-bold)，实心离线云）。均为480 Design / CC BY 4.0，通过Iconify下载后本地引用，保留橙色与蓝色。专家身份图标和第三项工单建议保持原样。

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
| 故障诊断专家 | 心形心电图 | solar:heart-pulse-bold |
| 车型复盘专家 | 汽车 | 用户提供 `TabIcon.svg` |
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
- 主色 `#5552FF`，选中浅底 `#F1F1FF`，悬停浅底 `#F7F7FF`，主题浅描边 `#D5D4FF`。统一应用于主导航、专家 / 员工切换、成员选中标题、待办数量和折叠按钮悬停。
- 所有页面统一取消键盘焦点的默认及自定义外描边；搜索区域聚焦时不额外改变边框颜色或增加光圈。组件原有边框、选中与悬停样式保持不变，保留 Tab、方向键、Enter、Esc 及焦点返回等键盘行为。
- 专属专家选中项的最近提问时间使用浅紫色 `#928FE8`，未选中项保持原辅助灰色；数字员工不展示时间。
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
