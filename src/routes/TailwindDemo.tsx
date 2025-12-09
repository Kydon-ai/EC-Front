import React from 'react';

const TailwindDemo: React.FC = () => {
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<header className="text-center mb-16">
					<h1 className="text-4xl font-extrabold text-gray-900 mb-4">
						Tailwind CSS 示例页面
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						这个页面展示了Tailwind CSS的各种功能，包括布局、颜色、间距、排版等。
					</p>
				</header>

				{/* 颜色示例 */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
						颜色示例
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{[
							{ color: 'blue', text: '蓝色' },
							{ color: 'green', text: '绿色' },
							{ color: 'red', text: '红色' },
							{ color: 'purple', text: '紫色' },
							{ color: 'yellow', text: '黄色' },
							{ color: 'indigo', text: '靛蓝' },
							{ color: 'pink', text: '粉色' },
							{ color: 'teal', text: '青色' },
						].map((item, index) => (
							<div
								key={index}
								className={`bg-${item.color}-500 text-white p-6 rounded-lg text-center transform transition duration-300 hover:scale-105 hover:shadow-lg`}
							>
								<div className="font-bold text-lg">{item.text}</div>
								<div className="text-sm opacity-80">bg-{item.color}-500</div>
							</div>
						))}
					</div>
				</section>

				{/* 卡片示例 */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
						卡片组件
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[
							{
								title: '响应式设计',
								desc: 'Tailwind CSS提供了强大的响应式工具，让你的网站在任何设备上都能完美展示。',
								icon: '📱',
							},
							{
								title: '可定制性',
								desc: '通过配置文件可以轻松定制颜色、字体、间距等，满足项目的独特需求。',
								icon: '🎨',
							},
							{
								title: '原子化CSS',
								desc: '基于实用优先的原则，提供了丰富的原子类，让你能够快速构建UI。',
								icon: '⚡',
							},
						].map((card, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100"
							>
								<div className="p-6">
									<div className="text-4xl mb-4">{card.icon}</div>
									<h3 className="text-xl font-bold text-gray-800 mb-2">
										{card.title}
									</h3>
									<p className="text-gray-600">{card.desc}</p>
								</div>
								<div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
									<button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
										了解更多
										<svg
											className="w-4 h-4 ml-1"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									</button>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* 表单示例 */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
						表单元素
					</h2>
					<div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto">
						<form>
							<div className="mb-6">
								<label
									htmlFor="name"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									姓名
								</label>
								<input
									type="text"
									id="name"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="请输入您的姓名"
								/>
							</div>

							<div className="mb-6">
								<label
									htmlFor="email"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									电子邮箱
								</label>
								<input
									type="email"
									id="email"
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="请输入您的电子邮箱"
								/>
							</div>

							<div className="mb-6">
								<label
									htmlFor="message"
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									留言
								</label>
								<textarea
									id="message"
									rows={4}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="请输入您的留言"
								></textarea>
							</div>

							<div className="flex items-center mb-6">
								<input
									type="checkbox"
									id="terms"
									className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								/>
								<label
									htmlFor="terms"
									className="ml-2 block text-sm text-gray-700"
								>
									我同意所有条款和条件
								</label>
							</div>

							<div className="flex space-x-4">
								<button
									type="button"
									className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
								>
									取消
								</button>
								<button
									type="submit"
									className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
								>
									提交
								</button>
							</div>
						</form>
					</div>
				</section>

				{/* 布局示例 */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
						布局示例
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="md:col-span-2">
							<div className="h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white flex items-center justify-center">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-2">主要内容区</h3>
									<p>占据2/3宽度（中等屏幕及以上）</p>
								</div>
							</div>
						</div>
						<div>
							<div className="h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg p-8 text-white flex items-center justify-center">
								<div className="text-center">
									<h3 className="text-2xl font-bold mb-2">侧边栏</h3>
									<p>占据1/3宽度（中等屏幕及以上）</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 响应式网格 */}
				<section className="mb-16">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
						响应式网格
					</h2>
					<p className="text-gray-600 mb-6">
						在小屏幕上每行显示2个，中等屏幕上每行显示3个，大屏幕上每行显示4个：
					</p>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{Array(12)
							.fill(0)
							.map((_, index) => (
								<div
									key={index}
									className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex items-center justify-center"
								>
									<span className="text-gray-500 font-medium">
										项目 {index + 1}
									</span>
								</div>
							))}
					</div>
				</section>

				{/* 自定义组件 */}
				<section>
					<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
						<span className="w-3 h-3 bg-teal-500 rounded-full mr-2"></span>
						自定义样式组
					</h2>
					<div className="space-y-4">
						{/* 自定义按钮样式组 */}
						<div>
							<h3 className="text-lg font-medium text-gray-700 mb-3">
								按钮样式组
							</h3>
							<div className="flex flex-wrap gap-3">
								<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
									主按钮
								</button>
								<button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
									成功按钮
								</button>
								<button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
									危险按钮
								</button>
								<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
									次要按钮
								</button>
								<button className="px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
									边框按钮
								</button>
							</div>
						</div>

						{/* 卡片样式组 */}
						<div>
							<h3 className="text-lg font-medium text-gray-700 mb-3">
								卡片样式组
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
									<h4 className="font-bold text-gray-800 mb-2">简单卡片</h4>
									<p className="text-gray-600">
										包含基本的卡片样式，有边框和内边距。
									</p>
								</div>
								<div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow">
									<h4 className="font-bold text-gray-800 mb-2">阴影卡片</h4>
									<p className="text-gray-600">
										包含阴影效果，使卡片更有层次感。
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<footer className="text-center mt-20 text-gray-500 text-sm">
					<p>
						© {new Date().getFullYear()} Tailwind CSS 示例页面 | 使用 React 和
						Tailwind CSS 构建
					</p>
				</footer>
			</div>
		</div>
	);
};

export default TailwindDemo;
