import useLanguage from '@/locale/useLanguage';
import CreateShipmentModule from '@/modules/ShipmentModule/CreateShipmentModule';

export default function ShipmentCreate() {
  const translate = useLanguage();

  const entity = 'shipment';

  const Labels = {
    PANEL_TITLE: translate('shipment'),
    DATATABLE_TITLE: translate('shipment_list'),
    ADD_NEW_ENTITY: translate('add_new_shipment'),
    ENTITY_NAME: translate('shipment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <CreateShipmentModule config={configPage} />;
}
