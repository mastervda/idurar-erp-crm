import React from 'react';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import TaxForm from '@/forms/TaxForm';
import { useDate } from '@/settings';
import ShipmentDataTableModule from '@/modules/ShipmentModule/ShipmentDataTableModule';

export default function Shipment() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'shipment';

  const searchConfig = {
    entity: 'client',
    displayLabels: ['number', 'client.name'],
    searchFields: 'number,client.name',
    outputValue: '_id',
  };
  const deleteModalLabels = ['number', 'client.name'];

  const dataTableColumns = [
    {
      title: translate('Tanggal'),
      dataIndex: 'date',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: translate('operator'),
      dataIndex: 'operator',
    },
    {
      title: translate('admin'),
      dataIndex: 'admin',
    },
    {
      title: translate('Serial Number'),
      dataIndex: 'serialNumber',
    },
    {
      title: translate('Lokasi Pickup'),
      dataIndex: 'origin.address',
    },
    {
      title: translate('Lokasi Tujuan'),
      dataIndex: 'destination.address',
    },
    {
      title: translate('PIC Tujuan'),
      dataIndex: 'picTujuan',
    },
    {
      title: translate('PT Tujuan'),
      dataIndex: ['client', 'name'],
    },
    {
      title: translate('PIC Doring'),
      dataIndex: 'picDoring',
    },
    {
      title: translate('Kapal'),
      dataIndex: 'kapal',
    },
    {
      title: translate('Asuransi'),
      dataIndex: 'asuransi',
    },
    {
      title: translate('Keterangan'),
      dataIndex: 'keterangan',
    },
    {
      title: translate('Berita Acara PDF'),
      dataIndex: 'bast_url',
    },
    {
      title: translate('Invoice Number'),
      dataIndex: 'invoiceNumber',
    },
    {
      title: translate('Invoice Description'),
      dataIndex: 'invoiceDescription',
    },
  ];

  const Label = {
    PANEL_TITLE: translate('shipment'),
    DATATABLE_TITLE: translate('shipment_list'),
    ADD_NEW_ENTITY: translate('add_new_shipment'),
    ENTITY_NAME: translate('shipment'),
  };

  const configPage = {
    entity: 'shipment',
    ...Label,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };
  return <ShipmentDataTableModule config={config} />;
}
