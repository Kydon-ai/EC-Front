import React, { useState, useEffect } from 'react';
import {
	Tabs,
	Upload,
	Button,
	message,
	Card,
	Form,
	Input,
	Select,
	Space,
	Typography,
	Table,
	Input as AntInput,
	DatePicker,
	Tag,
	Modal,
	Popconfirm,
} from 'antd';
import {
	UploadOutlined,
	FileTextOutlined,
	SearchOutlined,
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	InboxOutlined,
} from '@ant-design/icons';
import request from '../../utils/https/request';

const { Dragger } = Upload;
const { Title, Text } = Typography;
const { Search } = AntInput;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

const DocumentCenter: React.FC = () => {
	// 上传功能状态
	const [fileList, setFileList] = useState<any[]>([]);
	const [form] = Form.useForm();
	const [uploading, setUploading] = useState(false);

	// 管理功能状态
	const [documents, setDocuments] = useState<any[]>([]);
	const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
	const [searchText, setSearchText] = useState('');
	const [dateRangeFilter, setDateRangeFilter] = useState<
		[Date | null, Date | null]
	>([null, null]);
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	// 获取文档列表
	useEffect(() => {
		fetchDocuments();
	}, []);

	const fetchDocuments = async () => {
		try {
			setLoading(true);
			const response = await request.get(
				'/api/knowledge-bases/28dee884d4bf11f09ece5e1b7fcabefc/documents'
			);
			if (response.status === 'success' && response.documents) {
				setDocuments(response.documents);
				setFilteredDocuments(response.documents);
			}
		} catch (error) {
			console.error('获取文档列表失败:', error);
			message.error('获取文档列表失败，请重试！');
		} finally {
			setLoading(false);
		}
	};

	// 上传前的文件检查
	const beforeUpload = (file: any) => {
		// 检查文件类型
		const fileExtension = file.name.split('.').pop()?.toLowerCase();
		const isAllowedType = [
			'pdf',
			'doc',
			'docx',
			'txt',
			'ppt',
			'pptx',
			'xls',
			'xlsx',
		].includes(fileExtension || '');
		if (!isAllowedType) {
			message.error('只允许上传PDF、Word、TXT、PPT和Excel文件！');
			return Upload.LIST_IGNORE;
		}

		// 检查文件大小（最大10MB）
		const isLt10M = file.size / 1024 / 1024 < 10;
		if (!isLt10M) {
			message.error('文件大小不能超过10MB！');
			return Upload.LIST_IGNORE;
		}

		// 将文件添加到文件列表
		setFileList([...fileList, file]);
		return false; // 手动上传
	};

	// 处理文件列表变化
	const handleChange = ({ fileList: newFileList }: any) => {
		setFileList(newFileList);
	};

	// 提交表单
	const onFinish = async (values: any) => {
		if (fileList.length === 0) {
			message.error('请选择文件后再上传！');
			return;
		}

		setUploading(true);

		try {
			for (const file of fileList) {
				const formData = new FormData();
				// 显式指定文件名，确保服务器能正确识别文件
				formData.append('file', file.originFileObj || file, file.name);
				console.log('查看上传文件名字：', file.name);
				formData.append('title', file.name);
				formData.append('metadata', '{}');
				formData.append('author', values.author || '匿名');

				// 调用上传接口，不需要手动设置Content-Type，浏览器会自动处理包含boundary的multipart/form-data
				const response = await request.post(
					'/api/knowledge-bases/28dee884d4bf11f09ece5e1b7fcabefc/documents',
					formData
				);

				console.log('文件上传成功:', response);

				// 模拟添加到文档列表
				const newDoc = {
					id: documents.length + 1,
					title: values.documentTitle || file.name,
					fileType: file.name.split('.').pop()?.toLowerCase() || 'pdf',
					category: values.documentCategory || 'knowledge',
					status: 'active',
					uploadDate: new Date().toISOString().split('T')[0],
					size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
					author: values.author || '匿名',
					views: 0,
				};

				setDocuments([newDoc, ...documents]);
			}

			message.success('所有文档上传成功！');
			form.resetFields();
			setFileList([]);
		} catch (error) {
			console.error('文件上传失败:', error);
			message.error('文件上传失败，请重试！');
		} finally {
			setUploading(false);
		}
	};

	// 搜索功能
	const handleSearch = (value: string) => {
		setSearchText(value);
		filterDocuments(value, dateRangeFilter);
	};

	// 筛选功能
	const filterDocuments = (
		search: string,
		dateRange: [Date | null, Date | null]
	) => {
		let filtered = [...documents];

		// 搜索过滤
		if (search) {
			filtered = filtered.filter(doc =>
				doc.title.toLowerCase().includes(search.toLowerCase())
			);
		}

		// 日期范围过滤
		if (dateRange[0] && dateRange[1]) {
			filtered = filtered.filter(doc => {
				const docDate = new Date(doc.createdAt);
				return (
					docDate >= (dateRange[0] as Date) && docDate <= (dateRange[1] as Date)
				);
			});
		}

		setFilteredDocuments(filtered);
	};

	// 重置筛选
	const handleResetFilters = () => {
		setSearchText('');
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
	};

	// 删除文档
	const handleDeleteDocument = (id: string) => {
		setDocuments(documents.filter(doc => doc.id !== id));
		setFilteredDocuments(filteredDocuments.filter(doc => doc.id !== id));
		message.success('文档已删除');
	};

	// 获取文件类型标签
	const getFileTypeTag = (fileType: string) => {
		const fileTypeMap: Record<string, string> = {
			pdf: 'PDF文档',
			doc: 'Word文档',
			txt: '文本文件',
			ppt: 'PPT文档',
			excel: 'Excel表格',
			docx: 'Word文档',
			xlsx: 'Excel表格',
			pptx: 'PPT文档',
		};
		return fileTypeMap[fileType] || fileType;
	};

	// 获取文档分类标签
	const getCategoryTag = (category: string) => {
		const option = documentCategoryOptions.find(opt => opt.value === category);
		return option ? option.label : category;
	};

	// 获取状态标签
	const getStatusTag = (status: string) => {
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
		return (
			<Tag color={color}>
				{status === 'active'
					? '已发布'
					: status === 'draft'
						? '草稿'
						: '已归档'}
			</Tag>
		);
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
			title: '创建时间',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (text: string) => <Text>{new Date(text).toLocaleString()}</Text>,
		},
		{
			title: '标签',
			dataIndex: 'tags',
			key: 'tags',
			render: (tags: string[]) => (
				<Space>
					{tags.map((tag, index) => (
						<Tag key={index}>{tag}</Tag>
					))}
				</Space>
			),
		},
		{
			title: '操作',
			key: 'action',
			render: (_: any, record: any) => (
				<Space size="middle">
					<Button
						type="link"
						icon={<EyeOutlined />}
						onClick={() => handleViewDocument(record)}
					>
						查看
					</Button>
					<Button
						type="link"
						icon={<EditOutlined />}
						onClick={() => handleEditDocument(record)}
					>
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
						<Text strong>文档ID：</Text>
						<Text>{selectedDocument.id}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>文档UUID：</Text>
						<Text>{selectedDocument.uuid}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>文档标题：</Text>
						<Text>{selectedDocument.title}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>创建时间：</Text>
						<Text>{new Date(selectedDocument.createdAt).toLocaleString()}</Text>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>标签：</Text>
						<Space>
							{selectedDocument.tags.map((tag: string, index: number) => (
								<Tag key={index}>{tag}</Tag>
							))}
						</Space>
					</div>
					<div style={{ marginBottom: '16px' }}>
						<Text strong>内容预览：</Text>
						<Text ellipsis={{ rows: 10, expandable: true, symbol: '展开' }}>
							{selectedDocument.content}
						</Text>
					</div>
				</div>
			)}
		</Modal>
	);

	// 上传配置
	const uploadProps = {
		name: 'file',
		multiple: true,
		fileList,
		beforeUpload,
		onChange: handleChange,
		showUploadList: {
			showPreviewIcon: true,
			showRemoveIcon: true,
			showDownloadIcon: false,
		},
	};

	return (
		<div style={{ padding: '20px', margin: '0 auto' }}>
			<Card title={<Title level={2}>文档中心</Title>}>
				<Tabs
					items={[
						{
							key: 'upload',
							label: '文档上传',
							children: (
								<Form form={form} layout="vertical" onFinish={onFinish}>
									<Form.Item
										name="documentTitle"
										label="文档标题"
										// 非必填
									>
										<Input placeholder="请输入文档标题" />
									</Form.Item>

									<Form.Item
										name="author"
										label="文件作者"
										initialValue="匿名"
										// 非必填
									>
										<Input placeholder="请输入文件作者" />
									</Form.Item>

									<Form.Item
										name="documentCategory"
										label="文档分类"
										initialValue="knowledge"
										// 非必填，默认选中第一个分类
									>
										<Select placeholder="请选择文档分类">
											{documentCategoryOptions.map(option => (
												<Option key={option.value} value={option.value}>
													{option.label}
												</Option>
											))}
										</Select>
									</Form.Item>

									<Form.Item name="documentDescription" label="文档描述">
										<Input.TextArea
											rows={4}
											placeholder="请输入文档描述（可选）"
										/>
									</Form.Item>

									<Form.Item
										label="上传文件"
										rules={[{ required: true, message: '请上传文档' }]}
									>
										<Dragger {...uploadProps}>
											<p className="ant-upload-drag-icon">
												<InboxOutlined />
											</p>
											<p className="ant-upload-text">
												点击或拖拽文件到此处上传
											</p>
											<p className="ant-upload-hint">
												支持单个或多个文件上传。只允许上传PDF、Word、TXT、PPT和Excel文件，单个文件大小不超过10MB。
											</p>
										</Dragger>
									</Form.Item>

									<Form.Item>
										<Space>
											<Button
												type="primary"
												htmlType="submit"
												icon={<UploadOutlined />}
												loading={uploading}
											>
												上传文档
											</Button>
											<Button htmlType="reset" onClick={() => setFileList([])}>
												重置
											</Button>
										</Space>
									</Form.Item>
								</Form>
							),
						},
						{
							key: 'management',
							label: '文档管理',
							children: (
								<>
									{/* 搜索和筛选区域 */}
									<div style={{ marginBottom: '20px' }}>
										<Space
											direction="vertical"
											size="middle"
											style={{ width: '100%' }}
										>
											<Space style={{ width: '100%' }}>
												<Search
													placeholder="搜索文档标题"
													allowClear
													enterButton={<SearchOutlined />}
													size="large"
													onSearch={handleSearch}
													onChange={e => handleSearch(e.target.value)}
													style={{ width: '300px' }}
												/>
												<RangePicker
													placeholder={['开始日期', '结束日期']}
													onChange={dates => {
														const newRange = dates as [
															Date | null,
															Date | null,
														];
														setDateRangeFilter(newRange);
														filterDocuments(searchText, newRange);
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
											showTotal: (total, range) =>
												`第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
										}}
										loading={loading}
									/>
								</>
							),
						},
					]}
				/>
			</Card>

			{/* 查看文档模态框 */}
			{viewModal}
		</div>
	);
};

export default DocumentCenter;
