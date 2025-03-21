import { Box } from '@mui/material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { ErrorResponse } from 'react-router-dom';
import { ProgressBar } from '@/themed/progress-bar/ProgressBar';
import Title from '@/themed/title/Title';

interface TarikiHouseReport {
  totalHousesQty: number;
  tarikiHousesQty: number;
  tarikiPercentage: number;
  greenContainerQty: number;
  totalContainerQty: number;
  greenContainerPercentage: number;
}

const SitesReport = () => {
  const { t } = useTranslation('feed');

  const [{ data }] = useAxios<TarikiHouseReport, null, ErrorResponse>({
    url: `reports/tariki_houses`,
  });

  return (
    <Box className="border-solid border-neutral-100 rounded-md p-6 mb-10">
      <Title label={t('sitesReport.shortTitle')} type="subsection" className="mb-0" />
      <Box className="flex flex-col mt-6">
        <>
          <ProgressBar
            label={t('sitesReport.title')}
            value={data?.totalHousesQty ?? 0}
            progress={data?.tarikiPercentage ?? 0}
            color="bg-green-600"
            tooltip={t('sitesReport.tarikiSiteInfo')}
            description={`${data?.tarikiHousesQty} ${t('sitesReport.description')} ${data?.totalHousesQty} ${t('sitesReport.sites')}`}
          />
          <ProgressBar
            label={t('sitesReport.quantity')}
            value={data?.totalContainerQty ?? 0}
            progress={data?.greenContainerPercentage ?? 0}
            color="bg-green-800"
            tooltip={t('sitesReport.greenContainersInfo')}
            description={`${data?.greenContainerQty} ${t('sitesReport.description')} ${data?.totalContainerQty} ${t('sitesReport.containers')}`}
          />
        </>
      </Box>
    </Box>
  );
};

export default SitesReport;
