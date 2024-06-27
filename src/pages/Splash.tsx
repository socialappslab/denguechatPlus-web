import { useTranslation } from 'react-i18next';
import { Title } from '../themed/title/Title';

function Splash() {
  const { t } = useTranslation('translation');

  return <Title type="section" className="self-center mb-8" label={t('Splash')} />;
}
export default Splash;
