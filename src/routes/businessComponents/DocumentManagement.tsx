import React, { useState } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Typography, Card, Tag, Modal, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, FileTextOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 文档类型选项
const fileTypeOptions = [
	{ value: 'pdf', label: 'PDF文档' },
	{ value: 'doc', label: 'Word文档' },
	{ value: 'txt', label: '文本文件' },
	{ value: 'ppt', label: 'PPT文档' },
	{ value: 'excel', label: 'Excel表格' },
];

// 文档分类选项
const documentCategoryOptions = [
	{ value: 'knowledge', label: '知识库' },
	{ value: 'project', label: '项目文档' },
	{ value: 'meeting', label: '会议记录' },
	{ value: 'report', label: '报告文件' },
	{ value: 'other', label: '其他' },
];

// 文档状态选项
const documentStatusOptions = [
	{ value: 'active', label: '已发布' },
	{ value: 'draft', label: '草稿' },
	{ value: 'archived', label: '已归档' },
];

// 模拟文档数据
const mockDocuments = [
	{
		id: 1,
		title: '项目需求文档',
		fileType: 'pdf',
		category: 'project',
		status: 'active',
		uploadDate: '2024-01-15',
		size: '2.5 MB',
		author: '张三',
		views: 120,
	},
	{
		id: 2,
		title: '技术架构设计',
		fileType: 'ppt',
		category: 'project',
		status: 'active',
		uploadDate: '2024-01-14',
		size: '5.8 MB',
		author: '李四',
		views: 85,
	},
	{
		id: 3,
		title: '会议记录',
		fileType: 'doc',
		category: 'meeting',
		status: 'active',
		uploadDate: '2024-01-13',
		size: '1.2 MB',
		author: '王五',
		views: 45,
	},
	{
		id: 4,
		title: '产品规格说明书',
		fileType: 'pdf',
		category: 'knowledge',
		status: 'draft',
		uploadDate: '2024-01-12',
		size: '3.7 MB',
		author: '赵六',
		views: 28,
	},
	{
		id: 5,
		title: '销售数据报表',
		fileType: 'excel',
		category: 'report',
		status: 'active',
		uploadDate: '2024-01-11',
		size: '4.2 MB',
		author: '钱七',
		views: 156,
	},
];

