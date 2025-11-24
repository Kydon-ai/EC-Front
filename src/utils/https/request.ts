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

  constructor(baseURL = "", defaultHeaders: HeadersInit = { "Content-Type": "application/json" }) {
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
    let config: RequestInit & { url: string } = {
      url: this.baseURL + url,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getAuthToken()}`, // 携带登录Token，通过后端权限校验
        ...this.defaultHeaders,
        ...(options.headers || {}) // 调用时的 headers 覆盖默认 headers
      },
      body: options.body,
    };

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
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  put(url: string, data?: any, headers?: HeadersInit) {
    return this._fetch(url, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      headers,
    });
  }

  delete(url: string, headers?: HeadersInit) {
    return this._fetch(url, { method: "DELETE", headers });
  }

  options(url: string, headers?: HeadersInit) {
    return this._fetch(url, { method: "OPTIONS", headers });
  }
}

// 导出一个单例
const request = new Request(import.meta.env.VITE_API_BASE_URL);

// 使用示例
request.useRequest(async (config) => {
  // 请求前加 token
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${getAuthToken()}`
  };
  return config;
});

request.useResponse(async (response) => {
  const status = response.status;
  if (!response.ok) {
    console.log("查看错误状态码：",status)
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "请求失败");
  }
  console.log("查看正确状态码：",status)
  return response;
});

export default request;
