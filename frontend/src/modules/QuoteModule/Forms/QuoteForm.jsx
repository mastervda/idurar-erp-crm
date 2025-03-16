import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import {
  Form,
  Button,
  Select,
  Divider,
  Row,
  Col,
  Typography,
  DatePicker,
  Descriptions,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import ItemRow from '@/modules/ErpPanelModule/ItemRow';
import SelectAsync from '@/components/SelectAsync';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';
import calculate from '@/utils/calculate';

const { Title } = Typography;

const defaultSelectOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
];

export default function QuoteForm({ subTotal = 0, current = null }) {
  const { last_quote_number } = useSelector(selectFinanceSettings);
  return last_quote_number !== undefined ? (
    <LoadQuoteForm subTotal={subTotal} current={current} />
  ) : null;
}

function LoadQuoteForm({ subTotal = 0, current = null }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { last_quote_number } = useSelector(selectFinanceSettings);
  const addField = useRef(null);

  const [lastNumber, setLastNumber] = useState(last_quote_number + 1);
  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedClient, setSelectedClient] = useState(null); // Add state for selectedClient

  useEffect(() => {
    if (current) {
      const { taxRate = 0, year, number } = current;
      setTaxRate(taxRate / 100);
      setCurrentYear(year);
      setLastNumber(number);
    }
  }, [current]);

  useEffect(() => {
    const taxAmount = calculate.multiply(subTotal, taxRate);
    setTaxTotal(parseFloat(taxAmount));
    setTotal(parseFloat(calculate.add(subTotal, taxAmount)));
  }, [subTotal, taxRate]);

  useEffect(() => {
    addField.current?.click();
  }, []);

  useEffect(() => {
    console.log('Selected Client:', selectedClient);
  }, [selectedClient]);

  const handleClientChange = (_, option) => {
    console.log('option', option)
    console.log('_', _)
    setSelectedClient(option?.data || null);
  };

  return (
    <>
      <Divider>{translate('customer_data')}</Divider>
      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item name="client" label={translate('Client')} rules={[{ required: true }]}>
            <AutoCompleteAsync
              entity="client"
              displayLabels={['name']}
              searchFields="name"
              redirectLabel="Add New Client"
              withRedirect
              urlToRedirect="/customer"
              onSelect={(value, option) => handleClientChange(value, option)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="date"
            label={translate('Date')}
            rules={[{ required: true, type: 'object' }]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
        <Col span={24}>
          {selectedClient && (
            <>
              <Divider>{translate('Client Details')}</Divider>
              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label={translate('name')}>
                  {selectedClient.name}
                </Descriptions.Item>
                <Descriptions.Item label={translate('email')}>
                  {selectedClient.email}
                </Descriptions.Item>
                <Descriptions.Item label={translate('phone')}>
                  {selectedClient.phone}
                </Descriptions.Item>
                <Descriptions.Item label={translate('country')}>
                  {selectedClient.country}
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Col>
      </Row>

      {renderLocationSection(translate, 'pickup_location', 'origin_')}
      {renderLocationSection(translate, 'destination_location', 'destination_')}

      <Divider>{translate('items')}</Divider>
      <Row gutter={[12, 12]} style={{ position: 'relative' }}>
        {['Item', 'Description', 'Quantity', 'Price', 'Total'].map((label, index) => (
          <Col key={index} span={[5, 7, 3, 4, 5][index]}>
            <p>{translate(label)}</p>
          </Col>
        ))}
      </Row>

      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ItemRow key={field.key} remove={remove} field={field} current={current} />
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addField}
              >
                {translate('Add field')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {renderSummarySection(translate, subTotal, taxRate, taxTotal, total, setTaxRate)}
    </>
  );
}

function renderLocationSection(translate, titleKey, namePrefix) {
  return (
    <>
      <Divider>{translate(titleKey)}</Divider>
      <Row gutter={[12, 0]}>
        {['country', 'province', 'city', 'district', 'village'].map((field) => (
          <Col key={field} span={8}>
            <Form.Item
              label={translate(field)}
              name={`${namePrefix}${field}`}
              initialValue={'draft'}
            >
              <Select
                options={defaultSelectOptions.map((option) => ({
                  ...option,
                  label: translate(option.label),
                }))}
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </>
  );
}

function renderSummarySection(translate, subTotal, taxRate, taxTotal, total, setTaxRate) {
  return (
    <>
      <Divider dashed />
      <Row gutter={[12, -5]}>
        <Col span={5}>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
              {translate('Save')}
            </Button>
          </Form.Item>
        </Col>
        <Col span={4} offset={10} style={{ textAlign: 'right' }}>
          <p>{translate('Sub Total')} :</p>
        </Col>
        <Col span={5}>
          <MoneyInputFormItem readOnly value={subTotal} />
        </Col>
      </Row>
      <Row gutter={[12, -5]}>
        <Col span={4} offset={15}>
          <Form.Item name="taxRate" rules={[{ required: true }]}>
            <SelectAsync
              value={taxRate}
              onChange={(value) => setTaxRate(value / 100)}
              entity="taxes"
              outputValue="taxValue"
              displayLabels={['taxName']}
              withRedirect
              urlToRedirect="/taxes"
              redirectLabel={translate('Add New Tax')}
              placeholder={translate('Select Tax Value')}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <MoneyInputFormItem readOnly value={taxTotal} />
        </Col>
      </Row>
      <Row gutter={[12, -5]}>
        <Col span={4} offset={15} style={{ textAlign: 'right' }}>
          <p>{translate('Total')} :</p>
        </Col>
        <Col span={5}>
          <MoneyInputFormItem readOnly value={total} />
        </Col>
      </Row>
    </>
  );
}
