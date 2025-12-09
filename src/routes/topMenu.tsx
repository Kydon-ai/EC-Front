// TopMenu.tsx
import React, { useState } from 'react';
import { Button, Dropdown, Menu, Row, Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../utils/windowContext/win';
import { DownOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import type { MenuProps } from 'antd';
// Question?? 这是什么原理可以不报错
type MenuItemType = NonNullable<MenuProps['items']>[number] & {
	key: string;
	label: React.ReactNode;
};

interface TopMenuProps {
	items: MenuItemType[];
}

const TopMenu: React.FC<TopMenuProps> = ({ items }) => {
	const [current, setCurrent] = useState('home');
	const { size, isHorizontal } = useWindowSize();

	console.log('查看全屏宽高：', size.width, size.height, isHorizontal);
	const route = useNavigate();
	const onClick = (e: { key: string }) => {
		setCurrent(e.key);
		console.log('打印key', e.key);
		route('/' + e.key);
	};
	const menus = (
		<Menu
			selectedKeys={[current]}
			mode="vertical"
			onClick={onClick}
			items={items}
		/>
	);
	const handleClickLogo = () => {
		// console.log(window.location.href ,window.location.href)
		if (window.location.href != window.location.origin + '/')
			window.location.href = window.location.origin;
	};
	return (
		<Row>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
				}}
			>
				<div
					style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					onClick={handleClickLogo}
				>
					<img
						style={{ height: '2rem', width: '2rem', marginRight: '5px' }}
						src="/img/react.png"
						alt="LOGO加载失败了"
					/>

					<div style={{ zoom: '60%' }}>
						<p
							style={{
								fontSize: '2rem',
								textAlign: 'justify',
								margin: 0,
								fontWeight: 'lighter',
							}}
						>
							React Template
							<span style={{ display: 'inline-block', width: '0%' }}></span>
						</p>
						<p
							style={{
								fontSize: '1rem',
								textAlign: 'justify',
								margin: 0,
								fontWeight: 'bolder',
							}}
						>
							基于AntD + Zustand的原生React开发模板
							<span style={{ display: 'inline-block', width: '0%' }}></span>
						</p>
					</div>
				</div>
				{isHorizontal ? (
					<div style={{ display: 'flex' }}>
						<Menu
							onClick={onClick}
							selectedKeys={[current]}
							mode="horizontal"
							items={items}
						/>
						<Avatar src={'/img/user.png'} size="large"></Avatar>
					</div>
				) : (
					<Dropdown menu={{ items }} trigger={['click']}>
						<Button>
							<MenuUnfoldOutlined />
						</Button>
					</Dropdown>
				)}
			</div>
		</Row>
	);
};

export default TopMenu;
