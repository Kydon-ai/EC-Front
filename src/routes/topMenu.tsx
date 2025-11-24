// TopMenu.tsx
import React, { useState } from 'react';
import { Button,Dropdown, Menu,Avatar,Grid} from '@arco-design/web-react';
const Row = Grid.Row
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../utils/windowContext/win';
import { IconMenuUnfold } from '@arco-design/web-react/icon';

const TopMenu: React.FC = ({ items }) => {
    const [current, setCurrent] = useState('home');
    const { size,isHorizontal } = useWindowSize();

    console.log("查看全屏宽高：",size.width,size.height,isHorizontal)
    
    const route = useNavigate()
    const onClick = (e: { key: string }) => {
        setCurrent(e.key);
        console.log('打印key',e.key)
        route("/" + e.key)
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
                            <Menu mode='horizontal' >
                                <Menu.Item key='7'>Home</Menu.Item>
                                <Menu.Item key='8'>Solution</Menu.Item>
                                <Menu.Item key='9'>Cloud Service</Menu.Item>
                                <Menu.Item key='10'>Cooperation</Menu.Item>
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