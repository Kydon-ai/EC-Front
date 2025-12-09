import { ChatMessage } from '../../interface/chatInterface';
import { sendChatRequest, setConversation } from '../../api/chatApi';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { copyToClipboard, generateUUID } from '../../utils/chatUtils';
import { markdownStyles } from '../../utils/chatUtils';

// 处理消息内容，将[ID:\d+]格式的引用标记转换为HTML
/* 
注意：span元素是内联元素，不能直接包含块级元素（如div）。浏览器在解析这种不符合规范的HTML时，会自动调整结构，将块级元素移出内联元素。

*/
const processMessageContent = (content: string) => {
	// 匹配[ID:\d+]格式的正则表达式
	const refRegex = /\[ID:(\d+)\]/g;
	// 将[ID:\d+]替换为带有特殊样式的HTML
	return content.replace(refRegex, (match, id) => {
		return `<span class="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs cursor-pointer hover:bg-blue-200 transition-colors relative ref-tag" title="查看引用文档 ID: ${id}">
                ${id} 
                <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 transition-opacity duration-200 pointer-events-none whitespace-nowrap block">
                    引用文档 ID: ${id}
                </span>
            </span>`;
	});
};

interface ChatMainProps {
	navigate: any;
	chatHistory: ChatMessage[];
	setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
	inputValue: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
	isRequestLoading: boolean;
	setIsRequestLoading: React.Dispatch<React.SetStateAction<boolean>>;
	requestControllerRef: React.MutableRefObject<{ cancel: () => void } | null>;
	messagesEndRef: React.RefObject<HTMLDivElement>;
	copyMessage: string | null;
	setCopyMessage: React.Dispatch<React.SetStateAction<string | null>>;
	setShowFileUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
	sendChatRequest: any;
	selectedConversationId: string;
	onUpdateConversationName: (conversationId: string, newName: string) => void;
	latestCreatedConversationId: string | null;
	onToggleSidebar: () => void;
	isMobile: boolean;
	isMobileSidebarOpen: boolean;
}

