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
        height="1180"
        src="https://lookerstudio.google.com/embed/reporting/afe08079-b56d-4a3c-bc34-810b41a0b901/page/FcHUE"
        className="border-0 p-0 h-min-max overscroll-none overflow-hidden"
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

const HeatMap = () => {
  const { t } = useTranslation(['feed', 'errorCodes']);

  useEffect(() => {}, []);

  return (
    <>
      <Title type="page2" label={t('reports.heatMap')} />
      <Divider />
      <Box className="flex  gap-6">
        <Box className="bg-gray-300 h-full w-full">
          <LookerStudioEmbed />
        </Box>
      </Box>
    </>
  );
};

export default HeatMap;
