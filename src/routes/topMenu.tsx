// TopMenu.tsx
import React, { useState } from 'react';
import { Button, Dropdown, Menu, Row,Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from '../utils/windowContext/win';
import { DownOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

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
        <Menu
          selectedKeys={[current]}
          mode="vertical"
          onClick={onClick}
          items={items}
        />
      );
    const handleClickLogo = () => {
        // console.log(window.location.href ,window.location.href)
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
                        <Menu
                            onClick={onClick}
                            selectedKeys={[current]}
                            mode="horizontal"
                            items={items}
                        />
                        <Avatar src={"/img/user.png"} size='large' style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid #ccc"
                        }}></Avatar>
                    </div>
                ) : (
                    <Dropdown overlay={menus} trigger={['click']}>
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