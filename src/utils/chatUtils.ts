/**
 * 聊天相关工具函数
 */

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @param setCopyMessage 设置复制消息的函数 (可选)
 * @returns Promise<boolean> 复制是否成功
 */
export const copyToClipboard = async (text: string, setCopyMessage?: React.Dispatch<React.SetStateAction<string | null>>): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		if (setCopyMessage) {
			setCopyMessage('复制成功！');
			// 3秒后自动隐藏提示
			setTimeout(() => setCopyMessage(null), 3000);
		}
		console.log('文本已复制到剪贴板');
		return true;
	} catch (err) {
		if (setCopyMessage) {
			setCopyMessage('复制失败');
			setTimeout(() => setCopyMessage(null), 3000);
		}
		console.error('复制失败:', err);
		return false;
	}
};

/**
 * 格式化时间为 HH:MM 格式
 * @param date Date对象或时间戳
 * @returns 格式化后的时间字符串
 */
export const formatTime = (date: Date | number): string => {
	const d = typeof date === 'number' ? new Date(date) : date;
	return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

/**
 * 格式化日期时间为 YYYY-MM-DD HH:MM 格式
 * @param date Date对象或时间戳
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (date: Date | number): string => {
	const d = typeof date === 'number' ? new Date(date) : date;
	return d.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	});
};

/**
 * Markdown内容样式
 */
export const markdownStyles = `
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
}`;