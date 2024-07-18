import { useTranslation } from 'react-i18next';
import DataTableExample from '../../themed/table/DataTableExample';
import { Title } from '../../themed/title/Title';

export function OrganizationsAdmin() {
  const { t } = useTranslation('translation');

  return (
    <>
      <Title type="page" label={t('Organizations')} className="mb-8" />
      <DataTableExample />
    </>
  );
}

export default OrganizationsAdmin;
