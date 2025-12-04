import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
// 聊天消息类型定义
interface ChatMessage {
	id: string;
	content: string;
	sender: 'user' | 'bot';
	timestamp: string;
}

const ChatApp: React.FC = () => {
	// 导入useNavigate钩子用于路由导航
	const navigate = useNavigate();

	// 模拟聊天历史记录，使用useState管理
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
		{
			id: '1',
			content: '你好！我是AI助手豆包，很高兴为你服务。请问有什么我可以帮助你的吗？',
			sender: 'bot',
			timestamp: '10:30'
		},
		{
			id: '2',
			content: '你好，我想了解一下如何使用React开发一个聊天应用。',
			sender: 'user',
			timestamp: '10:31'
		},
		{
			id: '3',
			content: '使用React开发聊天应用是个不错的选择！我可以为你提供一些基本的开发思路和组件建议。\n\n首先，你需要考虑以下几个方面：\n1. 消息组件设计\n2. 聊天界面布局\n3. 状态管理\n4. 数据持久化\n\n你想了解哪方面的具体内容呢？',
			sender: 'bot',
			timestamp: '10:32'
		}
	]);

	// 输入框内容状态
	const [inputValue, setInputValue] = useState('');

	// 文件上传弹窗状态
	const [showFileUploadModal, setShowFileUploadModal] = useState(false);

	// 消息容器引用，用于自动滚动到底部
	const messagesEndRef = useRef<HTMLDivElement>(null);



	// 自动滚动到底部
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// 当聊天历史更新时滚动到底部
	useEffect(() => {
		scrollToBottom();
	}, [chatHistory]);

	// 发送消息处理函数
	const handleSendMessage = () => {
		if (!inputValue.trim()) return;

		// 获取当前时间
		const now = new Date();
		const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

		// 添加用户消息
		const userMessage: ChatMessage = {
			id: `msg-${Date.now()}`,
			content: inputValue,
			sender: 'user',
			timestamp: timeString
		};

		setChatHistory(prev => [...prev, userMessage]);

		// 清空输入框
		setInputValue('');

		// 显示文件上传弹窗
		// setShowFileUploadModal(true);

		// 延迟添加机器人回复
		setTimeout(() => {
			const botMessage: ChatMessage = {
				id: `msg-${Date.now() + 1}`,
				content: '抱歉，该知识我仍在学习中！',
				sender: 'bot',
				timestamp: timeString
			};
			setChatHistory(prev => [...prev, botMessage]);
		}, 500);
	};

	// 发起API请求并处理EventStream响应
	const handleApiRequest = () => {
		if (!inputValue.trim()) return;
		console.log("发起请求")
		// 获取当前时间
		const now = new Date();
		const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

		// 添加用户消息
		const userMessage: ChatMessage = {
			id: `msg-${Date.now()}`,
			content: inputValue,
			sender: 'user',
			timestamp: timeString
		};

		setChatHistory(prev => [...prev, userMessage]);

		// 清空输入框
		setInputValue('');

		// 创建一个唯一ID用于标识此次AI回复
		const aiMessageId = `msg-${Date.now() + 1}`;

		// 添加一个空的AI消息，用于后续增量更新
		const initialAiMessage: ChatMessage = {
			id: aiMessageId,
			content: '',
			sender: 'bot',
			timestamp: timeString
		};

		setChatHistory(prev => [...prev, initialAiMessage]);

		// 发起请求
		fetch('/api/v1/conversation/completion', {
			method: 'POST',
			headers: {
				'Accept': '*/*',
				'Accept-Language': 'zh-CN,zh;q=0.9',
				'Authorization': 'ImU4OTFlY2FhZDBkYTExZjBhZDNmYmE4NWQ5N2QyYThmIg.aTEq0w.qbgUTTp7aYyhueSljmcDhNSU-GM',
				'Connection': 'keep-alive',
				'Content-Type': 'application/json',
				'Origin': 'http://172.31.136.239:3055',
				'Referer': 'http://172.31.136.239:3055/next-chat/b1c5bf98d0e011f0ad3fba85d97d2a8f?conversationId=67deffecf4254115bb8c29cd9c0f8134&isNew=',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
			},
			body: JSON.stringify({
				"conversation_id": "67deffecf4254115bb8c29cd9c0f8134",
				"messages": [
					{ "content": "你好！ 我是你的助理，有什么可以帮到你的吗？", "role": "assistant" },
					{ "id": "7ec087f7-2b30-49d9-b230-509df026d59d", "content": inputValue, "role": "user", "doc_ids": [] }
				]
			}),
			credentials: 'include'
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				// 获取可读流
				const reader = response.body?.getReader();
				if (!reader) {
					throw new Error('No readable stream');
				}

				const decoder = new TextDecoder('utf-8');
				let buffer = '';

				// 读取流的函数
				const readStream = () => {
					reader.read().then(({ done, value }) => {
						if (done) {
							console.log('Stream ended');
							return;
						}

						// 解码新数据
						buffer += decoder.decode(value, { stream: true });

						// 按行分割数据
						const lines = buffer.split('\n');
						// 保存未完成的行
						buffer = lines.pop() || '';

						// 处理每一行
						lines.forEach(line => {
							// 跳过空行
							if (!line.trim()) return;

							// 移除前缀（如果有）
							if (line.startsWith('data:')) {
								line = line.slice(5);
							}
							console.log("see every line:", line)
							try {
								// 解析JSON
								const responseData = JSON.parse(line);

								// 检查code是否为0表示成功
								if (responseData.code === 0) {
									const data = responseData.data;

									// 检查data是否为true
									if (data === true) {
										// 如果data是true，停止更新
										reader.cancel();
										return;
									} else if (typeof data === 'object' && data !== null && 'answer' in data) {
										// 如果是对象且有answer属性，更新AI回复
										updateAiResponse(data.answer);
									}
								} else {
									// 处理错误情况
									console.error('API error:', responseData.message);
								}
							} catch (error) {
								console.error('Error parsing JSON:', error, 'Line:', line);
							}
						});

						// 继续读取
						readStream();
					});
				};

				// 开始读取流
				readStream();

				// 更新AI回复的函数
				const updateAiResponse = (newContent: string) => {
					setChatHistory(prev => {
						// 找到当前AI消息并更新内容
						return prev.map(msg => {
							if (msg.id === aiMessageId) {
								return {
									...msg,
									content: newContent
								};
							}
							return msg;
						});
					});
				};

			})
			.catch(error => {
				console.error('Error:', error);
				// 添加错误消息
				setChatHistory(prev => [
					...prev,
					{
						id: `msg-${Date.now() + 2}`,
						content: `请求失败：${error.message}`,
						sender: 'bot',
						timestamp: timeString
					}
				]);
			});
	};

	// 关闭文件上传弹窗
	const handleCloseUploadModal = () => {
		setShowFileUploadModal(false);
	};

	// 处理示例提示按钮点击
	const handleTipButtonClick = (tip: string) => {
		setInputValue(tip);
	};

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{/* 聊天应用头部 */}
			<header className="bg-white shadow-md py-3 px-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<button
							className="text-gray-600 hover:text-gray-900 transition-colors"
							onClick={() => navigate(-1)}
							title="返回上一页"
						>
							←
						</button>
						<h1 className="text-xl font-bold text-gray-800">豆包聊天助手</h1>
					</div>
					<div className="flex items-center space-x-3">
						<span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
						<span className="text-sm text-gray-600">在线</span>
					</div>
				</div>
			</header>

			{/* 聊天内容区域 */}
			<main className="flex-1 overflow-y-auto p-6 bg-gray-50">
				<div className="max-w-3xl mx-auto space-y-6">
					{chatHistory.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							{message.sender === 'bot' && (
								<div className="mr-3 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
									AI
								</div>
							)}
							<div className={`max-w-[70%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} rounded-lg p-4 shadow-sm relative`}>
								{message.sender === 'bot' && (
									<div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-blue-100"></div>
								)}
								<div className="whitespace-pre-wrap">{message.content}</div>
								<div className="mt-2 text-xs text-gray-400">{message.timestamp}</div>
							</div>
							{message.sender === 'user' && (
								<div className="ml-3 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
									U
								</div>
							)}
						</div>
					))}
					<div ref={messagesEndRef} />

					<div className="flex justify-center mt-8">
						<div className="flex flex-wrap gap-2">
							{['今天天气怎么样？', '如何学习React？', '推荐一本好书', '帮我写个简历'].map((tip, index) => (
								<button
									key={index}
									className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
									onClick={() => handleTipButtonClick(tip)}
								>
									{tip}
								</button>
							))}
						</div>
					</div>
				</div>
			</main>

			{/* 聊天输入区域 */}
			<footer className="bg-white border-t border-gray-200 p-4">
				<div className="max-w-3xl mx-auto">
					{/* 消息输入框和按钮区域 */}
					<div className="flex items-end gap-3">
						<textarea
							rows={3}
							placeholder="请输入消息..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
							className="resize-none rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 flex-1 p-2"
						/>
						<button
							className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
							title="上传文件"
							onClick={() => setShowFileUploadModal(true)}
						>
							📎
						</button>
						<button
							className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
							onClick={handleSendMessage}
							disabled={!inputValue.trim()}
						>
							→
						</button>
						<button
							className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
							onClick={handleApiRequest}
							disabled={!inputValue.trim()}
							title="发起API请求"
						>
							🚀
						</button>
					</div>

					{/* 文件上传说明 */}
					<div className="text-xs text-gray-400 mt-2">
						支持上传格式：DOCS, TXT, PDF (最大5MB)
					</div>
				</div>
			</footer>

			{/* 文件上传弹窗 */}
			{showFileUploadModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-bold text-gray-800">上传文件</h2>
							<button
								className="text-gray-500 hover:text-gray-700 transition-colors"
								onClick={handleCloseUploadModal}
							>
								×
							</button>
						</div>
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
							<p className="text-gray-500 mb-4">选择或拖拽文件到此处</p>
							<p className="text-sm text-gray-400 mb-4">支持格式：DOCS, TXT, PDF (最大5MB)</p>
							<label className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
								选择文件
								<input
									type="file"
									accept=".doc,.docx,.txt,.pdf"
									className="hidden"
								/>
							</label>
						</div>
						<div className="flex justify-end mt-4">
							<button
								className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
								onClick={handleCloseUploadModal}
							>
								取消
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatApp;