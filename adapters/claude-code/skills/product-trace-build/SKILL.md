---
name: product-trace-build
description: >-
  Sprint开发实现。当执行手册(spec.md)就绪时，MUST 使用此SKILL。
  典型触发词："开始写代码"、"实现Story-001"、"继续开发"。
  你将：按spec Task逐项开发——先写测试→确认失败→最小实现→确认通过→重构→每Story完成后自检spec还准吗→派subagent做spec合规+代码质量双审查→更新ROADMAP checkbox [x]。
  若所有Story都[x]了，不要用我——引导去 /product-trace-verify(新会话)。
  发现spec不准时触发 /product-trace-correct。
  关键词：TDD、实现、开发、测试、checkbox、代码审查。