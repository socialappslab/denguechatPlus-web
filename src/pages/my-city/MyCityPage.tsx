import { useTranslation } from 'react-i18next';
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Tab, Tabs } from '@mui/material';
import useAxios from 'axios-hooks';
import { deserialize } from 'jsonapi-fractal';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ErrorResponse } from 'react-router-dom';
import { authApi } from '@/api/axios';
import Comment from '@/assets/icons/comment.svg';
import ThumbsUp from '@/assets/icons/thumbs-up.svg';
import Trash from '@/assets/icons/trash.svg';
import useUser from '@/hooks/useUser';
import { BaseObject } from '@/schemas';
import { Post, Team } from '@/schemas/entities';
import Loader from '@/themed/loader/Loader';
import { ProgressBar } from '@/themed/progress-bar/ProgressBar';
import Text from '@/themed/text/Text';
import Title from '@/themed/title/Title';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const PostBox = ({ author, date, location, text, likes, image, id }: PostProps) => {
  const { t } = useTranslation('myCity');
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box key={id} className="flex-col border-solid border-neutral-100 rounded-md p-8 flex justify-between mb-4">
      <Box className="flex items-center gap-4 mb-6">
        <Box className="w-20 h-20 bg-green-600 opacity-30 rounded-full" />
        <Box>
          <Text className="mb-0 font-semibold">{author}</Text>
          <Text className="mb-0 opacity-60">
            {date} • {location}
          </Text>
        </Box>
      </Box>
      <Text className="mb-6">{text}</Text>
      <Box className="rounded-lg mb-6 overflow-hidden">
        {image?.photo_url && !imageLoaded && (
          <div role="status" className="animate-pulse w-full">
            <div className="h-96 w-full bg-lightGray rounded-lg" />
          </div>
        )}
        {image?.photo_url && (
          <img
            src={image?.photo_url}
            className="w-full object-cover"
            alt="posted"
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </Box>
      <Box className="flex justify-between gap-4">
        <Box className="flex gap-6">
          <Box className="flex gap-2 hover:bg-neutral-100 px-2 py-1 rounded-md items-center cursor-pointer">
            <img className="self-center" src={ThumbsUp} alt="success" />
            <Text className="mb-0 font-medium opacity-60">{likes}</Text>
          </Box>
          <Box className="flex gap-2 hover:bg-neutral-100 px-2 py-1 rounded-md items-center cursor-pointer">
            <img className="self-center" src={Comment} alt="success" />
            <Text className="mb-0 font-medium opacity-60">{t('post.comment')}</Text>
          </Box>
        </Box>
        <Box className="flex gap-2 hover:bg-neutral-100 px-2 py-1 rounded-md items-center cursor-pointer">
          <img className="self-center" src={Trash} alt="success" />
          <Text className="mb-0 font-medium opacity-60">{t('post.delete')}</Text>
        </Box>
      </Box>
    </Box>
  );
};

// type PostState = Record<
//   string,
//   {
//     post: Post;
//     commentsCount: number;
//     likedByUser: boolean;
//     likesCount: number;
//     loadingLike: boolean;
//   }
// >;

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
  const { t } = useTranslation('myCity');
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
  const { t } = useTranslation('myCity');
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

type Sort = 'asc' | 'desc';

const MyCity = () => {
  const { t } = useTranslation(['myCity', 'errorCodes']);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataList, setDataList] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [all] = useState<boolean>(true);
  const user = useUser();
  const [sortFilter, setSortFilter] = useState<Sort>('desc');
  const [loading, setLoading] = useState(false);
  // const [userRank, setUserRank] = useState();
  // const [greenHouseRank, setGreenHouseRank] = useState();

  const fetchData = async (page: number, teamId?: number | string, sort?: Sort) => {
    setError('');
    try {
      const response = await authApi.get('posts', {
        headers: {
          source: 'mobile',
        },
        params: {
          'filter[team_id]': teamId,
          'page[number]': page,
          'page[size]': 6,
          sort: 'created_at',
          order: sort,
        },
      });

      const data = response?.data;
      if (data) {
        const deserializedData = deserialize<Post>(data);
        if (!deserializedData || !Array.isArray(deserializedData)) return;

        // console.log(
        //   `rows of PAGE ${page} with TEAM ID ${teamId} >>>>`,
        //   deserializedData.map(
        //     (post, index) => `${post.id}-${post.createdBy}-${post.postText}\n`,
        //   ),
        // );

        if (page === 1) {
          const uniqueList = Array.from(new Set(deserializedData.map((item) => item.id)))
            .map((id) => deserializedData.find((item) => item.id === id))
            .filter((item) => item !== undefined);

          // setState((prevState) => {
          //   const newState = { ...prevState };
          //   uniqueList.forEach((post) => {
          //     newState[`${post.id}`] = {
          //       post,
          //       commentsCount: post.commentsCount || 0,
          //       likedByUser: post.likedByUser ?? false,
          //       likesCount: post.likesCount ?? 0,
          //       loadingLike: false,
          //     };
          //   });

          //   return newState;
          // });

          setDataList(uniqueList);
        } else {
          setDataList((prevData) => {
            const updatedList = [...prevData, ...deserializedData];

            const uniqueList = Array.from(new Set(updatedList.map((item) => item.id)))
              .map((id) => updatedList.find((item) => item.id === id))
              .filter((item) => item !== undefined);

            // setState((prevState) => {
            //   const newState = { ...prevState };
            //   uniqueList.forEach((post) => {
            //     newState[`${post.id}`] = {
            //       post,
            //       commentsCount: post.commentsCount || 0,
            //       likedByUser: post.likedByUser ?? false,
            //       likesCount: post.likesCount ?? 0,
            //       loadingLike: false,
            //     };
            //   });

            //   return newState;
            // });

            return uniqueList;
          });
        }

        // console.log("data.links>>>", data.links);
        setHasMore(data.links?.self !== data.links?.last);
      }
    } catch (err) {
      console.log('error>>>>>>', err);
      setError(t('errorCodes:generic'));
    } finally {
      setLoadingMore(false);
    }
  };

  const loadMoreData = () => {
    if (!loadingMore && hasMore && !error) {
      console.log('hi');
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      console.log('loadMoreData>>>> ', nextPage);
      setCurrentPage(nextPage);
      fetchData(nextPage, all ? undefined : (user?.team as Team)?.id);
    }
  };

  const firstLoad = () => {
    // setAll(true);
    setDataList([]);
    setHasMore(true);
    setCurrentPage(1);
    fetchData(1, undefined);
  };

  useEffect(() => {
    firstLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectOptionChange = async (e: SelectChangeEvent) => {
    const selectedSort = e?.target.value as Sort;
    setSortFilter(selectedSort);
    setLoading(true);
    await fetchData(currentPage, undefined, selectedSort);
    setLoading(false);
  };

  // const loadMoreData = () => {
  //   if (!loadingMore && hasMore && !error) {
  //     setLoadingMore(true);
  //     const nextPage = currentPage + 1;
  //     console.log('loadMoreData>>>> ', nextPage);
  //     setCurrentPage(nextPage);
  //     fetchData(nextPage, all ? undefined : (meData?.userProfile?.team as Team)?.id);
  //   }
  // };

  return (
    <>
      <Title type="page2" label={`${t('title')} ${(user?.city as BaseObject)?.name}`} />
      <Divider />
      <Box className="flex pt-6 gap-6">
        <Box className="w-2/3 bg-gray-300 h-full">
          <Box className="border-solid border-neutral-100 rounded-md p-4 flex justify-between items-center mb-4">
            <Title label={t('layout.filters')} type="subsection" className="mb-0" />
            <FormControl className="w-1/3" variant="outlined">
              <InputLabel id="label-attribute-search">{t('layout.filter.order')}</InputLabel>
              <Select
                variant="outlined"
                labelId="label-attribute-search"
                value={sortFilter}
                onChange={handleSelectOptionChange}
                label="Search"
              >
                <MenuItem value="desc">{t('layout.filter.latest')}</MenuItem>
                <MenuItem value="asc">{t('layout.filter.oldest')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {loading && <Loader />}
          {!loading && (
            <InfiniteScroll
              loader={<Loader />}
              hasMore={hasMore}
              dataLength={dataList.length}
              next={() => loadMoreData()}
            >
              {dataList.map((post) => (
                <PostBox
                  id={post.id}
                  author={`${post.createByUser.userName} ${post.createByUser.lastName}`}
                  text={post.postText}
                  location={post.location}
                  likes={post.likesCount}
                  date={post.createdAt}
                  image={post.photoUrl}
                />
              ))}
            </InfiniteScroll>
          )}
        </Box>
        <Box className="w-1/3 bg-gray-300 h-full">
          <RiskChart />
          <RankViewBox />
        </Box>
      </Box>
    </>
  );
};

interface PostProps {
  id: number;
  author: string;
  date: number;
  location: string;
  text: string;
  image?: { photo_url: string };
  likes: number;
}

export default MyCity;
