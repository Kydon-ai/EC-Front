# 青训营专属改造模板目标

React Template——基于 Antd 开发的原生 React 开箱即用开发模板

> 目标技术栈： React18、React Router、zustand、Antd、TailWind CSS、TS

# 一、运行说明

## 1.1项目使用node版本

node version 18.18.2

## 1.2项目指令说明

| 序号 | 指令                           | 作用                       | 备注                    |
| ---- | ------------------------------ | -------------------------- | ----------------------- |
| 1    | pnpm run dev 或 pnpm run start | 运行项目                   | 无                      |
| 2    | pnpm run start:dev             | 以dev环境运行项目          | 可选值：dev、test、prod |
| 3    | pnpm run build:test            | 使用test环境打包项目       | 可选值：dev、test、prod |
| 4    | pnpm run format                | 格式化项目                 | 无                      |
| 4    | pnpm run lints                 | 检验项目ESLint风格规范     | 无                      |
| 4    | pnpm run preview               | 启动本地服务器查看打包效果 | 无                      |

## 1.2环境变量注入

将自己再ragflow后端的32位用户ID注入.env文件中

# 二、文档记录

## 技术栈文档

~~[Arco Design]:(https://arco.design/react/docs/start)~~ <br>
[AntD]:(https://ant.design/components/overview-cn/) <br>
[React]：(https://zh-hans.react.dev/learn) <br>
[React Router V6]:(https://reactrouter.remix.org.cn/home) <br>
[TypeScript]:(https://typescript.bootcss.com/) <br>
[Zustand]:(https://zustand.nodejs.cn/) <br>
[Zustand-ZH]:(https://ouweiya.github.io/zustand-zh/) <br>
[Tailwind CSS]:(https://www.tailwindcss.cn/docs/installation) <br>

## 使用到的小工具

[png 在线转 ico]:(https://www.aconvert.com/cn/icon/png-to-ico/) <br>

# 三、开发 OKR

## 滚动开发目标

-[√] 1) 首屏优化（不要再控制台开启禁用缓存，后续再进行进一步优化） <br>

-[√] 2) 后端技术选型——NodeJS + MongoDB <br>

-[√] 3) RAG 的基本方案——RAGFlow <br>

-[√] 4) 前端样式模块化选型——TailWindCSS 样式组 <br>

-[√] 5) Pretty + ESLint(暂时先使用 ESLint + IDE 根据 ESLint 的方案进行格式化) <br>

## 最后冲刺功能点

-[√] 1) RAGFlow 接口整合到后端 <br>

-[√] 2) 实现 RAG 参考内容引用 <br>

-[√] 3) 历史对话信息展示 <br>

-[√] 4) Eharts 后台数据管理 <br>

-[X] 5) PlayRight 自动更新数据源 <br>

-[X] 6) RAGFlow 配置多模态解析（可选） <br>

-[X] 7) 接入阿里云 TTS 服务 <br>
