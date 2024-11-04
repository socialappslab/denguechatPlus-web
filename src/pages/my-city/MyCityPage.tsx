import { Box, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { deserialize } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { authApi } from '@/api/axios';
import PostBox from '@/components/PostBox';
import RiskChart from '@/components/RiskChart';
import RankViewBox from '@/components/list/RankViewBox';
import useUser from '@/hooks/useUser';
import { BaseObject } from '@/schemas';
import { Post, Team } from '@/schemas/entities';
import Loader from '@/themed/loader/Loader';
import Title from '@/themed/title/Title';

type Sort = 'asc' | 'desc';

const MyCity = () => {
  const { t } = useTranslation(['feed', 'errorCodes']);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataList, setDataList] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [all] = useState<boolean>(true);
  const user = useUser();
  const [sortFilter, setSortFilter] = useState<Sort>('desc');
  const [loading, setLoading] = useState(false);

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

        if (page === 1) {
          const uniqueList = Array.from(new Set(deserializedData.map((item) => item.id)))
            .map((id) => deserializedData.find((item) => item.id === id))
            .filter((item) => item !== undefined);

          setDataList(uniqueList);
        } else {
          setDataList((prevData) => {
            const updatedList = [...prevData, ...deserializedData];

            const uniqueList = Array.from(new Set(updatedList.map((item) => item.id)))
              .map((id) => updatedList.find((item) => item.id === id))
              .filter((item) => item !== undefined);

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

  return (
    <>
      <Title type="page2" label={`${t('city')} ${(user?.city as BaseObject)?.name}`} />
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
                  acronym={`${post.createByUser.userName[0]}${post.createByUser.lastName[0]}`}
                  text={post.postText}
                  location={post.location}
                  likes={post.likesCount}
                  date={post.createdAt}
                  image={post.photoUrl}
                  comments={post.commentsCount}
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

export default MyCity;
