import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '@/themed/progress-bar/ProgressBar';
import Title from '@/themed/title/Title';

const SitesReport = () => {
  const { t } = useTranslation('feed');

  return (
    <Box className="border-solid border-neutral-100 rounded-md p-6 mb-4">
      <Title label={t('sitesReport.title')} type="subsection" className="mb-0" />
      <Box className="flex flex-col mt-6">
        <>
          <ProgressBar label={t('sitesReport.title')} progress={60} color="bg-green-600" />
          <ProgressBar label={t('sitesReport.quantity')} progress={80} color="bg-green-800" />
        </>
      </Box>
    </Box>
  );
};

export default SitesReport;
