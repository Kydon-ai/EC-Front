import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage, ConversationItem } from '../../interface/chatInterface.ts';
import { generate_32_md5 } from '../../utils/uuid/uuid.ts';
import { sendChatRequest, getConversationDetail } from '../../api/chatApi';
import ConversationHistory from './ConversationHistory';
import ChatMain from './ChatMain';
import FileUploadModal from './FileUploadModal';


const ChatApp: React.FC = () => {
	// 导入useNavigate钩子用于路由导航
	const navigate = useNavigate();

	// 对话历史列表
	const [conversationList, setConversationList] = useState<ConversationItem[]>([]);
	// 当前选中的对话ID
	const [selectedConversationId, setSelectedConversationId] = useState<string>('');
	// 侧边栏折叠状态
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	// 聊天历史记录
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
	// API请求状态管理
	const [isRequestLoading, setIsRequestLoading] = useState(false);
	// 请求控制器，用于取消请求
	const requestControllerRef = useRef<{ cancel: () => void } | null>(null);

	// 消息容器引用，用于自动滚动到底部
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// 复制文本到剪贴板
	const [copyMessage, setCopyMessage] = useState<string | null>(null);

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

	// 选择对话函数
	const handleSelectConversation = (conversationId: string, messages: ChatMessage[]) => {
		// 选中对话
		setSelectedConversationId(conversationId);
		// 更新聊天历史
		setChatHistory(messages);
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

	// 切换侧边栏状态
	const handleToggleSidebar = () => {
		setSidebarCollapsed(prev => !prev);
	};

	// 关闭文件上传弹窗
	const handleCloseUploadModal = () => {
		setShowFileUploadModal(false);
	};

	return (
		<div className="flex h-screen bg-gray-50">
			{/* 左侧对话历史面板 */}
			<ConversationHistory
				conversationList={conversationList}
				selectedConversationId={selectedConversationId}
				sidebarCollapsed={sidebarCollapsed}
				loadingConversations={loadingConversations}
				onSelectConversation={handleSelectConversation}
				onNewConversation={handleNewConversation}
				onDeleteConversation={handleDeleteConversation}
				onToggleSidebar={handleToggleSidebar}
			/>

			{/* 右侧聊天主区域 */}
			<ChatMain
				navigate={navigate}
				chatHistory={chatHistory}
				setChatHistory={setChatHistory}
				inputValue={inputValue}
				setInputValue={setInputValue}
				isRequestLoading={isRequestLoading}
				setIsRequestLoading={setIsRequestLoading}
				requestControllerRef={requestControllerRef}
				messagesEndRef={messagesEndRef}
				copyMessage={copyMessage}
				setCopyMessage={setCopyMessage}
				setShowFileUploadModal={setShowFileUploadModal}
				sendChatRequest={sendChatRequest}
				selectedConversationId={selectedConversationId}
			/>

			{/* 文件上传弹窗 */}
			<FileUploadModal
				showFileUploadModal={showFileUploadModal}
				handleCloseUploadModal={handleCloseUploadModal}
			/>
		</div>
	);
};

export default ChatApp;