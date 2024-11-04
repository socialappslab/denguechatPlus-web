import { Box, Tab, Tabs } from '@mui/material';
import useAxios from 'axios-hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Text from '@/themed/text/Text';
import Loader from '@/themed/loader/Loader';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

enum RankView {
  VisitRank = 'visitRank',
  GreenHouseRank = 'greenHouseRank',
}

interface Rank {
  first_name: string;
  last_name: string;
  quantity: number;
}

interface BrigadistPerformance {
  visitRank: Rank[];
  greenHouseRank: Rank[];
}

const RankViewBox = () => {
  const { t } = useTranslation('feed');
  const [rankView, setRankView] = useState(RankView.VisitRank);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setRankView(Object.values(RankView)[newValue] as RankView);
  };

  const [{ data, loading, error }] = useAxios<BrigadistPerformance>({
    url: `/reports/brigadists_performance`,
  });

  const value = Object.values(RankView).indexOf(rankView);

  return (
    <Box className="border-solid border-neutral-100 rounded-md">
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label={t('rankView.users')} {...a11yProps(0)} className="w-1/2" />
        <Tab label={t('rankView.greenHouses')} {...a11yProps(1)} className="w-1/2" />
      </Tabs>
      <Box className="flex flex-col p-6">
        {error && <p>Error</p>}
        {loading && <Loader />}
        {!loading && (
          <>
            <Box className="flex justify-between mb-4">
              <Text className="text-neutral-400 opacity-60">{t('rankView.ranking')}</Text>
              <Text className="text-neutral-400 opacity-60">{t('rankView.visits')}</Text>
            </Box>
            <Box>
              {data &&
                data[rankView].map((item) => (
                  <Box className="flex justify-between mb-6" key={item.first_name + item.quantity}>
                    <Box className="flex flex-row items-center gap-3">
                      <Box className="rounded-full h-10 w-10 bg-neutral-100" />
                      <Text className="font-semibold text-neutral-400 opacity-70 mb-0">
                        {item.first_name} {item.last_name}
                      </Text>
                    </Box>
                    <Text className="font-semibold text-green-800 mb-0">{item.quantity}</Text>
                  </Box>
                ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default RankViewBox;
