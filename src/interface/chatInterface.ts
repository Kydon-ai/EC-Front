// 聊天消息类型定义
interface ChatMessage {
	id: string;
	content: string;
	// sender: 'user' | 'bot';
	role: 'user' | 'assistant';
	timestamp: string;
}

// 对话历史项类型定义
interface ConversationItem {
	create_date: string;
	create_time: number;
	dialog_id: string;
	id: string;
	message: Array<{
		content: string;
		id: string;
		role: string;
		conversationId?: string;
		doc_ids?: string[];
		files?: any[];
	}>;
	name: string;
	reference?: any[];
}

export type { ChatMessage, ConversationItem };
