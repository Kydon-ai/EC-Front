import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

// Markdown样式
const markdownStyles = `
/* 确保有序列表显示正确的序号 */
.markdown-content ol {
  list-style-type: decimal !important;
  padding-left: 2rem !important;
  margin: 1rem 0 !important;
}

/* 确保无序列表显示正确的符号 */
.markdown-content ul {
  list-style-type: disc !important;
  padding-left: 2rem !important;
  margin: 1rem 0 !important;
}

/* 确保列表项正确显示 */
.markdown-content li {
  display: list-item !important;
  margin-bottom: 0.5rem;
}
`;
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

	// 注入Markdown样式
	useEffect(() => {
		const style = document.createElement('style');
		style.textContent = markdownStyles;
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	// 模拟聊天历史记录，使用useState管理
	const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
		{
			id: '1',
			content: "根据知识库内容，商品信息是指商家在平台内以各种形式向消费者展示的、关于所销售商品的描述[ID:2]。具体包括：\n\n1.  **定义**：商品信息是商家在店铺页面、商品详情页面、推广页面、客服聊天工具等任何向消费者展示的场景中，以文字、图片、音频、视频等形式，对所销售商品本身（如基本属性、所属类目、规格、数量、保质期等）、品牌、外包装、发货情况、交易附带物等信息所做的明示或暗示的描述[ID:2]。\n\n2.  **构成部分**：根据规范要求，完整的商品信息通常涵盖以下方面：\n    *   **标题**：需包含品牌、品名、基本属性和规格参数等[ID:3]。\n    *   **类目与属性**：需根据商品实际属性选择正确类目并填写相关属性[ID:6]。\n    *   **品牌与资质**：若涉及品牌信息，需提供相应的品牌资质[ID:6]。\n    *   **主图**：必须为清晰展示商品主体的实物图，且需包含多角度及细节图[ID:4]。\n    *   **商品详情**：需包含图片，不可仅为文本；需明示赠品信息；对食品、化妆品等特定品类需明示保质期[ID:0]。\n    *   **价格**：设置时应遵守平台的价格管理规则[ID:0]。\n    *   **SPU/SKU**：用于定义和管理商品的聚合信息及最小销售单元[ID:0]。\n\n3.  **核心要求**：商家在发布商品信息时，必须遵循真实、完整和一致的基本原则[ID:1]。即信息需真实有效且及时更新；主要信息（如品牌介绍、生产日期、规格等）应完整无缺失；且在标题、属性、主图等各个版块中的描述要素需保持一致[ID:1]。",
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
		fetch('/api/rag/conversation/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"conversation_id": "67deffecf4254115bb8c29cd9c0f8134",
				"messages": [
					{
						"content": "你好！ 我是你的助理，有什么可以帮到你的吗？",
						"id": "b2f47ca2-23e0-47bc-a9c9-557689841371",
						"role": "assistant"
					},
					{
						"id": "806ab24e-d8fe-4079-bca6-0712fa0a1638",
						"content": inputValue,
						"role": "user",
						"files": [],
						"conversationId": "67deffecf4254115bb8c29cd9c0f8134",
						"doc_ids": []
					}
				]
			})
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
				let isProcessing = false;

				// 读取流的函数
				const readStream = () => {
					reader.read().then(({ done, value }) => {
						if (done) {
							console.log('Stream ended');
							// 尝试解析剩余的缓冲数据
							processData(buffer);
							return;
						}

						// 解码新数据
						buffer += decoder.decode(value, { stream: true });

						// 处理数据
						processData(buffer);

						// 继续读取
						readStream();
					});
				};

				// 处理数据的函数
				const processData = (dataBuffer: string) => {
					// 防止重复处理
					if (isProcessing) return;
					isProcessing = true;

					try {
						// 按行分割数据
						const lines = dataBuffer.split('\n');

						// 遍历所有行
						let processedLines = 0;
						let tempBuffer = '';

						for (let i = 0; i < lines.length; i++) {
							let line = lines[i];

							// 跳过空行
							if (!line.trim()) continue;

							// 如果这行是新的SSE事件开始
							if (line.startsWith('data:')) {
								// 处理之前累积的tempBuffer（如果有的话）
								if (tempBuffer) {
									try {
										const responseData = JSON.parse(tempBuffer);
										processResponse(responseData);
										tempBuffer = '';
										processedLines = i;
									} catch (error) {
										// 如果解析失败，保留tempBuffer，继续累积
										console.log('Incomplete JSON, continuing to accumulate:', error.message);
										break;
									}
								}

								// 移除'data:'前缀
								line = line.slice(5).trim();

								// 累积到tempBuffer
								tempBuffer += line;
							} else if (tempBuffer) {
								// 如果已经在累积一个事件的数据，继续添加
								tempBuffer += line;
							}
						}

						// 尝试解析最后一个累积的事件
						if (tempBuffer) {
							try {
								const responseData = JSON.parse(tempBuffer);
								processResponse(responseData);
								tempBuffer = '';
								processedLines = lines.length;
							} catch (error) {
								// 如果解析失败，保留在tempBuffer中
								console.log('Incomplete JSON at end, keeping in buffer:', error.message);
							}
						}

						// 更新缓冲区，只保留未处理的行
						if (processedLines < lines.length) {
							buffer = lines.slice(processedLines).join('\n');
						} else {
							buffer = '';
						}
					} finally {
						isProcessing = false;
					}
				};

				// 处理解析后的响应数据
				const processResponse = (responseData: any) => {
					console.log('Processed response:', responseData);

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
							<div className={`markdown-content max-w-[70%] ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'} rounded-lg p-4 shadow-sm relative`}>
								{message.sender === 'bot' && (
									<div className="absolute -top-1 -right-1 h-3 w-3 bg-white rounded-full border-2 border-blue-100"></div>
								)}
								<ReactMarkdown rehypePlugins={[rehypeRaw]} >{message.content}</ReactMarkdown>
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