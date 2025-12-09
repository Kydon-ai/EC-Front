import React, { useEffect, useRef, useState } from 'react';
import {
	Card,
	Tabs,
	Typography,
	Table,
	Tag,
	Space,
	Button,
	DatePicker,
	message,
} from 'antd';
import * as echarts from 'echarts';
import {
	FireOutlined,
	BarChartOutlined,
	FileSearchOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import request from '../../utils/https/request';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 接口返回数据类型定义
interface QuestionStats {
	question: string;
	count: number;
	zeroHitCount: number;
	zeroHitRate: number;
	lastAskedAt: string;
	createdAt: string;
}

interface StatsSummary {
	totalQuestions: number;
	totalQuestionAsks: number;
	totalZeroHits: number;
	totalZeroHitRate: number;
}

interface ApiResponse {
	questions: QuestionStats[];
	summary: StatsSummary;
}

// 模拟数据 - 知识点热力图数据
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

const InsightDashboard: React.FC = () => {
	// 图表引用
	const heatmapChartRef = useRef<HTMLDivElement>(null);
	const topQuestionsChartRef = useRef<HTMLDivElement>(null);
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		null,
		null,
	]);
	const [heatmapChart, setHeatmapChart] = useState<echarts.ECharts | null>(
		null
	);
	const [topQuestionsChart, setTopQuestionsChart] =
		useState<echarts.ECharts | null>(null);

	// API数据状态
	const [questionStats, setQuestionStats] = useState<QuestionStats[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>('');

	// 获取问题统计数据
	const fetchQuestionStats = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await request.get('/api/stats/questions');
			if (response.status === 'success' && response.data) {
				setQuestionStats(response.data.questions);
			} else {
				setError('获取数据失败');
				message.error('获取数据失败');
			}
		} catch (err) {
			console.error('API请求错误:', err);
			setError('API请求错误');
			message.error('API请求错误');
		} finally {
			setLoading(false);
		}
	};

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
	}, [questionStats, loading]);

	// 组件挂载时获取数据
	useEffect(() => {
		fetchQuestionStats();
	}, []);

	// 渲染知识点热力图
	const renderKnowledgeHeatmap = (chart: echarts.ECharts) => {
		const option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
				formatter: (params: any) => {
					const data = params[0];
					return `${data.name}<br/>引用次数: ${data.value}次<br/>分类: ${mockKnowledgeHeatmapData[data.dataIndex].category}`;
				},
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			xAxis: {
				type: 'value',
				boundaryGap: [0, 0.01],
				name: '引用次数',
			},
			yAxis: {
				type: 'category',
				data: mockKnowledgeHeatmapData.map(item => item.name),
				axisLabel: {
					interval: 0,
					rotate: 30,
					formatter: (value: string) => {
						return value.length > 15 ? value.substring(0, 15) + '...' : value;
					},
				},
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
							{ offset: 1, color: '#188df0' },
						]),
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{ offset: 0, color: '#2378f7' },
								{ offset: 0.7, color: '#2378f7' },
								{ offset: 1, color: '#83bff6' },
							]),
						},
					},
				},
			],
		};

		chart.setOption(option);
	};

	// 渲染高频问题Top10图表
	const renderTopQuestionsChart = (chart: echarts.ECharts) => {
		if (loading) return;

		// 处理数据，确保只有10个数据点
		const sortedQuestions = [...questionStats].sort(
			(a, b) => b.count - a.count
		);
		const top10Questions = sortedQuestions.slice(0, 10);
		const questionNames = top10Questions.map(q => q.question);
		const questionCounts = top10Questions.map(q => q.count);

		const option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow',
				},
				formatter: (params: any) => {
					const data = params[0];
					const question = top10Questions[data.dataIndex];
					return `${question.question}<br/>咨询次数: ${question.count}次<br/>零命中率: ${question.zeroHitRate}%`;
				},
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true,
			},
			xAxis: {
				type: 'category',
				data: questionNames,
				axisLabel: {
					interval: 0,
					rotate: 45,
					formatter: (value: string) => {
						return value.length > 15 ? value.substring(0, 15) + '...' : value;
					},
				},
			},
			yAxis: {
				type: 'value',
				name: '咨询次数',
			},
			series: [
				{
					name: '咨询次数',
					type: 'bar',
					data: questionCounts,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: '#ffd700' },
							{ offset: 1, color: '#ff8c00' },
						]),
					},
					emphasis: {
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#ff8c00' },
								{ offset: 1, color: '#ffd700' },
							]),
						},
					},
				},
			],
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
			render: (text: string) => <Text strong>{text}</Text>,
		},
		{
			title: '咨询次数',
			dataIndex: 'count',
			key: 'count',
			sorter: (a: any, b: any) => a.count - b.count,
		},
		{
			title: '最后询问时间',
			dataIndex: 'lastAskedAt',
			key: 'lastAskedAt',
			render: (text: string) => new Date(text).toLocaleString(),
			sorter: (a: any, b: any) =>
				new Date(a.lastAskedAt).getTime() - new Date(b.lastAskedAt).getTime(),
		},
		{
			title: '零命中次数',
			dataIndex: 'zeroHitCount',
			key: 'zeroHitCount',
			sorter: (a: any, b: any) => a.zeroHitCount - b.zeroHitCount,
		},
		{
			title: '零命中率',
			dataIndex: 'zeroHitRate',
			key: 'zeroHitRate',
			render: (text: number) => `${text}%`,
			sorter: (a: any, b: any) => a.zeroHitRate - b.zeroHitRate,
		},
		{
			title: '操作',
			key: 'action',
			render: (_: any, record: any) => (
				<Space size="middle">
					<Button type="link" size="small">
						添加到知识库
					</Button>
					<Button type="link" size="small">
						标记已处理
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
			<Card
				title={<Title level={2}>知识&会话可视化洞察管理后台</Title>}
				extra={
					<Space>
						<RangePicker
							placeholder={['开始日期', '结束日期']}
							onChange={dates =>
								setDateRange(dates as [Date | null, Date | null])
							}
							style={{ marginRight: 16 }}
						/>
						<Button
							type="primary"
							icon={<DownloadOutlined />}
							onClick={() => handleExportData('全部')}
						>
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
				{/* 零命中问题列表 */}
				<TabPane
					tab={
						<>
							<FileSearchOutlined /> 高频Top 10与零命中问题列表
						</>
					}
					key="1"
				>
					<Card
						title={<Title level={3}>未匹配到知识库的问题</Title>}
						extra={
							<Button
								type="primary"
								icon={<DownloadOutlined />}
								onClick={() => handleExportData('零命中问题')}
							>
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
							dataSource={questionStats.filter(q => q.zeroHitCount > 0)}
							columns={zeroHitColumns}
							pagination={{ pageSize: 10 }}
							rowKey="question"
							expandable={{
								expandedRowRender: record => (
									<p style={{ margin: 0 }}>
										<Text strong>问题详情：</Text>
										{record.question}
									</p>
								),
							}}
						/>
					</Card>
				</TabPane>

				{/* 知识点热力图 */}
				<TabPane
					tab={
						<>
							<FireOutlined /> 知识点热力图
						</>
					}
					key="2  "
				>
					<Card
						title={<Title level={3}>文档引用次数排名</Title>}
						extra={
							<Button
								icon={<DownloadOutlined />}
								onClick={() => handleExportData('知识点热力图')}
							>
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
									key: 'name',
								},
								{
									title: '引用次数',
									dataIndex: 'references',
									key: 'references',
									sorter: (a, b) => a.references - b.references,
								},
								{
									title: '分类',
									dataIndex: 'category',
									key: 'category',
									render: (category: string) => (
										<Tag
											color={
												category === '业务规范'
													? 'blue'
													: category === '产品文档'
														? 'green'
														: category === '客服文档'
															? 'orange'
															: category === '技术文档'
																? 'purple'
																: category === '操作文档'
																	? 'cyan'
																	: category === '营销文档'
																		? 'magenta'
																		: category === '行政文档'
																			? 'gold'
																			: category === '安全文档'
																				? 'red'
																				: 'gray'
											}
										>
											{category}
										</Tag>
									),
								},
							]}
							pagination={{ pageSize: 5 }}
							rowKey="name"
						/>
					</Card>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default InsightDashboard;
