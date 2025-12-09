// request.ts
type RequestInterceptor = (config: RequestInit & { url: string }) => Promise<RequestInit & { url: string }> | (RequestInit & { url: string });
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;

function getAuthToken() {
	return "test_token"
}
class Request {
	private baseURL: string;
	private defaultHeaders: HeadersInit;
	private requestInterceptors: RequestInterceptor[] = [];
	private responseInterceptors: ResponseInterceptor[] = [];

	constructor(baseURL = "", defaultHeaders: HeadersInit = {}) {
		this.baseURL = baseURL;
		this.defaultHeaders = defaultHeaders;
	}

	// 添加请求拦截器
	useRequest(interceptor: RequestInterceptor) {
		this.requestInterceptors.push(interceptor);
	}

	// 添加响应拦截器
	useResponse(interceptor: ResponseInterceptor) {
		this.responseInterceptors.push(interceptor);
	}

	private async _fetch(url: string, options: RequestInit = {}) {
		// 当body是FormData时，不设置默认的Content-Type，让浏览器自动处理
		const isFormData = options.body instanceof FormData;

		// 创建请求配置
		let config: RequestInit & { url: string } = {
			url: this.baseURL + url,
			method: options.method || "GET",
			body: options.body,
		};

		// 处理headers
		const headers: Record<string, string> = {
			// 明确指定使用UTF-8编码，避免中文文件名乱码
			'accept-charset': 'utf-8'
		};

		// 复制默认headers
		if (this.defaultHeaders) {
			for (const [key, value] of Object.entries(this.defaultHeaders)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		// 复制options中的headers
		if (options.headers) {
			for (const [key, value] of Object.entries(options.headers)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		// 添加Authorization头（如果还没有的话）
		if (!headers["authorization"]) {
			headers["authorization"] = `Bearer ${getAuthToken()}`;
		}

		// 只有当不是FormData时才添加Content-Type为application/json
		if (!isFormData && !headers["content-type"]) {
			headers["content-type"] = "application/json";
		}

		// 将headers添加到配置中
		config.headers = headers;

		// 请求拦截器
		for (const interceptor of this.requestInterceptors) {
			config = await interceptor(config);
		}

		let response = await fetch(config.url, config);

		// 响应拦截器
		for (const interceptor of this.responseInterceptors) {
			response = await interceptor(response);
		}

		// 默认返回 JSON
		return response.json();
	}

	get(url: string, headers?: HeadersInit) {
		return this._fetch(url, { method: "GET", headers });
	}

	post(url: string, data?: any, headers?: HeadersInit) {
		return this._fetch(url, {
			method: "POST",
			body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
			headers,
		});
	}

	put(url: string, data?: any, headers?: HeadersInit) {
		return this._fetch(url, {
			method: "PUT",
			body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
			headers,
		});
	}

	delete(url: string, headers?: HeadersInit) {
		return this._fetch(url, { method: "DELETE", headers });
	}

	options(url: string, headers?: HeadersInit) {
		return this._fetch(url, { method: "OPTIONS", headers });
	}

	/**
	 * 发起请求并返回原始Response对象（用于处理流式响应等）
	 * @param url 请求URL
	 * @param options 请求选项
	 * @returns Promise<Response> 原始响应对象
	 */
	async stream(url: string, options: RequestInit = {}): Promise<Response> {
		// 当body是FormData时，不设置默认的Content-Type，让浏览器自动处理
		const isFormData = options.body instanceof FormData;

		// 创建请求配置
		let config: RequestInit & { url: string } = {
			url: this.baseURL + url,
			method: options.method || "GET",
			body: options.body,
		};

		// 处理headers
		const headers: Record<string, string> = {
			// 明确指定使用UTF-8编码，避免中文文件名乱码
			'accept-charset': 'utf-8'
		};

		// 复制默认headers
		if (this.defaultHeaders) {
			for (const [key, value] of Object.entries(this.defaultHeaders)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		// 复制options中的headers
		if (options.headers) {
			for (const [key, value] of Object.entries(options.headers)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		// 添加Authorization头（如果还没有的话）
		if (!headers["authorization"]) {
			headers["authorization"] = `Bearer ${getAuthToken()}`;
		}

		// 只有当不是FormData时才添加Content-Type为application/json
		if (!isFormData && !headers["content-type"]) {
			headers["content-type"] = "application/json";
		}

		// 将headers添加到配置中
		config.headers = headers;

		// 请求拦截器
		for (const interceptor of this.requestInterceptors) {
			config = await interceptor(config);
		}

		let response = await fetch(config.url, config);

		// 响应拦截器
		for (const interceptor of this.responseInterceptors) {
			response = await interceptor(response);
		}

		// 返回原始Response对象
		return response;
	}
}

// 导出一个单例
const request = new Request(import.meta.env.VITE_API_BASE_URL);

// 使用示例
request.useRequest(async (config) => {
	// 只在没有Authorization头时添加
	if (!config.headers) {
		config.headers = {};
	}
	if (!config.headers["Authorization"] && !config.headers["authorization"]) {
		config.headers["Authorization"] = `Bearer ${getAuthToken()}`;
	}
	return config;
});

request.useResponse(async (response) => {
	const status = response.status;
	if (!response.ok) {
		console.log("查看错误状态码：", status);

		// 尝试解析错误响应，但兼容非JSON格式
		let errorData = {};
		try {
			// 检查响应是否是JSON格式
			const contentType = response.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				errorData = await response.json();
			} else {
				// 如果不是JSON，获取文本内容
				const text = await response.text();
				errorData = { message: text || "请求失败" };
			}
		} catch (error) {
			// 如果解析失败，使用默认错误信息
			errorData = { message: "请求失败" };
		}

		throw new Error(errorData.message || "请求失败");
	}
	console.log("查看正确状态码：", status)
	return response;
});

export default request;
