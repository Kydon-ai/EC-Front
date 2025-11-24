import { Card ,Tabs,Image,Alert } from '@arco-design/web-react';
const TabPane = Tabs.TabPane;
export default function DefaultTemplate() {
    return (<>
        <div style={{ maxWidth:'800px',margin: '0 auto', padding: '20px' ,borderRadius: "10px"}}>
            <div className="top-img" style={{ height: '200px',backgroundImage:'url(http://www.qidong.tech:5173/resource/summer.png)',backgroundPosition:'center',backgroundRepeat:'no-repeat',
                borderTopLeftRadius:'inherit',
                borderTopRightRadius:'inherit',
            }}></div>
            <div className="main-content">
                <Card hoverable style={{ borderRadius: 'initial'}}>
                    <h1>基本情况</h1>
                    <p>
                        <strong>曾用网名: &nbsp;&nbsp;</strong>
                        <span>XXXXXXXXX;</span>
                    </p>
                    <p>
                        <strong>励己名言: &nbsp;&nbsp;</strong>
                        <span> <a href="https://baijiahao.baidu.com/s?id=XXXXXXXXX&wfr=spider&for=pc" target="_blank">XXXXXXXXX,XXXXXXXXX</a>                            ;</span>
                    </p>
                    <p>
                        <strong>联系方式: &nbsp;&nbsp;</strong>
                        <span>
                            扣扣:<a href="mailto:XXXXXXXXX@qq.com">XXXXXXXXX@qq.com</a>;
                            WX:<a href="weixin://dl/chat?username=XXXXXXXXX">XXXXXXXXX</a>;
                        </span>
                    </p>
                    <p>
                        <strong>自我介绍: &nbsp;&nbsp;</strong>
                        <span>自我介绍</span>
                    </p>
                    <p>
                        <strong>个人爱好: &nbsp;&nbsp;</strong>
                        <span>XXXXXXXXX;XXXXXXXXX;XXXXXXXXX;XXXXXXXXX;</span>
                    </p>
                </Card>
                <Card hoverable style={{ borderRadius:'initial'}}>
                    <h1>个人经历</h1>
                    <p>
                        <strong>开发经验: &nbsp;&nbsp;</strong>
                        <span>X.Y年;共计负责与参与大小项目XXXXXXXXX项;</span>
                    </p>
                    <p>
                        <strong>技术框架: &nbsp;&nbsp;</strong>
                        <span>Vue; React; WebPack; Vite; TypeScript; Naive UI; Ant Design; Electron; WebSocket; Nginx;</span>
                    </p>
                    <p>
                        <strong>涉及场景: &nbsp;&nbsp;</strong>
                        <span>Web界面;移动端APP;微信小程序;快应用;</span>
                    </p>
                    <p>
                        <strong>实习经历: &nbsp;&nbsp;</strong>
                        <span>XXXXXXXXX(前端开发实习生);</span>
                    </p>
                    <p>
                        <strong>早期博客: &nbsp;&nbsp;</strong>
                        <span><a href="https://blog.csdn.net/XXXXXXXXX?type=blog" target="_blank">XXXXXXXXX&nbsp;的博客</a></span>
                    </p>
                </Card>
                <Card hoverable style={{
                    borderTopLeftRadius:'initial',
                    borderTopRightRadius:'initial',}}>
                    <h1>加我好友</h1>
                    <Tabs defaultActiveTab="1" className="centered-tabs">
                        <TabPane key='1' title='QQ'>
                            <div style={{ display:'flex',justifyContent: 'center'}}>
                                <Image width={200} src="http://www.qidong.tech:5173/resource/wx_lqd.jpg"></Image>
                            </div>
                        </TabPane>
                        <TabPane key='2' title='WX'>
                            <div style={{ display:'flex',justifyContent: 'center'}}>
                                <Image width={200} src="http://www.qidong.tech:5173/resource/qq_lqd.jpg"></Image>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
                <Alert  content="嗯哼？你又来视奸我啦(￣ω￣;)" type="info" ></Alert>
            </div>
        </div>
    </>)
}