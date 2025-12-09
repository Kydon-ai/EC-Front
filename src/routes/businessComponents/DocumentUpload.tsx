import React, { useState } from 'react';
import {
	Upload,
	Button,
	message,
	Card,
	Form,
	Input,
	Select,
	Space,
	Typography,
} from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Text } = Typography;
const { Option } = Select;

const DocumentUpload: React.FC = () => {
	const [fileList, setFileList] = useState<any[]>([]);
	const [form] = Form.useForm();

	// 文件类型选项
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

		// 检查文件大小（最大50MB）
		const isLt50M = file.size / 1024 / 1024 < 50;
		if (!isLt50M) {
			message.error('文件大小不能超过50MB！');
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
	const onFinish = (values: any) => {
		console.log('表单数据:', values);
		console.log('上传的文件:', fileList);
		// 这里可以添加实际的文件上传逻辑
		message.success('文档上传成功！');
		form.resetFields();
		setFileList([]);
	};

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
		<div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
			<Card title={<Title level={2}>文档上传</Title>}>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item
						name="documentTitle"
						label="文档标题"
						rules={[{ required: true, message: '请输入文档标题' }]}
					>
						<Input placeholder="请输入文档标题" />
					</Form.Item>

					<Form.Item
						name="fileType"
						label="文件类型"
						rules={[{ required: true, message: '请选择文件类型' }]}
					>
						<Select placeholder="请选择文件类型">
							{fileTypeOptions.map(option => (
								<Option key={option.value} value={option.value}>
									{option.label}
								</Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="documentCategory"
						label="文档分类"
						rules={[{ required: true, message: '请选择文档分类' }]}
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
						<Input.TextArea rows={4} placeholder="请输入文档描述（可选）" />
					</Form.Item>

					<Form.Item
						label="上传文件"
						rules={[{ required: true, message: '请上传文档' }]}
					>
						<Dragger {...uploadProps}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">点击或拖拽文件到此处上传</p>
							<p className="ant-upload-hint">
								支持单个或多个文件上传。只允许上传PDF、Word、TXT、PPT和Excel文件，单个文件大小不超过50MB。
							</p>
						</Dragger>
					</Form.Item>

					<Form.Item>
						<Space>
							<Button
								type="primary"
								htmlType="submit"
								icon={<UploadOutlined />}
							>
								上传文档
							</Button>
							<Button htmlType="reset" onClick={() => setFileList([])}>
								重置
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default DocumentUpload;
