import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { vitePluginForArco } from '@arco-plugins/vite-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0', // 监听所有网络接口
		// port: 5173,      // 指定端口号（可选）
		proxy: {
			// 配置代理，解决跨域问题
			// '/api': {
			// 	target: 'http://172.31.136.239:3055', // 目标服务器地址
			// 	changeOrigin: true, // 允许跨域
			// 	rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，将/api前缀去掉
			// },
			// 本地RAG API代理
			'/api': {
				target: 'http://localhost:3000', // 本地RAG服务器地址
				changeOrigin: true, // 允许跨域
				// 不需要重写路径，因为/api/rag已经包含在目标路径中
			},
		},
	},
})
