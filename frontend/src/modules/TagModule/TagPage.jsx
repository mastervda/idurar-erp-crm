import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Table,
  Row,
  Col,
  Card,
  Space,
  Modal,
  Pagination,
  message,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import axios from 'axios';
import { debounce } from 'lodash';

export default function TagPage() {
  const translate = useLanguage();
  const [form] = Form.useForm();

  // State Management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentTag, setCurrentTag] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debouncedSearch = debounce((searchText) => {
    fetchTag({ search: searchText });
  }, 500);

  // Table columns
  const columns = [
    {
      title: translate('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a onClick={() => showDetail(record)}>{text}</a>,
    },
    {
      title: translate('Created At'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: translate('Action'),
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => showDetail(record)} />
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
        </Space>
      ),
    },
  ];

  const fetchTag = async (params = {}) => {
    setLoading(true);
    try {
      const query = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...params,
      };

      // Remove any empty parameters
      Object.keys(query).forEach((key) => {
        if (query[key] === undefined || query[key] === '') {
          delete query[key];
        }
      });

      const response = await axios.get('tag/list', {
        params: query,
        paramsSerializer: (params) => {
          return Object.keys(params)
            .map((key) => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');
        },
        validateStatus: (status) => status < 500,
      });

      if (response.data.success) {
        setData(response.data.result.data);
        setPagination({
          ...pagination,
          total: response.data.result.count,
        });
      }
    } catch (error) {
      console.error('API Error:', error);
      message.error(translate('Network error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (values) => {
    const searchParams = {};
    if (values.name) {
      searchParams.name = values.name;
    }
    fetchTag(searchParams);
    setPagination({ ...pagination, current: 1 });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (currentTag) {
        await axios.patch(`/tag/update/${currentTag._id}`, values);
        message.success(translate('Tag updated successfully'));
      } else {
        await axios.post('/tag/create', values);
        message.success(translate('Tag created successfully'));
      }

      resetForm();
      fetchTag();
    } catch (error) {
      message.error(error.response?.data?.message || translate('Operation failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: translate('Confirm Delete'),
      content: translate('Are you sure to delete this tag?'),
      onOk: async () => {
        try {
          const response = await axios.delete(`/tag/delete/${id}`);

          if (response.data.success) {
            message.success(translate('Tag deleted successfully'));
            fetchTag();
          } else {
            if (response.status === 404) {
              message.error(translate('Tag not found'));
            } else if (response.status === 410) {
              message.error(translate('Tag was already deleted'));
              fetchTag();
            } else {
              message.error(response.data.message || translate('Delete failed'));
            }
          }
        } catch (error) {
          console.error('Delete error:', error);
          const errorMessage =
            error.response?.data?.message ||
            error.response?.statusText ||
            translate('Delete failed');
          message.error(errorMessage);

          if (error.response?.status === 404 || error.response?.status === 410) {
            fetchTag();
          }
        }
      },
    });
  };

  const showEditModal = (tag) => {
    form.setFieldsValue(tag);
    setCurrentTag(tag);
    setModalVisible(true);
  };

  const showDetail = (tag) => {
    setCurrentTag(tag);
    setDetailVisible(true);
  };

  const resetForm = () => {
    form.resetFields();
    setCurrentTag(null);
    setModalVisible(false);
  };

  useEffect(() => {
    fetchTag();
  }, [pagination.current, pagination.pageSize]);

  return (
    <Card
      title={translate('Tag Management')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          {translate('Add Tag')}
        </Button>
      }
    >
      {/* Search Form */}
      <Form layout="inline" onFinish={handleSearch}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Form.Item name="name">
              <Input
                placeholder={translate('Search by name')}
                allowClear
                onChange={(e) => {
                  if (e.target.value === '') {
                    form.setFieldsValue({ name: undefined });
                    handleSearch(form.getFieldsValue());
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                {translate('Search')}
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  fetchTag();
                }}
              >
                {translate('Reset')}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      {/* Data Table */}
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />

      {/* Pagination */}
      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => setPagination({ ...pagination, current: page, pageSize })}
          showSizeChanger
          showTotal={(total) => translate('Total {{total}} items', { total })}
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={currentTag ? translate('Edit Tag') : translate('Add Tag')}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={resetForm}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={translate('Tag Name')}
            rules={[{ required: true, message: translate('Please input tag name') }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={translate('Tag Details')}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {currentTag && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label={translate('Name')}>{currentTag.name}</Descriptions.Item>
            <Descriptions.Item label={translate('Created At')}>
              {new Date(currentTag.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
}
