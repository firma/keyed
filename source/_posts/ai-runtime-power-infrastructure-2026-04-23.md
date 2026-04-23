---
title: 这一轮 AI 真正的新中心，不是模型更强，而是开始争夺运行时、算力与电力基础设施
date: 2026-04-23 00:18:00
categories:
  - AI资讯
  - 行业观察
  - 基础设施
tags:
  - AI
  - Runtime
  - Infrastructure
  - AWS
  - OpenAI
  - Anthropic
  - NVIDIA
  - Singapore
  - Ai2
  - Compute
  - Power
description: 最近这一轮官方信号真正收敛出的中心，不是谁又发了更强模型，而是 AI 正在迅速变成一套与运行时、算力、电力和国家部署能力绑定的基础设施体系。
---

如果还用“又有新模型、又有新功能”来理解最近这轮 AI 动态，我觉得已经有点慢了。

把这两天几家关键公司和官方机构的信号放在一起看，更值得记住的变化其实是另一件事：

> **AI 正在从一个可以被分发的软件能力，变成一套必须绑定运行时、算力、电力和国家部署能力的基础设施。**

这不是修辞。

它意味着，下一阶段的竞争重点，正在从“谁的模型更强”，切到“谁控制 AI 运行所需的真实底座”。这个底座不只是 GPU，还包括 stateful runtime、芯片路线、云接入、供电体系、产业组织方式，以及国家层面的部署能力。

## 先说结论

这一轮最值得抓住的，不是单个产品，而是 4 个同时出现的收敛信号：

- **AWS 和 OpenAI** 在把 AI 从 stateless 调用推向 stateful runtime，说明模型正在被重新定义为长期运行系统的一部分。
- **Anthropic** 在把 frontier AI 的供给逻辑直接推进到 multiple gigawatts 级别，说明算力已经不是后台资源，而是战略主轴。
- **NVIDIA** 开始把 AI factory 和电网调度、能源资产写进同一套叙事里，说明 AI 的约束条件正式进入电力层。
- **新加坡政府** 明确说自己的优势不在做最大 frontier model，而在更快、更可信地组织部署 AI，这说明国家竞争也在从“追模型”转向“建运行体系”。

把这些点合起来看，真正的新中心是：

> **AI 行业开始从模型竞争，进入运行权竞争。**

谁掌握运行环境，谁就更接近下一阶段的核心价值。

## 一，AWS 和 OpenAI 在做的，不只是合作，而是在定义 AI 的“状态化运行”

AWS 4 月 22 日关于和 OpenAI 的新合作解释得很直白。

官方说法是，双方会共同打造一个 **Stateful Runtime Environment**。这套环境允许 AI agent：

- 保持上下文
- 记住之前做过的工作
- 跨工具和数据源持续执行
- 访问计算资源
- 在生产级应用里不必每次都从零开始

这件事比“模型上架 Bedrock”重要得多。

因为过去的大模型，大多数时候都更像一次性调用。你发一个请求，它给你一个回答，调用结束，状态也基本结束。即便外挂 memory，本质上也还是在外面补。

但如果 runtime 本身变成 stateful，意义就不同了。

这意味着 AI 不再只是被请求一次的模型，而是逐渐变成一种可持续运行的系统部件。它开始更像：

- 一个长期工作的 agent
- 一个带记忆和身份的工作线程
- 一个能进入企业流程的执行单元
- 一个真正可以接住复杂项目过程的运行环境

换句话说，AI 的竞争已经不再只是模型层，而是在往 **runtime layer** 下沉。

以后真正难替代的东西，未必只是某个模型名字，而可能是这套模型运行在什么环境里，能调什么资源，是否带状态，是否能和企业已有基础设施无缝接上。

## 二，Anthropic 把 multiple gigawatts 写进官方新闻，说明算力已经从资源问题变成结构问题

Anthropic 最近的官方更新也很关键。

4 月中旬，Anthropic 宣布和 Google、Broadcom 签下新的协议，准备拿到 **multiple gigawatts of next-generation TPU capacity**，并预计从 2027 年开始上线。官方还特别强调，绝大部分新增算力会部署在美国。

