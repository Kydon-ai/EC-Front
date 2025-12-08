import request from '../utils/https/request';

// 对话详情数据结构接口
export interface ConversationDetail {
	avatar: string;
	create_date: string;
	create_time: number;
	dialog_id: string;
	id: string;
	message: Array<{
		content: string;
		id: string;
		role: string;
		files?: any[];
		conversationId?: string;
		doc_ids?: string[];
	}>;
	name: string;
	reference: any[];
	update_date: string;
	update_time: number;
	user_id: string;
}

// 定义API响应类型
interface ApiResponse {
	code: number;
	message?: string;
	data: any;
}

// 定义聊天消息类型
interface ChatMessageRequest {
	conversation_id: string;
	messages: Array<{
		content: string;
		id: string;
		role: string;
		files?: any[];
		conversationId?: string;
		doc_ids?: string[];
	}>;
}

// 流式响应处理回调类型
type StreamResponseCallback = (
	content: string,
	isComplete: boolean,
	error?: string
) => void;

/**
 * 发起聊天请求（流式响应）
 * @param requestData 请求数据
 * @param onResponse 响应处理回调函数
 * @returns Promise<void>
 */
/**
 * 获取对话详情
 * @param conversationId 对话ID
 * @returns Promise<ConversationDetail | null>
 */
export const getConversationDetail = async (conversationId: string): Promise<ConversationDetail | null> => {
	try {
		// 使用request.get方法发起GET请求
		const response = await request.get(`/api/llm/conversation/get?conversation_id=${conversationId}`);

		if (response.code === 0 && response.data) {
			return response.data;
		}
		return null;
	} catch (error) {
		console.error('获取对话详情失败:', error);
		return null;
	}
};

/**
 * 发起聊天请求（流式响应）
 * @param requestData 请求数据
 * @param onResponse 响应处理回调函数
 * @returns Promise<{ cancel: () => void }> 返回一个包含取消方法的对象
 */
export const sendChatRequest = async (
	requestData: ChatMessageRequest,
	onResponse: StreamResponseCallback
): Promise<{ cancel: () => void }> => {
	try {
		// 使用request工具的stream方法发起请求
		const response = await request.stream('/api/rag/conversation/completion', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestData)
		});

		// 获取可读流
		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error('No readable stream');
		}

		const decoder = new TextDecoder('utf-8');
		let buffer = '';
		let isProcessing = false;
		let isCancelled = false;

		// 取消请求的函数
		const cancel = () => {
			if (!isCancelled && reader) {
				isCancelled = true;
				reader.cancel();
				// 通知完成，保持当前渲染的回答不变
				onResponse('', true);
			}
		};

		// 读取流的函数
		const readStream = () => {
			if (isCancelled) return;
			
			reader.read().then(({ done, value }) => {
				if (done || isCancelled) {
					if (!isCancelled) {
						console.log('Stream ended');
						// 尝试解析剩余的缓冲数据
						processData(buffer);
					}
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
			if (isCancelled) return;
				
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
								const responseData: ApiResponse = JSON.parse(tempBuffer);
								processResponse(responseData);
								tempBuffer = '';
								processedLines = i;
							} catch (error) {
								// 如果解析失败，保留tempBuffer，继续累积
								console.log('Incomplete JSON, continuing to accumulate:', (error as Error).message);
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
						const responseData: ApiResponse = JSON.parse(tempBuffer);
						processResponse(responseData);
						tempBuffer = '';
						processedLines = lines.length;
					} catch (error) {
						// 如果解析失败，保留在tempBuffer中
						console.log('Incomplete JSON at end, keeping in buffer:', (error as Error).message);
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
		const processResponse = (responseData: ApiResponse) => {
			if (isCancelled) return;
						
			console.log('Processed response:', responseData);

			// 检查code是否为0表示成功
			if (responseData.code === 0) {
				const data = responseData.data;

				// 检查data是否为true
				if (data === true) {
					// 如果data是true，停止更新
					cancel();
					return;
				} else if (typeof data === 'object' && data !== null && 'answer' in data) {
					// 如果是对象且有answer属性，更新AI回复
					onResponse(data.answer, false);
				}
			} else {
				// 处理错误情况
				console.error('API error:', responseData.message);
				onResponse('', true, responseData.message);
			}
		};

		// 开始读取流
		readStream();

		// 返回包含取消方法的对象
		return { cancel };

	} catch (error) {
		console.error('Error:', error);
		onResponse('', true, (error as Error).message);
		// 返回一个空的取消函数
		return { cancel: () => {} };
	}
};
