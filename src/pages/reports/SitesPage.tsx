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
        src="https://lookerstudio.google.com/embed/reporting/ca92353e-36a4-425e-821d-bdda3f450d4d/page/hhHUE"
        className="border-0 p-0 h-min-max overscroll-none overflow-hidden"
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

const Site = () => {
  const { t } = useTranslation(['feed', 'errorCodes']);

  useEffect(() => {}, []);

  return (
    <>
      <Title type="page2" label={t('reports.houseResume')} />
      <Divider />
      <Box className="flex  gap-6">
        <Box className="bg-gray-300 h-full w-full">
          <LookerStudioEmbed />
        </Box>
      </Box>
    </>
  );
};

export default Site;
