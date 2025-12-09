import { Button } from 'antd';
import { useCounterStore } from '../store/ZuTest';
export default function ShowDemo() {
	const { count, increment, decrement } = useCounterStore();

	return (
		<>
			<div>Zustand全局计数：{count}</div>
			<Button type="primary" onClick={increment}>
				增加
			</Button>
			<Button onClick={decrement}>减少</Button>
		</>
	);
}
