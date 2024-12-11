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
    headers: {
      source: 'visits',
    },
  });

  const label = `${(user?.team as BaseObject)?.name}: ${t('riskChart.title')}`;
  const totalQuantity = (data?.redQuantity || 0) + (data?.orangeQuantity || 0) + (data?.greenQuantity || 0);
  return (
    <Box className="border-solid border-neutral-100 rounded-md p-6 mb-4">
      <Title label={label} type="subsection" className="mb-0" />
      <Box className="flex flex-col mt-6">
        {loading && <Loader />}
        {!loading && (
          <>
            <ProgressBar
              label={t('riskChart.greenSites')}
              value={data?.greenQuantity || 0}
              progress={totalQuantity > 0 ? Math.round(((data?.greenQuantity || 0) / totalQuantity) * 100) : 0}
              color="bg-green-600"
            />
            <ProgressBar
              label={t('riskChart.yellowSites')}
              value={data?.orangeQuantity || 0}
              progress={totalQuantity > 0 ? Math.round(((data?.orangeQuantity || 0) / totalQuantity) * 100) : 0}
              color="bg-yellow-600"
            />
            <ProgressBar
              label={t('riskChart.redSites')}
              value={data?.redQuantity || 0}
              progress={totalQuantity > 0 ? Math.round(((data?.redQuantity || 0) / totalQuantity) * 100) : 0}
              color="bg-red-600"
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default RiskChart;
