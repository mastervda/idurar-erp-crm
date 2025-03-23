import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Form, Input, Select, Col, DatePicker, Button, Row, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import ItemRow from '@/modules/ErpPanelModule/ItemRow';
import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';
import { useSelector } from 'react-redux';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import useWilayah from '@/hooks/useWilayah';

const { Option } = Select;

const ShipmentForm = ({ subTotal = 0, current = null }) => {
  const { last_quote_number } = useSelector(selectFinanceSettings);
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { wilayahData, isLoading, isSuccess } = useWilayah();

  // State untuk Origin
  const [selectedProvinceOrigin, setSelectedProvinceOrigin] = useState(null);
  const [selectedCityOrigin, setSelectedCityOrigin] = useState(null);
  const [selectedDistrictOrigin, setSelectedDistrictOrigin] = useState(null);

  // State untuk Destination
  const [selectedProvinceDestination, setSelectedProvinceDestination] = useState(null);
  const [selectedCityDestination, setSelectedCityDestination] = useState(null);
  const [selectedDistrictDestination, setSelectedDistrictDestination] = useState(null);

  // const removeDuplicates = (array, key) => {
  //   return [...new Map(array.map((item) => [item[key], item])).values()];
  // };
  const uniqueBy = (arr, key) => [...new Map(arr.map((item) => [item[key], item])).values()];

  // Filter data untuk Origin
  const provincesOrigin = uniqueBy(
    wilayahData?.filter((w) => !w.kota && !w.kecamatan && !w.kelurahan) || [],
    'provinsi'
  );
  const citiesOrigin = uniqueBy(
    wilayahData?.filter((w) => w.kota && w.provinsi === selectedProvinceOrigin) || [],
    'kota'
  );
  const districtsOrigin = uniqueBy(
    wilayahData?.filter((w) => w.kecamatan && w.kota === selectedCityOrigin) || [],
    'kecamatan'
  );
  const villagesOrigin = uniqueBy(
    wilayahData?.filter((w) => w.kelurahan && w.kecamatan === selectedDistrictOrigin) || [],
    'kelurahan'
  );

  // Filter data untuk Destination
  const provincesDestination = uniqueBy(
    wilayahData?.filter((w) => !w.kota && !w.kecamatan && !w.kelurahan) || [],
    'provinsi'
  );
  const citiesDestination = uniqueBy(
    wilayahData?.filter((w) => w.kota && w.provinsi === selectedProvinceDestination) || [],
    'kota'
  );
  const districtsDestination = uniqueBy(
    wilayahData?.filter((w) => w.kecamatan && w.kota === selectedCityDestination) || [],
    'kecamatan'
  );
  const villagesDestination = uniqueBy(
    wilayahData?.filter((w) => w.kelurahan && w.kecamatan === selectedDistrictDestination) || [],
    'kelurahan'
  );

  if (last_quote_number === undefined) {
    return null;
  }

  return (
    <>
      <Row gutter={[12, 0]}>
        <Col span={12}>
          <Form.Item name="client" label={translate('PT Tujuan')} rules={[{ required: true }]}>
            <AutoCompleteAsync
              entity="client"
              displayLabels={['name']}
              searchFields="name"
              redirectLabel="Add New Client"
              withRedirect
              urlToRedirect="/customer"
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
        <Col span={8}>
          <Form.Item label={translate('Operator')} name="operator" rules={[{ required: true }]}>
            <Input placeholder={translate('Enter operator name')} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={translate('Admin')} name="admin" rules={[{ required: true }]}>
            <Input placeholder={translate('Enter admin name')} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('Serial Number')}
            name="serialNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder={translate('Enter Serial Number')} />
          </Form.Item>
        </Col>
      </Row>

      {/* Origin Section */}
      <Divider>{translate('Origin')}</Divider>
      <Row gutter={[12, 0]}>
        <Col span={8}>
          <Form.Item
            label={translate('Province')}
            name={['origin', 'province']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Provinsi"
              onChange={setSelectedProvinceOrigin}
              loading={isLoading}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                provincesOrigin.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.provinsi}>
                    {wilayah.provinsi}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('City')}
            name={['origin', 'city']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Kota"
              onChange={setSelectedCityOrigin}
              loading={isLoading}
              disabled={!selectedProvinceOrigin}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                citiesOrigin.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.kota}>
                    {wilayah.kota}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('District')}
            name={['origin', 'district']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Kecamatan"
              onChange={setSelectedDistrictOrigin}
              loading={isLoading}
              disabled={!selectedCityOrigin}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                districtsOrigin.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.kecamatan}>
                    {wilayah.kecamatan}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('Village')}
            name={['origin', 'village']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Kelurahan"
              loading={isLoading}
              disabled={!selectedDistrictOrigin}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                villagesOrigin.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.kelurahan}>
                    {wilayah.kelurahan}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('Address')}
            name={['origin', 'address']}
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder={translate('Enter Address')} />
          </Form.Item>
        </Col>
      </Row>

      {/* Destination Section */}
      <Divider>{translate('Destination')}</Divider>
      <Row gutter={[12, 0]}>
        <Col span={8}>
          <Form.Item
            label={translate('Province')}
            name={['destination', 'province']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Provinsi"
              onChange={setSelectedProvinceDestination}
              loading={isLoading}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                provincesDestination.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.provinsi}>
                    {wilayah.provinsi}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('City')}
            name={['destination', 'city']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Kota"
              onChange={setSelectedCityDestination}
              loading={isLoading}
              disabled={!selectedProvinceDestination}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                citiesDestination.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.kota}>
                    {wilayah.kota}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('District')}
            name={['destination', 'district']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Kecamatan"
              onChange={setSelectedDistrictDestination}
              loading={isLoading}
              disabled={!selectedCityDestination}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                districtsDestination.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.kecamatan}>
                    {wilayah.kecamatan}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('Village')}
            name={['destination', 'village']}
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Pilih Kelurahan"
              loading={isLoading}
              disabled={!selectedDistrictDestination}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {isSuccess &&
                villagesDestination.map((wilayah) => (
                  <Option key={wilayah.kode} value={wilayah.kelurahan}>
                    {wilayah.kelurahan}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={translate('Address')}
            name={['destination', 'address']}
            rules={[{ required: true }]}
          >
            <Input.TextArea placeholder={translate('Enter Address')} />
          </Form.Item>
        </Col>
      </Row>

      {/* Invoice and PO */}
      <Divider>{translate('Invoice and PO')}</Divider>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="client"
            label={translate('Invoice Number')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AutoCompleteAsync
              entity={'invoice'}
              displayLabels={['invoiceNumber']}
              searchFields={'invoiceNumber'}
              redirectLabel={'Add New Invoice'}
              withRedirect
              urlToRedirect={'/invoice'}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Shipment Item Section */}
      <Divider>{translate('Shipment Item')}</Divider>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ItemRow key={field.key} remove={remove} field={field} current={current} />
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                {translate('Add field')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      {/* Save Button */}
      <Row gutter={[12, -5]}>
        <Col span={5}>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
              {translate('Save')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ShipmentForm;