const ChatMain: React.FC<ChatMainProps> = ({
	navigate,
	chatHistory,
	setChatHistory,
	inputValue,
	setInputValue,
	isRequestLoading,
	setIsRequestLoading,
	requestControllerRef,
	messagesEndRef,
	copyMessage,
	setCopyMessage,
	setShowFileUploadModal,
	sendChatRequest,
	selectedConversationId,
	onUpdateConversationName,
	latestCreatedConversationId,
	onToggleSidebar,
	isMobile,
	isMobileSidebarOpen
}) => {
	// 消息悬停状态管理
	const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

	// 自动滚动到底部
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

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

	// 发起API请求并处理EventStream响应
	const handleApiRequest = async () => {
		// 如果已经有请求在进行中，点击则取消
		if (isRequestLoading && requestControllerRef.current) {
			requestControllerRef.current.cancel();
			setIsRequestLoading(false);
			requestControllerRef.current = null;
			return;
		}

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
		// 设置请求状态为loading
		setIsRequestLoading(true);

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
		const updateAiResponse = (newContent: string, isComplete: boolean, error?: string) => {
			// 如果是结束信号且内容为空，保持当前内容不变
			if (isComplete && newContent === '') {
				// 请求完成或取消，重置loading状态
				setIsRequestLoading(false);
				requestControllerRef.current = null;
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

			// 如果请求完成，重置loading状态
			if (isComplete) {
				setIsRequestLoading(false);
				requestControllerRef.current = null;
			}
		};

		try {
			// 检查是否是新对话
			const isNewConversation = chatHistory.length === 0;
			let conversationId = selectedConversationId;

			// 如果是新对话，调用setConversation接口创建会话
			if (isNewConversation) {
				// 使用从chat.tsx传递过来的最新创建的对话ID，而不是重新生成
				if (!latestCreatedConversationId) {
					console.error("无法获取最新创建的对话ID");
					return;
				}

				conversationId = latestCreatedConversationId;

				// 调用setConversation接口
				await setConversation({
					conversation_id: latestCreatedConversationId,
					name: inputValue, // 使用用户发送的问题作为会话名称
					user_id: import.meta.env.VITE_USER_ID || '' // 使用环境变量中的USER_ID
				});

				// 更新侧边栏对话名称为用户的第一个提问内容
				onUpdateConversationName(latestCreatedConversationId, inputValue);
			}

			// 使用封装的API函数发送聊天请求
			const controller = await sendChatRequest(
				{
					conversation_id: conversationId,
					messages: [
						{
							id: "806ab24e-d8fe-4079-bca6-0712fa0a1638",
							content: inputValue,
							role: "user",
							files: [],
							conversationId: conversationId,
							doc_ids: []
						}
					]
				},
				updateAiResponse
			);

			// 保存请求控制器
			requestControllerRef.current = controller;
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
			// 请求失败，重置loading状态
			setIsRequestLoading(false);
			requestControllerRef.current = null;
		}
	};

	// 处理示例提示按钮点击
	const handleTipButtonClick = (tip: string) => {
		setInputValue(tip);
	};



	return (
		<div className="flex-1 flex flex-col">
			{/* 注入Markdown样式 */}
			<style dangerouslySetInnerHTML={{ __html: markdownStyles }} />
			{/* 引用标记悬停样式 */}
			<style dangerouslySetInnerHTML={{
				__html:
					`.ref-tag:hover span {
					opacity: 1;
				}`
			}} />
			{/* 聊天应用头部 */}
			<header className="bg-white shadow-md py-3 px-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						{/* 移动端侧边栏控制按钮 */}
						{isMobile && (
							<button
								className="text-gray-600 hover:text-gray-900 transition-colors"
								onClick={onToggleSidebar}
								title="切换侧边栏"
							>
								☰
							</button>
						)}
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
					{chatHistory.map((message, index) => (
						<div
							key={`${index}-${message.id}`}
							className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 relative group`}
							onMouseEnter={() => setHoveredMessageId(message.id)}
							onMouseLeave={() => setHoveredMessageId(null)}
							onDoubleClick={() => copyToClipboard(message.content, setCopyMessage)}
						>
							{message.sender === 'bot' && (
								<div className="mr-3 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
									🤖
								</div>
							)}
							<div className={`markdown-content max-w-[75%] min-w-[100px] ${message.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'} rounded-lg p-4 shadow-sm relative`}>
								<ReactMarkdown rehypePlugins={[rehypeRaw]}>{processMessageContent(message.content)}</ReactMarkdown>
								<div className={`mt-2 text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'} text-right`}>{message.timestamp}</div>

								{/* 复制按钮 - 仅在悬停时显示 */}
								<button
									className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${message.sender === 'user' ? 'text-blue-100 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
									onClick={() => copyToClipboard(message.content, setCopyMessage)}
									title="复制消息"
								>
									📋
								</button>

								{/* 双击提示 - 仅在悬停时显示 */}
								<div className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
									双击复制
								</div>
							</div>
							<div className={message.sender === 'user' ? 'ml-3 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shadow-sm' : ''}>
								{message.sender === 'user' && '👤'}
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />

					{/* 复制成功提示 - 移动到页面上半部分 */}
					{copyMessage && (
						<div className="fixed top-1/8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg opacity-90 transition-opacity z-50">
							{copyMessage}
						</div>
					)}

					{/* 示例提示 */}
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
				<div className="w-full rounded-xl border border-gray-300 p-3">
					{/* 消息输入框 */}
					<textarea
						rows={3}
						placeholder="请输入消息..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !isRequestLoading) { e.preventDefault(); handleApiRequest(); } }}
						className="resize-none border-none focus:outline-none focus:ring-0 w-full p-2"
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
							className={`p-3 text-white rounded-full transition-colors ${isRequestLoading ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
							onClick={handleApiRequest}
							disabled={!inputValue.trim() && !isRequestLoading}
							title={isRequestLoading ? "停止接收更新" : "发起API请求"}
						>
							{isRequestLoading ? "⏹️" : "🚀"}
						</button>
					</div>

					{/* 文件上传说明 */}
					<div className="text-xs text-gray-400 mt-2">
						支持上传格式：DOCS, TXT, PDF (最大5MB)
					</div>
				</div>
			</footer>
			{/* 移动端侧边栏遮罩层 */}
			{
				isMobile && isMobileSidebarOpen && (
					<div
						className="fixed inset-0 bg-black bg-opacity-50 z-30"
						onClick={onToggleSidebar}
					/>
				)
			}
		</div>


	);
};

export default ChatMain;