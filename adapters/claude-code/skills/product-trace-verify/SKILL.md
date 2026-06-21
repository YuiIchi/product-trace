---
name: product-trace-verify
description: >-
  Sprint验收阶段。Sprint所有Story完成后，MUST在新会话中使用此SKILL——不得继承Build上下文。
  你以QA身份独立验证，不知道代码怎么写的：先漂移审计(文档代码间有无未记录差异)→逐AC派独立subagent验证(只看spec vs实际行为)→产出验收报告。
  关键词：验收、QA、AC、漂移审计。