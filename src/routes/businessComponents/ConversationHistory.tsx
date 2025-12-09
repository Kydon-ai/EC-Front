import React from 'react';
import { ConversationItem } from '../../interface/chatInterface.ts';
import { getConversationDetail } from '../../api/chatApi';
import { generate_32_md5 } from '../../utils/uuid/uuid.ts';
import { ChatMessage } from '../../interface/chatInterface.ts';

interface ConversationHistoryProps {
	conversationList: ConversationItem[];
	selectedConversationId: string;
	sidebarCollapsed: boolean;
	loadingConversations: boolean;
	onSelectConversation: (id: string, messages: ChatMessage[]) => void;
	onNewConversation: () => void;
	onDeleteConversation: (id: string) => void;
	onToggleSidebar: () => void;
	isMobile: boolean;
	isMobileSidebarOpen: boolean;
	onCloseMobileSidebar: () => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
	conversationList,
	selectedConversationId,
	sidebarCollapsed,
	loadingConversations,
	onSelectConversation,
	onNewConversation,
	onDeleteConversation,
	onToggleSidebar,
	isMobile,
	isMobileSidebarOpen,
	onCloseMobileSidebar
}) => {
	const handleConversationClick = async (conversation: ConversationItem) => {
		try {
			const detail = await getConversationDetail(conversation.id);
			if (detail) {
				// 将message数组转换为chatHistory格式
				const messages: ChatMessage[] = detail.message.map((msg) => ({
					id: msg.id,
					content: msg.content,
					sender: msg.role === 'assistant' ? 'bot' : 'user',
					timestamp: new Date(detail.update_time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
				}));
				onSelectConversation(conversation.id, messages);

				// 移动端选择对话后自动关闭侧边栏
				if (isMobile) {
					onCloseMobileSidebar();
				}
			}
		} catch (error) {
			console.error('Failed to load conversation detail:', error);
		}
	};

	return (
		<div className={`${sidebarCollapsed ? 'w-[60px]' : 'w-72'} border-r border-gray-200 flex flex-col bg-white transition-all duration-300 fixed z-40 h-full shadow-lg transform ${isMobile ? (isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'relative translate-x-0'}`}>
			{/* 对话历史标题栏 */}
			<div className="p-4 border-b border-gray-200">
				<div className="text-lg font-bold text-gray-800 flex items-center justify-between">
					{sidebarCollapsed ? '' : '对话历史'}
					<button
						className="p-1 hover:bg-gray-200 rounded-md transition-colors"
						onClick={onToggleSidebar}
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
						onClick={onNewConversation}
					>
						<span>+</span>
						<span>新建对话</span>
					</button>
				</div>
			) : (
				<div className="p-1.5 flex justify-center">
					<button
						className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
						onClick={onNewConversation}
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
							onClick={() => handleConversationClick(conversation)}
						>
							{!sidebarCollapsed && <div className="text-sm font-medium text-gray-800 truncate">{conversation.name}</div>}
							{!sidebarCollapsed && <div className="text-xs text-gray-500 mt-1">{new Date(conversation.create_time).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>}

							{/* 删除按钮 - 仅在侧边栏展开且鼠标悬停时显示 */}
							{!sidebarCollapsed && (
								<button
									className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors opacity-0 hover:opacity-100"
									onClick={(e) => {
										e.stopPropagation(); // 阻止事件冒泡，避免触发选择对话
										onDeleteConversation(conversation.id);
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
	);
};

export default ConversationHistory;