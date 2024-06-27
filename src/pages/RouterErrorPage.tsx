/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router-dom';
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
