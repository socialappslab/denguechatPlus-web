import { useTranslation } from 'react-i18next';
import { Title } from '../../themed/title/Title';

export function HomeAdmin() {
  const { t } = useTranslation('translation');

  return <Title type="page" label={t('home')} className="mb-8" />;
}

export default HomeAdmin;
