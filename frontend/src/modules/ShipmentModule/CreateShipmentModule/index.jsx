import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import ShipmentForm from '@/modules/ShipmentModule/Forms/ShipmentForm';

export default function CreateShipmentModule({ config }) {
  return (
    <ErpLayout>
      <CreateItem config={config} CreateForm={ShipmentForm} />
    </ErpLayout>
  );
}
