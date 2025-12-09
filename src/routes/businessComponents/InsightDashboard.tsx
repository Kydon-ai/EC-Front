import React, { useEffect, useRef, useState } from 'react';
import { Card, Tabs, Typography, Table, Tag, Space, Button, DatePicker } from 'antd';
import * as echarts from 'echarts';
import { FireOutlined, BarChartOutlined, FileSearchOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 模拟数据 - 实际项目中应该从API获取
const mockKnowledgeHeatmapData = [
  { name: '招商标准及入驻规范.pdf', references: 128, category: '业务规范' },
  { name: '产品功能说明书.pdf', references: 95, category: '产品文档' },
  { name: 'FAQ常见问题解答.docx', references: 87, category: '客服文档' },
  { name: '技术架构设计.md', references: 65, category: '技术文档' },
  { name: '用户操作指南.pptx', references: 58, category: '操作文档' },
  { name: 'API接口文档.pdf', references: 42, category: '技术文档' },
  { name: '营销活动策划方案.pdf', references: 36, category: '营销文档' },
  { name: '财务报销流程.docx', references: 29, category: '行政文档' },
  { name: '安全规范手册.pdf', references: 22, category: '安全文档' },
  { name: '人力资源政策.docx', references: 18, category: 'HR文档' },
];

const mockTopQuestions = [
  { rank: 1, question: '如何申请入驻平台？', count: 234, category: '入驻流程' },
  { rank: 2, question: '平台的收费标准是什么？', count: 189, category: '费用说明' },
  { rank: 3, question: '如何修改账户信息？', count: 156, category: '账户管理' },
  { rank: 4, question: '订单如何取消？', count: 142, category: '订单管理' },
  { rank: 5, question: '退款流程是怎样的？', count: 128, category: '退款说明' },
  { rank: 6, question: '如何联系客服？', count: 115, category: '客服支持' },
  { rank: 7, question: '平台支持哪些支付方式？', count: 98, category: '支付方式' },
  { rank: 8, question: '如何查看交易记录？', count: 87, category: '交易管理' },
  { rank: 9, question: '账户被冻结怎么办？', count: 76, category: '账户问题' },
  { rank: 10, question: '如何修改密码？', count: 68, category: '账户安全' },
];

const mockZeroHitQuestions = [
  { id: 1, question: '平台是否支持国际支付？', askedAt: '2024-01-15 10:30:22', user: '用户A' },
  { id: 2, question: '如何申请成为平台的服务商？', askedAt: '2024-01-15 14:22:18', user: '用户B' },
  { id: 3, question: '平台的数据分析功能如何使用？', askedAt: '2024-01-16 09:15:45', user: '用户C' },
  { id: 4, question: '如何批量导入数据？', askedAt: '2024-01-16 11:45:32', user: '用户D' },
  { id: 5, question: '平台是否有API接口？', askedAt: '2024-01-16 16:20:15', user: '用户E' },
  { id: 6, question: '如何设置自动回复？', askedAt: '2024-01-17 08:55:48', user: '用户F' },
  { id: 7, question: '平台的存储容量是多少？', askedAt: '2024-01-17 13:12:05', user: '用户G' },
  { id: 8, question: '如何导出数据报告？', askedAt: '2024-01-17 15:33:22', user: '用户H' },
  { id: 9, question: '平台支持哪些语言？', askedAt: '2024-01-18 10:18:55', user: '用户I' },
  { id: 10, question: '如何设置权限管理？', askedAt: '2024-01-18 14:45:12', user: '用户J' },
];

const InsightDashboard: React.FC = () => {
  // 图表引用
  const heatmapChartRef = useRef<HTMLDivElement>(null);
  const topQuestionsChartRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [heatmapChart, setHeatmapChart] = useState<echarts.ECharts | null>(null);
  const [topQuestionsChart, setTopQuestionsChart] = useState<echarts.ECharts | null>(null);

  // 初始化图表
  useEffect(() => {
    if (heatmapChartRef.current) {
      const chart = echarts.init(heatmapChartRef.current);
      setHeatmapChart(chart);
      renderKnowledgeHeatmap(chart);
    }

    if (topQuestionsChartRef.current) {
      const chart = echarts.init(topQuestionsChartRef.current);
      setTopQuestionsChart(chart);
      renderTopQuestionsChart(chart);
    }

    // 窗口大小变化时重新渲染图表
    const handleResize = () => {
      heatmapChart?.resize();
      topQuestionsChart?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      heatmapChart?.dispose();
      topQuestionsChart?.dispose();
    };
  }, []);

  // 渲染知识点热力图
  const renderKnowledgeHeatmap = (chart: echarts.ECharts) => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>引用次数: ${data.value}次<br/>分类: ${mockKnowledgeHeatmapData[data.dataIndex].category}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        name: '引用次数'
      },
      yAxis: {
        type: 'category',
        data: mockKnowledgeHeatmapData.map(item => item.name),
        axisLabel: {
          interval: 0,
          rotate: 30,
          formatter: (value: string) => {
            return value.length > 15 ? value.substring(0, 15) + '...' : value;
          }
        }
      },
      series: [
        {
          name: '引用次数',
          type: 'bar',
          data: mockKnowledgeHeatmapData.map(item => item.references),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          }
        }
      ]
    };

    chart.setOption(option);
  };

  // 渲染高频问题Top10图表
  const renderTopQuestionsChart = (chart: echarts.ECharts) => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>咨询次数: ${data.value}次<br/>分类: ${mockTopQuestions[data.dataIndex].category}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: mockTopQuestions.map(item => item.question),
        axisLabel: {
          interval: 0,
          rotate: 45,
          formatter: (value: string) => {
            return value.length > 15 ? value.substring(0, 15) + '...' : value;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '咨询次数'
      },
      series: [
        {
          name: '咨询次数',
          type: 'bar',
          data: mockTopQuestions.map(item => item.count),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ffd700' },
              { offset: 1, color: '#ff8c00' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#ff8c00' },
                { offset: 1, color: '#ffd700' }
              ])
            }
          }
        }
      ]
    };

    chart.setOption(option);
  };

  // 导出数据
  const handleExportData = (dataType: string) => {
    // 实际项目中应该实现数据导出功能
    message.success(`${dataType}数据导出成功！`);
  };

  // 零命中问题表格列配置
  const zeroHitColumns = [
    {
      title: '问题',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: '提问用户',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: '提问时间',
      dataIndex: 'askedAt',
      key: 'askedAt',
      sorter: (a: any, b: any) => new Date(a.askedAt).getTime() - new Date(b.askedAt).getTime()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small">添加到知识库</Button>
          <Button type="link" size="small">标记已处理</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Card
        title={<Title level={2}>知识&会话可视化洞察管理后台</Title>}
        extra={
          <Space>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => setDateRange(dates as [Date | null, Date | null])}
              style={{ marginRight: 16 }}
            />
            <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleExportData('全部')}>
              导出数据
            </Button>
          </Space>
        }
        style={{ marginBottom: 20 }}
      >
        <Text type="secondary">
          基于知识库内容和会话数据的可视化分析，帮助您了解知识使用情况和用户需求
        </Text>
      </Card>

      <Tabs defaultActiveKey="1" type="card" size="large">
        {/* 知识点热力图 */}
        <TabPane
          tab={<><FireOutlined /> 知识点热力图</>}
          key="1"
        >
          <Card
            title={<Title level={3}>文档引用次数排名</Title>}
            extra={
              <Button icon={<DownloadOutlined />} onClick={() => handleExportData('知识点热力图')}>
                导出图表
              </Button>
            }
            style={{ marginBottom: 20 }}
          >
            <Text type="secondary">
              展示各文档被机器人引用的次数，帮助您了解哪些文档是最常用的知识来源
            </Text>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <div
              ref={heatmapChartRef}
              style={{ height: '500px', width: '100%' }}
            />
          </Card>

          {/* 热力图数据表格 */}
          <Card title={<Title level={4}>详细数据</Title>}>
            <Table
              dataSource={mockKnowledgeHeatmapData}
              columns={[
                {
                  title: '文档名称',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: '引用次数',
                  dataIndex: 'references',
                  key: 'references',
                  sorter: (a, b) => a.references - b.references
                },
                {
                  title: '分类',
                  dataIndex: 'category',
                  key: 'category',
                  render: (category: string) => (
                    <Tag color={
                      category === '业务规范' ? 'blue' :
                        category === '产品文档' ? 'green' :
                          category === '客服文档' ? 'orange' :
                            category === '技术文档' ? 'purple' :
                              category === '操作文档' ? 'cyan' :
                                category === '营销文档' ? 'magenta' :
                                  category === '行政文档' ? 'gold' :
                                    category === '安全文档' ? 'red' : 'gray'
                    }>
                      {category}
                    </Tag>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="name"
            />
          </Card>
        </TabPane>

        {/* 高频问题Top10 */}
        <TabPane
          tab={<><BarChartOutlined /> 高频问题Top10</>}
          key="2"
        >
          <Card
            title={<Title level={3}>用户咨询高频问题排名</Title>}
            extra={
              <Button icon={<DownloadOutlined />} onClick={() => handleExportData('高频问题')}>
                导出图表
              </Button>
            }
            style={{ marginBottom: 20 }}
          >
            <Text type="secondary">
              展示用户咨询最多的前10个问题，帮助您了解用户最关心的话题
            </Text>
          </Card>

          <Card style={{ marginBottom: 20 }}>
            <div
              ref={topQuestionsChartRef}
              style={{ height: '500px', width: '100%' }}
            />
          </Card>

          {/* 高频问题数据表格 */}
          <Card title={<Title level={4}>详细数据</Title>}>
            <Table
              dataSource={mockTopQuestions}
              columns={[
                {
                  title: '排名',
                  dataIndex: 'rank',
                  key: 'rank',
                  width: 60
                },
                {
                  title: '问题',
                  dataIndex: 'question',
                  key: 'question'
                },
                {
                  title: '咨询次数',
                  dataIndex: 'count',
                  key: 'count',
                  sorter: (a, b) => a.count - b.count
                },
                {
                  title: '分类',
                  dataIndex: 'category',
                  key: 'category',
                  render: (category: string) => (
                    <Tag color={
                      category === '入驻流程' ? 'blue' :
                        category === '费用说明' ? 'green' :
                          category === '账户管理' ? 'orange' :
                            category === '订单管理' ? 'purple' :
                              category === '退款说明' ? 'red' :
                                category === '客服支持' ? 'cyan' :
                                  category === '支付方式' ? 'magenta' :
                                    category === '交易管理' ? 'gold' : 'gray'
                    }>
                      {category}
                    </Tag>
                  )
                }
              ]}
              pagination={{ pageSize: 5 }}
              rowKey="rank"
            />
          </Card>
        </TabPane>

        {/* 零命中问题列表 */}
        <TabPane
          tab={<><FileSearchOutlined /> 零命中问题列表</>}
          key="3"
        >
          <Card
            title={<Title level={3}>未匹配到知识库的问题</Title>}
            extra={
              <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleExportData('零命中问题')}>
                导出列表
              </Button>
            }
            style={{ marginBottom: 20 }}
          >
            <Text type="secondary">
              展示用户咨询但知识库中没有匹配答案的问题，帮助您完善知识库内容
            </Text>
          </Card>

          <Card>
            <Table
              dataSource={mockZeroHitQuestions}
              columns={zeroHitColumns}
              pagination={{ pageSize: 10 }}
              rowKey="id"
              expandable={{
                expandedRowRender: (record) => (
                  <p style={{ margin: 0 }}>
                    <Text strong>问题详情：</Text>{record.question}
                  </p>
                )
              }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default InsightDashboard;
