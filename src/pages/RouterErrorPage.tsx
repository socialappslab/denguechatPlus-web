 
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router';
import PageLayout from '../layout/PageLayout';
import { Text } from '../themed/text/Text';
import { Title } from '../themed/title/Title';

export default function RouterErrorPage() {
  const { t } = useTranslation('translation');
  const error = useRouteError();

  let message = '';
  if (typeof (error as { statusText?: string })?.statusText === 'string') {
    message = t((error as { statusText?: string }).statusText as any);
  } else if (typeof error === 'string') {
    message = t(error as any);
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String((error as { message: unknown }).message);
  } else {
    message = t('generalError');
  }

  return (
    <PageLayout>
      <Title type="page" label={t('oops')} />
      <Text>{message}</Text>
    </PageLayout>
  );
}
