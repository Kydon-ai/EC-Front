import request from '../utils/https/request';

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
export const sendChatRequest = async (
  requestData: ChatMessageRequest,
  onResponse: StreamResponseCallback
): Promise<void> => {
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
      console.log('Processed response:', responseData);

      // 检查code是否为0表示成功
      if (responseData.code === 0) {
        const data = responseData.data;

        // 检查data是否为true
        if (data === true) {
          // 如果data是true，停止更新
          reader.cancel();
          onResponse('', true);
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

  } catch (error) {
    console.error('Error:', error);
    onResponse('', true, (error as Error).message);
  }
};
