import dayjs from 'dayjs';
import useLanguage from '@/locale/useLanguage';
import ClientDataTableModule from '@/modules/ClientModule/ClientDataTableModule';

export default function Client() {
  const translate = useLanguage();
  const entity = 'client';

  const searchConfig = {
    entity: 'client',
    displayLabels: ['name', 'email'],
    searchFields: 'name,email,phone,company.name',
  };

  const deleteModalLabels = ['name'];

  const dataTableColumns = [
    {
      title: translate('No'),
      dataIndex: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: translate('Name Admin'),
      dataIndex: 'name',
    },
    {
      title: translate('Company'),
      dataIndex: ['company', 'name'],
      render: (_, record) => (
        <span>
          {record.company?.name}
          {record.company?.shortName && ` (${record.company.shortName})`}
        </span>
      ),
    },
    {
      title: translate('Tags'),
      dataIndex: 'tags',
      render: (tags) => tags?.map((tag) => tag.name).join(', ') || '-',
    },
    {
      title: translate('Phone'),
      dataIndex: 'phone',
    },
    {
      title: translate('Email'),
      dataIndex: 'email',
    },
    {
      title: translate('Country'),
      dataIndex: 'country',
    },
    {
      title: translate('Address'),
      dataIndex: 'address',
    },
    {
      title: translate('Created By'),
      dataIndex: ['createdBy', 'name'],
    },
    {
      title: translate('Created Date'),
      dataIndex: 'created',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('Clients'),
    DATATABLE_TITLE: translate('Client List'),
    ADD_NEW_ENTITY: translate('Add New Client'),
    ENTITY_NAME: translate('Client'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return <ClientDataTableModule config={config} />;
}
