import { Box, Divider } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/themed/title/Title';

const LookerStudioEmbed = () => {
  return (
    <div className="w-full flex">
      <iframe
        title="Looker Studio Report"
        width="85%"
        height="2050"
        src={import.meta.env.VITE_VISIT_URL}
        className="border-0 p-0 h-min-max overscroll-none overflow-hidden"
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

const Visit = () => {
  const { t } = useTranslation(['feed', 'errorCodes']);

  useEffect(() => {}, []);

  return (
    <>
      <Title type="page2" label={t('reports.visits')} />
      <Divider />
      <Box className="flex  gap-6">
        <Box className="bg-gray-300 h-full w-full">
          <LookerStudioEmbed />
        </Box>
      </Box>
    </>
  );
};

export default Visit;
