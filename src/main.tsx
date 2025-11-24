import { FC, StrictMode, useRef } from "react";
import { createRoot } from "react-dom/client";

import Home from "./routes/Home.tsx";
import FooterCopyright from "./routes/FooterCopyRight.tsx";
import 'prismjs/themes/prism.css'; // 你可以选择其他主题，如 'prism-okaidia.css', 'prism-dark.css' 等
// 注入redux缓存
import { Provider } from "react-redux";

// redux
import { globalStore, persistor } from './store/store'; // 引入刚才创建的 store

// 添加路由
import { createBrowserRouter, RouterProvider,BrowserRouter, Routes, Route } from "react-router-dom";
import { FloatButton } from 'antd';
import { PersistGate } from "redux-persist/integration/react";
import TopMenu from "./routes/topMenu.tsx";
import ShowDemo from "./routes/demo.tsx";
// 主页导航栏数据
const items = [
	{
		key: 'home',
		label: '主页',
	},
	{
		key: 'about-project',
		label: '关于项目',
	},
	{
		key: 'concat-me',
		label: '作者详情',
	},
	{
		key: 'friend-chain',
		label: '网站友链',
	},
];

import AboutAuthor from "./routes/normal/AboutAuthor.tsx"
import AboutProject from "./routes/normal/AboutProject.tsx"
import ConcatMe from "./routes/normal/ConcatMe.tsx"
import FriendChain from "./routes/normal/FriendChain.tsx";
import { WindowSizeProvider } from "./utils/windowContext/win.tsx";


createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter >
			<Provider store={globalStore}>
				<PersistGate loading={null} persistor={persistor}>
					<WindowSizeProvider>
						<div className="layout">
							<header className="header" style={{}}>
								<TopMenu items={items}></TopMenu>
							</header>
							<main className="content">
									<div style={{minHeight: "100vh",  backgroundColor: "darkgray"}}>
									{/* <App /> */}
									<div style={{maxWidth:'800px',margin:'auto',}}>
										<Routes>
											<Route path="/" element={<Home/>} />
											<Route path="/home" element={<Home />} />
											<Route path="/demo" element={<ShowDemo />} />
											
											<Route path="/about-project" element={<AboutProject />} />
											{/* <Route path="/about-author" element={<AboutAuthor />} /> */}
											<Route path="/concat-me" element={<ConcatMe />} />
											<Route path="/friend-chain" element={<FriendChain />} />
										</Routes>
									</div>
									<FloatButton.BackTop />
									</div>
							</main>
							<footer className="footer" style={{minHeight: "10vh"}}>
								<FooterCopyright></FooterCopyright>
							</footer>
						</div>
					</WindowSizeProvider>
				</PersistGate>
			</Provider>
		</BrowserRouter>
	</StrictMode>
);
