import { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, Row, Col, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SelectAsync from '@/components/SelectAsync';
import SelectClientAsync from '@/components/SelectClientAsync';

export default function ClientForm({ current = null, form }) {
  const translate = useLanguage();
  // Initialize form with current values
  useEffect(() => {
    if (current) {
      const newValues = {
        ...current,
        company: current.company?._id || current.company || undefined,
        tags: current.tag?.map((tag) => tag._id || tag) || [],
      };

      if (JSON.stringify(form.getFieldsValue()) !== JSON.stringify(newValues)) {
        form.setFieldsValue(newValues);
      }
    } else {
      form.resetFields();
    }
  }, [current, form]);

  return (
    <>
      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item
            name="name"
            label={translate('Admin')}
            rules={[{ required: true, message: translate('Please input Admin name') }]}
          >
            <Input placeholder={translate('Enter Admin name')} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="phone" label={translate('Phone')}>
            <Input placeholder={translate('Enter phone number')} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item
            name="email"
            label={translate('Email')}
            rules={[{ type: 'email', message: translate('Please enter a valid email') }]}
          >
            <Input placeholder={translate('Enter email')} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="country" label={translate('Country')}>
            <Input placeholder={translate('Enter country')} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="address" label={translate('Address')}>
        <Input.TextArea rows={3} placeholder={translate('Enter address')} />
      </Form.Item>

      <Divider dashed />

      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item
            name="company"
            label={translate('Company')}
            rules={[{ required: true, message: translate('Please select a company') }]}
          >
            <AutoCompleteAsync
              entity="company"
              displayLabels={['name']}
              searchFields="name"
              redirectLabel={translate('Add New Company')}
              withRedirect
              urlToRedirect="/company"
              // labelInValue={false}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="tags" label={translate('Tags')}>
            <SelectClientAsync
              mode="multiple"
              entity="tag"
              displayLabels={['name']}
              searchFields="name"
              redirectLabel={translate('Add New Tag')}
              withRedirect
              urlToRedirect="/tag"
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
              {translate('Save')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
