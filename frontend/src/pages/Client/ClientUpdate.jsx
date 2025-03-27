import useLanguage from '@/locale/useLanguage';
import UpdateClientModule from '@/modules/ClientModule/UpdateClientModule';

export default function ClientUpdate() {
  const entity = 'client';
  const translate = useLanguage();
  const Labels = {
    PANEL_TITLE: translate('client'),
    DATATABLE_TITLE: translate('client_list'),
    ADD_NEW_ENTITY: translate('add_new_client'),
    ENTITY_NAME: translate('client'),
  };

  const configPage = {
    disableReadRedirect: true,
    entity,
    ...Labels,
  };
  return <UpdateClientModule config={configPage} />;
}
