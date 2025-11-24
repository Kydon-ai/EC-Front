import { useDispatch, useSelector } from "react-redux";
import { Button } from '@arco-design/web-react';
import { GlobalState } from "../store/store";
import { increment, decrement } from "../store/demoSlice";
export default function ShowDemo() {
	const count = useSelector((state: GlobalState) => state.demo.myCount);
	const dispatch = useDispatch();
	function handleUp() {
		console.log("up");
		dispatch(increment());
	}

	function handleDown() {
		console.log("doen");
		dispatch(decrement());
	}

	return (
		<>
			<div>demo全局状态handleUp计数：{count}</div>
			<Button type='primary' onClick={handleUp}>增加</Button>
			<Button onClick={handleDown}>减少</Button>
		</>
	);
}
