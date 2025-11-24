// TopMenu.tsx
import React from 'react';
import { Button,Dropdown, Menu,Avatar,Grid} from '@arco-design/web-react';
const Row = Grid.Row
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../utils/windowContext/win';
import { IconMenuUnfold } from '@arco-design/web-react/icon';

// 定义菜单项类型
interface MenuItem {
  key: string;
  label: string;
  route?: string;
}

const TopMenu: React.FC<{ items?: MenuItem[] }> = ({ items }) => {
    const { isHorizontal } = useWindowSize();
    const route = useNavigate();

    // 默认菜单项配置
    const defaultMenuItems: MenuItem[] = [
        { key: '7', label: 'Home', route: 'home' },
        { key: '8', label: 'Solution', route: 'solution' },
        { key: '9', label: 'Cloud Service', route: 'cloud-service' },
        { key: '10', label: 'Cooperation', route: 'cooperation' }
    ];

    // 使用传入的 items 或默认菜单项，确保处理空数组情况
    const menuItems = items && items.length > 0 ? items : defaultMenuItems;

    // 处理菜单项点击事件
    const handleMenuItemClick = (menuItem: MenuItem) => {
        console.log('打印key', menuItem.key);
        if (menuItem.route) {
            route("/" + menuItem.route);
        } else {
            route("/" + menuItem.key);
        }
    };
    const menus = (
        <Menu  defaultSelectedKeys={['1']}>
            <Menu.Item key='1'>Beijing</Menu.Item>
            <Menu.Item key='2'>Shanghai</Menu.Item>
            <Menu.Item key='3'>Guangzhou</Menu.Item>
        </Menu>
      );
    const handleClickLogo = () => {
        if (window.location.href != window.location.origin + '/')  window.location.href = window.location.origin
    }
    return (
        <Row>
            <div style={{ display: 'flex',justifyContent: 'space-between',width: '100%'}}>
                <div style={{ display: 'flex', alignItems: 'center',cursor:"pointer"}} onClick={handleClickLogo}>
                    <img style={{height: '2rem', width: '2rem',marginRight:'5px'}} src="/img/react.png" alt="LOGO加载失败了" />
                        
                    <div style={{ zoom: "60%"}}>
                        <p style={{fontSize:'2rem',textAlign: 'justify',margin: 0,fontWeight: 'lighter'}}>React Template<span style={{display: 'inline-block',width: '0%'}}></span></p>
                        <p style={{fontSize:'1rem',textAlign: 'justify',margin: 0,fontWeight: 'bolder'}}>基于字节跳动生态的原生React开发模板<span style={{display: 'inline-block',width: '0%'}}></span></p>
                    </div>
                </div>
                {isHorizontal ? (
                    <div style={{ display:'flex'}}>
                        <div style={{width:'462px'}}>
                            <Menu mode='horizontal'>
                                {menuItems.map(item => (
                                    <Menu.Item 
                                        key={item.key} 
                                        onClick={() => handleMenuItemClick(item)}
                                    >
                                        {item.label}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        </div>
                        <Avatar >
                            <img src="/img/user.png" alt='用户头像' />
                        </Avatar>
                    </div>
                ) : (
                    <Dropdown droplist={menus} trigger={['click']}>
                        <Button>
                            <IconMenuUnfold />
                        </Button>
                    </Dropdown>
                )}
            </div>
        </Row>
    );
};

export default TopMenu;