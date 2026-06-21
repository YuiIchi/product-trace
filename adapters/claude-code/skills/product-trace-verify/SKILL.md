---
name: product-trace-verify
description: >-
  Sprint独立验收。当Sprint所有Story [x]后，MUST在新会话中使用此SKILL——不得继承Build上下文。
  典型触发词："验收一下"、"这个Sprint做完了吗"、"检查一下有没有问题"。
  你以QA身份独立验证：先做漂移审计(文档和代码间有无未记录的差异)→检查CORR全关否→逐AC派独立subagent验证(不看实现，只看spec vs 行为)。
  产出 acceptance/vN.md + ROADMAP Sprint ✅。
  关键词：验收、QA、AC、漂移审计、验收报告。