const DocumentManagement: React.FC = () => {
	const [documents, setDocuments] = useState(mockDocuments);
	const [filteredDocuments, setFilteredDocuments] = useState(mockDocuments);
	const [searchText, setSearchText] = useState('');
	const [fileTypeFilter, setFileTypeFilter] = useState<string | null>(null);
	const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [dateRangeFilter, setDateRangeFilter] = useState<[Date | null, Date | null]>([null, null]);
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<any>(null);

	// 搜索功能
	const handleSearch = (value: string) => {
		setSearchText(value);
		filterDocuments(value, fileTypeFilter, categoryFilter, statusFilter, dateRangeFilter);
	};

	// 筛选功能
	const filterDocuments = (search: string, fileType: string | null, category: string | null, status: string | null, dateRange: [Date | null, Date | null]) => {
		let filtered = [...documents];

		// 搜索过滤
		if (search) {
			filtered = filtered.filter(doc =>
				doc.title.toLowerCase().includes(search.toLowerCase()) ||
				doc.author.toLowerCase().includes(search.toLowerCase())
			);
		}

		// 文件类型过滤
		if (fileType) {
			filtered = filtered.filter(doc => doc.fileType === fileType);
		}

		// 分类过滤
		if (category) {
			filtered = filtered.filter(doc => doc.category === category);
		}

		// 状态过滤
		if (status) {
			filtered = filtered.filter(doc => doc.status === status);
		}

		// 日期范围过滤（这里只是简单演示，实际需要根据日期格式调整）
		if (dateRange[0] && dateRange[1]) {
			// 实际项目中需要根据日期格式进行比较
			filtered = filtered.filter(doc => {
				const docDate = new Date(doc.uploadDate);
				return docDate >= dateRange[0] && docDate <= dateRange[1];
			});
		}

		setFilteredDocuments(filtered);
	};

	// 重置筛选
	const handleResetFilters = () => {
		setSearchText('');
		setFileTypeFilter(null);
		setCategoryFilter(null);
		setStatusFilter(null);
		setDateRangeFilter([null, null]);
		setFilteredDocuments(documents);
	};

	// 查看文档
	const handleViewDocument = (record: any) => {
		setSelectedDocument(record);
		setViewModalVisible(true);
	};

	// 编辑文档
	const handleEditDocument = (record: any) => {
		message.info(`编辑文档: ${record.title}`);
		// 这里可以添加实际的编辑逻辑
	};

	// 删除文档
	const handleDeleteDocument = (id: number) => {
		setDocuments(documents.filter(doc => doc.id !== id));
		setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));
		message.success('文档已删除');
	};

	// 获取文件类型标签
	const getFileTypeTag = (fileType: string) => {
		const option = fileTypeOptions.find(opt => opt.value === fileType);
		return option ? option.label : fileType;
	};

	// 获取文档分类标签
	const getCategoryTag = (category: string) => {
		const option = documentCategoryOptions.find(opt => opt.value === category);
		return option ? option.label : category;
	};

	// 获取状态标签
	const getStatusTag = (status: string) => {
		const option = documentStatusOptions.find(opt => opt.value === status);
		let color = '';
		switch (status) {
			case 'active':
				color = 'green';
				break;
			case 'draft':
				color = 'blue';
				break;
			case 'archived':
				color = 'gray';
				break;
			default:
				color = 'default';
		}
		return <Tag color={color}>{option ? option.label : status}</Tag>;
	};

	// 表格列配置
	const columns = [
		{
			title: '文档标题',
			dataIndex: 'title',
			key: 'title',
			render: (text: string, record: any) => (
				<Space>
					<FileTextOutlined />
					<Text strong>{text}</Text>
				</Space>
			),
		},
		{
			title: '文件类型',
			dataIndex: 'fileType',
			key: 'fileType',
			render: (text: string) => getFileTypeTag(text),
		},
		{
			title: '分类',
			dataIndex: 'category',
			key: 'category',
			render: (text: string) => getCategoryTag(text),
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (text: string) => getStatusTag(text),
		},
		{
			title: '上传日期',
			dataIndex: 'uploadDate',
			key: 'uploadDate',
		},
		{
			title: '大小',
			dataIndex: 'size',
			key: 'size',
		},
		{
			title: '作者',
			dataIndex: 'author',
			key: 'author',
		},
		{
			title: '浏览量',
			dataIndex: 'views',
			key: 'views',
			sorter: (a: any, b: any) => a.views - b.views,
		},
		{
			title: '操作',
			key: 'action',
			render: (_: any, record: any) => (
				<Space size="middle">
					<Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDocument(record)}>
						查看
					</Button>
					<Button type="link" icon={<EditOutlined />} onClick={() => handleEditDocument(record)}>
						编辑
					</Button>
					<Popconfirm
						title="确定要删除这个文档吗？"
						onConfirm={() => handleDeleteDocument(record.id)}
						okText="确定"
						cancelText="取消"
					>
						<Button type="link" danger icon={<DeleteOutlined />}>
							删除
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	// 查看文档模态框
	const viewModal = (
		<Modal
			title={<Title level={4}>文档详情</Title>}
			open={viewModalVisible}
			onCancel={() => setViewModalVisible(false)}
			footer={[
				<Button key="close" onClick={() => setViewModalVisible(false)}>
					关闭
				</Button>,
			]}
		>
			{selectedDocument && (
				<div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>文档标题：</Text>
						<Text>{selectedDocument.title}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>文件类型：</Text>
						<Text>{getFileTypeTag(selectedDocument.fileType)}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>分类：</Text>
						<Text>{getCategoryTag(selectedDocument.category)}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>状态：</Text>
						{getStatusTag(selectedDocument.status)}
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>上传日期：</Text>
						<Text>{selectedDocument.uploadDate}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>大小：</Text>
						<Text>{selectedDocument.size}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>作者：</Text>
						<Text>{selectedDocument.author}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>浏览量：</Text>
						<Text>{selectedDocument.views}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>内容预览：</Text>
						<Text>这是文档内容的预览部分...（实际项目中可以根据文件类型显示不同的预览）</Text>
					</div>
				</div>
			)}
		</Modal>
	);

	return (
		<div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
			<Card title={<Title level={2}>文档管理</Title>}>
				{/* 搜索和筛选区域 */}
				<div style={{ marginBottom: '20px' }}>
					<Space direction="vertical" size="middle" style={{ width: '100%' }}>
						<Space style={{ width: '100%' }}>
							<Search
								placeholder="搜索文档标题或作者"
								allowClear
								enterButton={<SearchOutlined />}
								size="large"
								onSearch={handleSearch}
								onChange={(e) => handleSearch(e.target.value)}
								style={{ width: '300px' }}
							/>
							<Select
								placeholder="文件类型"
								allowClear
								style={{ width: '150px' }}
								onChange={(value) => {
									setFileTypeFilter(value);
									filterDocuments(searchText, value, categoryFilter, statusFilter, dateRangeFilter);
								}}
							>
								{fileTypeOptions.map(option => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
							</Select>
							<Select
								placeholder="文档分类"
								allowClear
								style={{ width: '150px' }}
								onChange={(value) => {
									setCategoryFilter(value);
									filterDocuments(searchText, fileTypeFilter, value, statusFilter, dateRangeFilter);
								}}
							>
								{documentCategoryOptions.map(option => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
							</Select>
							<Select
								placeholder="文档状态"
								allowClear
								style={{ width: '150px' }}
								onChange={(value) => {
									setStatusFilter(value);
									filterDocuments(searchText, fileTypeFilter, categoryFilter, value, dateRangeFilter);
								}}
							>
								{documentStatusOptions.map(option => (
									<Option key={option.value} value={option.value}>
										{option.label}
									</Option>
								))}
							</Select>
							<RangePicker
								placeholder={['开始日期', '结束日期']}
								onChange={(dates) => {
									const newRange = dates as [Date | null, Date | null];
									setDateRangeFilter(newRange);
									filterDocuments(searchText, fileTypeFilter, categoryFilter, statusFilter, newRange);
								}}
							/>
							<Button onClick={handleResetFilters}>重置筛选</Button>
						</Space>
					</Space>
				</div>

				{/* 文档列表 */}
				<Table
					columns={columns}
					dataSource={filteredDocuments}
					rowKey="id"
					pagination={{
						pageSize: 5,
						showSizeChanger: true,
						showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
					}}
				/>
			</Card>

			{/* 查看文档模态框 */}
			{viewModal}
		</div>
	);
};

export default DocumentManagement;