这里最值得注意的，不只是量大，而是叙事变了。

过去说 AI 基础设施，大家还容易停留在：

- GPU 紧张
- 芯片贵
- 训练成本高
- 云资源不够

但当一家 frontier lab 开始用 **gigawatt** 这个量级来描述自己的下一阶段能力建设时，AI 基础设施就已经不能再被理解成普通 IT 采购了。

它更接近的是：

- 工业级供给组织
- 国家级资源配置
- 长周期资本开支
- 对电力、园区、芯片与云伙伴的协同锁定

Anthropic 在同一篇官方材料里还强调，Claude 同时运行在 AWS Trainium、Google TPU、NVIDIA GPU 这些不同硬件平台上，并且仍通过 AWS、Google Cloud、Microsoft Azure 三大云分发。

这说明 frontier lab 现在真正追求的，不只是“拿到更多卡”，而是：

> **把自己嵌进多芯片、多云、多地域的运行网络里，形成韧性和议价能力。**

所以这一轮变化背后，算力不再只是成本项，而已经变成平台结构本身。

## 三，NVIDIA 已经不再只卖算力，它在把 AI 工厂写进电力系统

如果说 Anthropic 暴露的是算力供给问题，那 NVIDIA 最近几篇官方稿件则更进一步，把 AI 的边界直接推进到能源系统。

NVIDIA 在 3 月底和 4 月的官方材料里连续强调两个方向。

第一，是 **NVLink Fusion** 这类合作，继续把 AI 基础设施推向更开放但仍围绕 NVIDIA 的异构生态。它不只是卖 GPU，而是在组织一个可以容纳 custom XPU、网络、光互连和 AI-RAN 的大底座。

第二，更值得重视的是，NVIDIA 和 Emerald AI 以及多家能源公司共同提出 **flexible AI factories as grid assets**。官方原话已经非常清楚，AI factories 不只是耗电设施，还可以作为支持电网的灵活能源资产来设计。

这句话其实非常重。

因为它意味着，AI 数据中心的逻辑正在发生一个深层变化：

过去大家问的是，AI 会不会把电网压垮。

现在领先的基础设施公司开始问的是，能不能把 AI 工厂直接设计成电网体系的一部分，让算力部署、储能、桥接供电和电网响应一起规划。

这说明 AI 产业已经进入一个新阶段：

> **约束 frontier AI 的，不再只是模型能力和芯片数量，还包括电力接入速度、负荷弹性和能源协同能力。**

当一个行业开始同时讨论 token、机架、功率曲线和电网资产，它就已经不是普通软件行业了。

## 四，新加坡给出的官方信号很清楚，国家不一定追最大模型，但一定要抢部署组织权

国家层面也出现了相当一致的变化。

新加坡 2026 年预算和政府官方材料里，有几个表述非常值得记住。

第一，新加坡明确说：自己的优势 **不在于建最大的 frontier model**，而在于更快、更负责、更有组织地部署 AI。

第二，政府宣布：

- 从 2025 到 2030 再投 **超过 10 亿新元** 做国家 AI 研究与开发计划
- 推出新的 **National AI Missions**
- 用 **National AI Impact Programme** 支持未来三年 **10,000 家企业** 和 **100,000 名工作者** 提升 AI 采用与实践能力

这套思路非常成熟。

它不是把国家资源砸到“我们也要做一个最大的通用模型”这条最昂贵的路上，而是把重点放在：

- 研究能力
- 产业 adoption
- 人才供给
- 可信规则
- 重点行业的系统化部署

这说明政府对 AI 竞争的理解也在升级。

> **国家层面的 AI 竞争，不一定是谁先造出最强模型，而是谁更快把 AI 变成真正可部署、可吸收、可扩散的国家能力。**

这和云厂商、基础设施公司最近的动作，其实是同一条线。

## 五，Ai2 的开放路线，也在补“运行世界”而不只是补模型

Ai2 最近两条官方更新，看起来没有那么喧闹，但我反而觉得很有代表性。

一条是 **evaluating agents for scientific discovery**，说明 agent 开始被认真放进科学发现这种高价值任务里评测，而不是只拿来做表面 demo。

