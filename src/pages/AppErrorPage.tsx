import { useTranslation } from 'react-i18next';
import { Text } from '../themed/text/Text';
import Title from '../themed/title/Title';

export type AppErrorPageProps = {
  message: string;
};

export function AppErrorPage({ message }: AppErrorPageProps) {
  const { t } = useTranslation('translation');

  return (
    <>
      <Title type="page" label={t('oops')} />
      <Text>{message}</Text>
    </>
  );
}

export default AppErrorPage;
