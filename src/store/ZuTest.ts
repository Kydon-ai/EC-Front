// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. 引入 persist 中间件
// 定义状态类型
interface CounterState {
	count: number;
	increment: () => void;
	decrement: () => void;
}
export const useCounterStore = create<CounterState>()(
	persist(
		// 2. 使用 persist 包裹状态创建器
		(set, get) => ({
			count: 0,
			increment: () => set(state => ({ count: state.count + 1 })),
			decrement: () => set(state => ({ count: state.count - 1 })),
		}),
		{
			// 3. 配置持久化选项
			name: 'counter-storage', // 存储在 localStorage 中的键名
			// eslint-disable-next-line
			// @ts-ignore
			getStorage: () => localStorage, // 很奇怪，官网的示例用法为什么也报错
		}
	)
);
