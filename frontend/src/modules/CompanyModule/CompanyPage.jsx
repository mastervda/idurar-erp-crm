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
  Tag,
  Select,
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

export default function CompanyPage() {
  const translate = useLanguage();
  const [form] = Form.useForm();

  // State Management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debouncedSearch = debounce((searchText) => {
    fetchCompanies({ search: searchText });
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
      title: translate('Short Name'),
      dataIndex: 'shortName',
      key: 'shortName',
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

  const fetchCompanies = async (params = {}) => {
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

      const response = await axios.get('company/list', {
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

  // Update your handleSearch function
  const handleSearch = (values) => {
    const searchParams = {};

    if (values.name) {
      searchParams.name = values.name;
    }

    if (values.shortName) {
      searchParams.shortName = values.shortName;
    }

    fetchCompanies(searchParams);
    setPagination({ ...pagination, current: 1 });
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (currentCompany) {
        await axios.patch(`/company/update/${currentCompany._id}`, values);
        message.success(translate('Company updated successfully'));
      } else {
        await axios.post('/company/create', values);
        message.success(translate('Company created successfully'));
      }

      resetForm();
      fetchCompanies();
    } catch (error) {
      message.error(error.response?.data?.message || translate('Operation failed'));
    } finally {
      setLoading(false);
    }
  };

  // Updated handleDelete function
  const handleDelete = async (id) => {
    Modal.confirm({
      title: translate('Confirm Delete'),
      content: translate('Are you sure to delete this company?'),
      onOk: async () => {
        try {
          const response = await axios.delete(`/company/delete/${id}`);

          if (response.data.success) {
            message.success(translate('Company deleted successfully'));
            fetchCompanies();
          } else {
            // Handle specific error cases
            if (response.status === 404) {
              message.error(translate('Company not found'));
            } else if (response.status === 410) {
              message.error(translate('Company was already deleted'));
              fetchCompanies(); // Refresh to update UI
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

          // If it's a 404 or 410, refresh the list
          if (error.response?.status === 404 || error.response?.status === 410) {
            fetchCompanies();
          }
        }
      },
    });
  };

  // Show edit modal
  const showEditModal = (company) => {
    form.setFieldsValue(company);
    setCurrentCompany(company);
    setModalVisible(true);
  };

  // Show detail
  const showDetail = (company) => {
    setCurrentCompany(company);
    setDetailVisible(true);
  };

  // Reset form
  const resetForm = () => {
    form.resetFields();
    setCurrentCompany(null);
    setModalVisible(false);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCompanies();
  }, [pagination.current, pagination.pageSize]);

  return (
    <Card
      title={translate('Company Management')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          {translate('Add Company')}
        </Button>
      }
    >
      {/* Search Form */}
      <Form layout="inline" onFinish={handleSearch}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
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
            <Form.Item name="shortName">
              <Input
                placeholder={translate('Search by short name')}
                allowClear
                onChange={(e) => {
                  if (e.target.value === '') {
                    form.setFieldsValue({ shortName: undefined });
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
                  fetchCompanies();
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
        title={currentCompany ? translate('Edit Company') : translate('Add Company')}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={resetForm}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={translate('Company Name')}
                rules={[{ required: true, message: translate('Please input company name') }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="shortName"
                label={translate('Short Name')}
                rules={[{ required: true, message: translate('Please input short name') }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title={translate('Company Details')}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={700}
      >
        {currentCompany && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label={translate('Name')} span={2}>
              {currentCompany.name}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Short Name')}>
              {currentCompany.shortName}
            </Descriptions.Item>
            <Descriptions.Item label={translate('Short Name')}>
              {new Date(currentCompany.createdAt).toLocaleString()}
            </Descriptions.Item>
            {/* <Descriptions.Item label={translate('Created At')}>
              {new Date(currentCompany.createdAt).toLocaleString()}
            </Descriptions.Item> */}
          </Descriptions>
        )}
      </Modal>
    </Card>
  );
}
