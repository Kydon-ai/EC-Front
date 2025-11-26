// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. 引入 persist 中间件

export const useCounterStore = create(
	persist( // 2. 使用 persist 包裹状态创建器
		(set, get) => ({
			count: 0,
			increment: () => set((state) => ({ count: state.count + 1 })),
			decrement: () => set((state) => ({ count: state.count - 1 })),
		}),
		{ // 3. 配置持久化选项
			name: 'counter-storage', // 存储在 localStorage 中的键名
			getStorage: () => localStorage, // 指定使用 localStorage（默认就是它，可省略）
		}
	)
);