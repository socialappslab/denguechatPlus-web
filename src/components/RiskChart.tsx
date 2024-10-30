import { Box } from '@mui/material';
import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { ErrorResponse } from 'react-router-dom';
import useUser from '@/hooks/useUser';
import { BaseObject } from '@/schemas';
import Loader from '@/themed/loader/Loader';
import { ProgressBar } from '@/themed/progress-bar/ProgressBar';
import Title from '@/themed/title/Title';

interface HouseReport {
  greenQuantity: number;
  houseQuantity: number;
  orangeQuantity: number;
  redQuantity: number;
  siteVariationPercentage: number;
  visitQuantity: number;
  visitVariationPercentage: number;
}

const RiskChart = () => {
  const { t } = useTranslation('feed');
  const user = useUser();

  const [{ data, loading }] = useAxios<HouseReport, null, ErrorResponse>({
    url: `reports/house_status`,
  });

  const label = `${(user?.team as BaseObject)?.name}: ${t('riskChart.title')}`;

  return (
    <Box className="border-solid border-neutral-100 rounded-md p-6 mb-4">
      <Title label={label} type="subsection" className="mb-0" />
      <Box className="flex flex-col mt-6">
        {loading && <Loader />}
        {!loading && (
          <>
            <ProgressBar label={t('riskChart.greenSites')} progress={data?.greenQuantity || 0} color="green-600" />
            <ProgressBar label={t('riskChart.yellowSites')} progress={data?.orangeQuantity || 0} color="yellow-600" />
            <ProgressBar label={t('riskChart.redSites')} progress={data?.redQuantity || 0} color="red-600" />
          </>
        )}
      </Box>
    </Box>
  );
};

export default RiskChart;
