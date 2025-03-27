import { ErpLayout } from '@/layout';
import CreateItem from '@/modules/ErpPanelModule/CreateItem';
import ClientForm from '@/modules/ClientModule/Forms/ClientForm';

export default function CreateClientModule({ config }) {
  return (
    <ErpLayout>
      {/* <CreateItem config={config} CreateForm={ClientForm} />
       */}
      <CreateItem
        config={{
          config,
          entity: 'client',
          disableReadRedirect: true,
        }}
        CreateForm={ClientForm}
      />
    </ErpLayout>
  );
}
