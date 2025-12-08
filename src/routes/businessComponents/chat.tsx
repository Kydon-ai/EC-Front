import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, ConversationItem } from '../../interface/chatInterface.ts';
import { generate_32_md5 } from '../../utils/uuid/uuid.ts';
import { sendChatRequest } from '../../api/chatApi';

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

	// 对话历史列表
	const [conversationList, setConversationList] = useState<ConversationItem[]>([]);
	// 当前选中的对话ID
	const [selectedConversationId, setSelectedConversationId] = useState<string>('');
	// 侧边栏折叠状态
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
	// 对话历史加载状态
	const [loadingConversations, setLoadingConversations] = useState(false);

	// 消息容器引用，用于自动滚动到底部
	const messagesEndRef = useRef<HTMLDivElement>(null);



	// 自动滚动到底部
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	// 获取对话历史列表
	const fetchConversationList = async () => {
		try {
			setLoadingConversations(true);
			const response = await fetch('/api/llm/conversation/list');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.json();
			if (result.code === 0 && result.data) {
				setConversationList(result.data);
				// 默认选中第一个对话
				if (result.data.length > 0 && !selectedConversationId) {
					setSelectedConversationId(result.data[0].id);
				}
			}
		} catch (error) {
			console.error('Failed to fetch conversation list:', error);
		} finally {
			setLoadingConversations(false);
		}
	};

	// 组件加载时获取对话历史
	useEffect(() => {
		fetchConversationList();
	}, []);

	// 当选中的对话ID变化时，更新聊天历史
	useEffect(() => {
		if (selectedConversationId && conversationList.length > 0) {
			const selectedConversation = conversationList.find(conv => conv.id === selectedConversationId);
			if (selectedConversation) {
				// 将API返回的消息格式转换为聊天界面所需格式
				const formattedMessages: ChatMessage[] = selectedConversation.message.map((msg, index) => {
					// 根据role确定sender，assistant为bot，其他为user
					const sender = msg.role === 'assistant' ? 'bot' : 'user';
					// 使用消息的create_time或当前时间作为时间戳
					const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
					return {
						id: msg.id,
						content: msg.content,
						sender,
						timestamp: time
					};
				});
				setChatHistory(formattedMessages);
			}
		}
	}, [selectedConversationId, conversationList]);

	// 自动滚动到底部
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

	// 新建对话函数
	const handleNewConversation = () => {
		// 生成新的conversation_id
		const newConversationId = generate_32_md5();

		// 创建新对话对象
		const newConversation: ConversationItem = {
			create_date: new Date().toISOString().split('T')[0],
			create_time: Date.now(),
			dialog_id: newConversationId,
			id: newConversationId,
			message: [],
			name: '新对话',
			reference: []
		};

		// 添加到对话列表
		setConversationList(prev => [newConversation, ...prev]);

		// 选中新对话
		setSelectedConversationId(newConversationId);

		// 清空聊天历史
		setChatHistory([]);
	};

	// 删除对话函数
	const handleDeleteConversation = (conversationId: string) => {
		// 从对话列表中移除
		setConversationList(prev => prev.filter(item => item.id !== conversationId));

		// 如果删除的是当前选中的对话
		if (selectedConversationId === conversationId) {
			// 选择第一个对话或者清空选择
			const newSelectedId = conversationList.length > 1 ? conversationList.find(item => item.id !== conversationId)?.id : '';
			setSelectedConversationId(newSelectedId || '');

			// 清空聊天历史
			setChatHistory([]);
		}
	};

	// 发起API请求并处理EventStream响应
	const handleApiRequest = async () => {
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

		// 更新AI回复的函数
		const updateAiResponse = (newContent: string, isComplete: boolean) => {
			// 如果是结束信号且内容为空，保持当前内容不变
			if (isComplete && newContent === '') {
				return;
			}
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

		try {
			// 使用封装的API函数发送聊天请求
			await sendChatRequest(
				{
					conversation_id: "67deffecf4254115bb8c29cd9c0f8134",
					messages: [
						{
							content: "你好！ 我是你的助理，有什么可以帮到你的吗？",
							id: "b2f47ca2-23e0-47bc-a9c9-557689841371",
							role: "assistant"
						},
						{
							id: "806ab24e-d8fe-4079-bca6-0712fa0a1638",
							content: inputValue,
							role: "user",
							files: [],
							conversationId: "67deffecf4254115bb8c29cd9c0f8134",
							doc_ids: []
						}
					]
				},
				updateAiResponse
			);
		} catch (error) {
			console.error('Error:', error);
			// 添加错误消息
			setChatHistory(prev => [
				...prev,
				{
					id: `msg-${Date.now() + 2}`,
					content: `请求失败：${error instanceof Error ? error.message : '未知错误'}`,
					sender: 'bot',
					timestamp: timeString
				}
			]);
		}
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
		<div className="flex h-screen bg-gray-50">
			{/* 左侧对话历史面板 */}
			<div className={`${sidebarCollapsed ? 'w-[60px]' : 'w-72'} border-r border-gray-200 flex flex-col bg-white transition-all duration-300`}>
				{/* 对话历史标题栏 */}
				<div className="p-4 border-b border-gray-200">
					<div className="text-lg font-bold text-gray-800 flex items-center justify-between">
						对话历史
						<button
							className="p-1 hover:bg-gray-200 rounded-md transition-colors"
							onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
							aria-label={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
						>
							{sidebarCollapsed ? '>' : '<'}
						</button>
					</div>
				</div>

				{/* 新建对话按钮 */}
				{!sidebarCollapsed ? (
					<div className="p-2">
						<button
							className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-3 flex items-center justify-center gap-2 transition-colors"
							onClick={handleNewConversation}
						>
							<span>+</span>
							<span>新建对话</span>
						</button>
					</div>
				) : (
					<div className="p-1.5 flex justify-center">
						<button
							className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
							onClick={handleNewConversation}
							title="新建对话"
						>
							+
						</button>
					</div>
				)}

				{/* 对话历史列表 */}
				<div className="flex-1 overflow-y-auto p-2">
					{!sidebarCollapsed && <div className="text-sm font-semibold text-gray-500 mb-2">对话历史列表</div>}
					{loadingConversations ? (
						<div className="p-8 text-center text-gray-500 flex flex-col items-center">
							<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
							<div>加载对话历史...</div>
						</div>
					) : conversationList.length > 0 ? (
						conversationList.map((conversation) => (
							<div
								key={conversation.id}
								className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 relative ${selectedConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm' : 'hover:bg-gray-50'}`}
								onClick={() => setSelectedConversationId(conversation.id)}
							>
								{!sidebarCollapsed && <div className="text-sm font-medium text-gray-800 truncate">{conversation.name}</div>}
								{!sidebarCollapsed && <div className="text-xs text-gray-500 mt-1">{new Date(conversation.create_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>}

								{/* 删除按钮 - 仅在侧边栏展开且鼠标悬停时显示 */}
								{!sidebarCollapsed && (
									<button
										className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors opacity-0 hover:opacity-100"
										onClick={(e) => {
											e.stopPropagation(); // 阻止事件冒泡，避免触发选择对话
											handleDeleteConversation(conversation.id);
										}}
										aria-label="删除对话"
										title="删除对话"
									>
										✕
									</button>
								)}
							</div>
						))
					) : !sidebarCollapsed ? (
						<div className="p-8 text-center text-gray-500 flex flex-col items-center">
							<div className="text-4xl mb-3">💬</div>
							<div>开始一段新对话吧</div>
						</div>
					) : null}
				</div>
			</div>

			{/* 右侧聊天主区域 */}
			<div className="flex-1 flex flex-col">
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
					<div className="space-y-6">
						{chatHistory.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
							>
								{message.sender === 'bot' && (
									<div className="mr-3 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
										🤖
									</div>
								)}
								<div className={`markdown-content max-w-[75%] ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'} rounded-lg p-4 shadow-sm`}>
									<ReactMarkdown rehypePlugins={[rehypeRaw]} >{message.content}</ReactMarkdown>
									<div className={`mt-2 text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'} text-right`}>{message.timestamp}</div>
								</div>
								{message.sender === 'user' && (
									<div className="ml-3 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
										👤
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
					<div className="w-full">
						{/* 消息输入框 */}
						<textarea
							rows={3}
							placeholder="请输入消息..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
							className="resize-none rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 w-full p-2"
						/>

						{/* 按钮区域 - 放在输入框下方右侧 */}
						<div className="flex justify-end gap-3 mt-2">
							<button
								className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
								title="上传文件"
								onClick={() => setShowFileUploadModal(true)}
							>
								📎
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
				{
					showFileUploadModal && (
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
					)
				}
			</div >
		</div >
	);
};

export default ChatApp;