# 代码风格规范文档

## 1. 项目概述

本项目是一个基于React 18、TypeScript、Vite和Tailwind CSS构建的前端应用。

主要技术栈：
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.1
- Tailwind CSS 4.1.17
- Ant Design 6.0.0
- React Router 6.26.1
- Zustand 5.0.8

## 2. 文件命名规范

### 2.1 组件文件
- 使用 PascalCase 命名（大驼峰命名法）
- 示例：`Home.tsx`, `TopMenu.tsx`, `AuthGuard.tsx`
- 功能相关组件可放置在相应子目录中

### 2.2 工具类文件
- 使用小驼峰命名法（camelCase）
- 示例：`win.tsx`, `utils.ts`

### 2.3 样式文件
- 组件样式文件与组件同名，使用 `.css` 扩展名
- 全局样式使用 `Layout.css`
- Tailwind CSS 类直接在组件中使用

## 3. 代码格式化规范

### 3.1 缩进
- 使用 Tab 键进行缩进（根据ESLint配置）
- `switch` 语句中 `case` 子句相对于 `switch` 缩进1个Tab

### 3.2 引号
- JavaScript/TypeScript 字符串使用双引号 ("")
- JSX 属性使用双引号

### 3.3 分号
- 语句结束必须使用分号

### 3.4 空行
- 不同逻辑块之间使用空行分隔
- 导入语句分组后使用空行分隔
- 组件定义前后使用空行

## 4. TypeScript 规范

### 4.1 类型声明
- 为所有变量、函数参数和返回值添加明确类型
- 使用接口定义复杂对象结构
- 避免使用 `any` 类型（在实际生产环境中应开启相关ESLint规则）

### 4.2 接口命名
- 使用 PascalCase 并以 `I` 开头（可选）
- 示例：`interface UserInfo { ... }`

### 4.3 枚举命名
- 使用 PascalCase
- 枚举值使用全大写加下划线

## 5. React 组件规范

### 5.1 组件类型
- 使用函数式组件（推荐使用箭头函数形式）
- 优先使用Hooks而非类组件

### 5.2 组件结构
```tsx
import React, { useState, useEffect } from 'react';

interface ComponentProps {
  // 属性定义
}

const ComponentName: React.FC<ComponentProps> = (props) => {
  // 状态定义
  // 副作用
  // 事件处理
  // 渲染逻辑
  return (
    <div>
      {/* JSX内容 */}
    </div>
  );
};

export default ComponentName;
```

### 5.3 Hooks 使用
- 遵循Hooks规则（只在顶层调用Hooks，只在函数组件中调用Hooks）
- 自定义Hook以 `use` 开头

### 5.4 JSX 规范
- 组件属性过多时，每行放置一个属性
- 自闭合组件使用 `<Component />` 格式
- 为所有DOM元素添加适当的 `key` 属性（在列表中）
- 避免在JSX中编写复杂逻辑，抽离到组件外部或使用自定义Hook

## 6. 路由配置规范

### 6.1 路由定义
- 在 `main.tsx` 中集中定义路由
- 使用 `Routes` 和 `Route` 组件
- 受保护路由使用 `AuthGuard` 组件包裹

### 6.2 路由路径
- 使用小写字母和连字符（kebab-case）
- 示例：`/about-project`, `/concat-me`

## 7. 状态管理规范（Zustand）

### 7.1 Store 定义
- 每个Store独立文件，放置在 `src/store` 目录
- 使用 `create` 函数创建Store
- 为Store状态定义接口

### 7.2 Store 使用
- 使用 `useStore` Hook访问状态
- 避免在组件中直接修改Store，使用Store提供的方法

## 8. CSS/Tailwind 规范

### 8.1 Tailwind CSS 使用
- 优先使用Tailwind类进行样式设计
- 避免在组件中编写内联样式（除非必要）
- 使用语义化的Tailwind类组合

### 8.2 自定义CSS
- 必要时创建自定义样式文件
- 使用BEM或类似命名约定
- 全局样式放置在 `Layout.css` 中

## 9. 导入导出规范

### 9.1 导入顺序
1. React及相关库
2. UI组件库（如Ant Design）
3. 路由相关
4. 样式文件
5. 自定义组件
6. 工具函数和上下文

### 9.2 导出方式
- 默认导出用于主要组件
- 命名导出用于辅助函数和类型定义

## 10. 注释规范

### 10.1 代码注释
- 为复杂逻辑添加注释说明
- 组件使用JSDoc注释说明其用途和属性

### 10.2 文件头部注释
- 重要文件添加文件用途说明
- 示例：
```tsx
/**
 * AuthGuard 组件
 * 用于保护需要认证的路由
 */
```

## 11. 最佳实践

### 11.1 性能优化
- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useCallback` 和 `useMemo` 优化函数和计算值
- 懒加载大型组件

### 11.2 错误处理
- 添加适当的错误边界
- 异步操作添加加载状态和错误处理

### 11.3 可访问性
- 为所有交互元素添加适当的ARIA属性
- 确保颜色对比度符合WCAG标准

## 12. 代码审查标准

### 12.1 必须检查项
- 代码是否符合TypeScript类型检查
- 是否遵循命名规范
- 组件结构是否清晰
- 代码是否存在明显性能问题
- 是否添加了必要的注释

### 12.2 禁止项
- 禁止使用 `any` 类型（特殊情况需说明）
- 禁止在组件中编写复杂业务逻辑
- 禁止直接操作DOM（除非必要）

## 13. 构建和部署

### 13.1 开发流程
- 使用 `pnpm dev` 启动开发服务器
- 代码提交前运行 `pnpm lint` 检查代码规范
- 使用 `pnpm build` 构建生产版本

### 13.2 代码提交信息
- 使用清晰的提交信息
- 参考格式：`类型: 描述`
- 类型包括：feat, fix, docs, style, refactor, test, chore

---

本规范基于项目当前配置和最佳实践制定，团队成员应严格遵守。如有特殊情况需要调整，应经过团队讨论决定。