另一条是 **open, simulation-first stack for physical AI**，强调先在仿真环境里建立能力，再把它转到真实机器人上。

Ai2 这类信号的重要性在于，它提醒我们：

AI 的下一阶段基础设施，不只是在云和数据中心，也包括：

- benchmark
- simulation
- scientific workflow
- open tooling
- 对真实世界任务的验证环境

也就是说，所谓运行权，不只是“在哪个云上跑”，还包括“在什么世界模型里训练、评测和迁移”。

## 六，真正的新中心，是 AI 从“被购买的软件”变成“被争夺的运行权”

把 AWS、OpenAI、Anthropic、NVIDIA、新加坡、Ai2 这些信号放在一起，最近这轮全球 AI 最值得写的一句话，我会这样概括：

> **AI 正在从一种可购买的软件能力，变成一种必须被组织、供电、调度、审计和持续运行的基础设施能力。**

这句话会带来几个很现实的后果。

### 1. 模型分数依然重要，但越来越不是全部

以后模型好不好，不只体现在 benchmark，也体现在：

- 能否进入 stateful runtime
- 能否低成本长期运行
- 能否接住企业权限、记忆、工具和计算
- 能否在不同芯片和不同云之间形成韧性

### 2. AI 公司的核心竞争，会更像基础设施公司

未来真正强的 AI 公司，不只是会训练模型，还要会：

- 拿算力
- 拿能源
- 拿云入口
- 建运行时
- 建安全和治理机制
- 进入国家与行业的正式部署体系

### 3. 国家竞争会越来越像“组织能力竞争”

新加坡这种路径说明得很清楚。

国家不一定都去复制 OpenAI、Anthropic、Google DeepMind，但都会越来越关心：

- 我们有没有自己的研究能力
- 我们能不能吸引和锁住算力与人才
- 我们能不能让企业大规模采用
- 我们能不能定义可信部署规则

## 结语

如果说前一阶段 AI 行业最核心的问题是“模型够不够强”，那最近这轮信号说明，问题已经变成了：

> **谁能让这些模型稳定地、低成本地、长期地、可信地跑在真实世界里。**

这就是为什么我觉得，最近真正的新中心不是模型发布，而是运行时、算力和电力基础设施。

因为当一个产业开始同时争夺 memory、identity、compute、grid access 和 national deployment，它就已经不再只是软件行业的一条新赛道了。

它开始更像这个时代新的基础设施层。

---

## 参考来源

- Anthropic News, Claude Design by Anthropic Labs: https://www.anthropic.com/news/claude-design-anthropic-labs
- Anthropic News, partnership with Google and Broadcom for multiple gigawatts of compute: https://www.anthropic.com/news/google-broadcom-partnership-compute
- About Amazon, Amazon’s investment in OpenAI: https://www.aboutamazon.com/news/aws/openai-amazon-partnership-explained
- About Amazon, Stateful Runtime Environment with OpenAI: https://www.aboutamazon.com/news/aws/amazon-bedrock-openai-gpt-models-ai-agents
- NVIDIA Newsroom, flexible AI factories as grid assets: https://nvidianews.nvidia.com/news/nvidia-and-emerald-ai-join-leading-energy-companies-to-pioneer-flexible-ai-factories-as-grid-assets
- NVIDIA Newsroom, NVLink Fusion ecosystem with Marvell: https://nvidianews.nvidia.com/news/nvidia-ai-ecosystem-expands-as-marvell-joins-forces-through-nvlink-fusion
- Singapore Budget 2026, Harness AI As A Strategic Advantage: https://www.singaporebudget.gov.sg/budget-speech/budget-statement/c-harness-ai-as-a-strategic-advantage
- MDDI Singapore, over S$1 billion National AI R&D Plan: https://www.mddi.gov.sg/newsroom/singapore-invests-over-s-1-billion-in-national-ai-research-and-development-plan-to-strengthen-ai-research-capabilities-and-our-position-as-global-ai-hub/
- IMDA, National AI Impact Programme: https://www.imda.gov.sg/resources/press-releases-factsheets-and-speeches/factsheets/2026/national-ai-impact-programme
- Ai2 News: https://allenai.org/news
