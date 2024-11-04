import { Box, Divider } from '@mui/material';
import { deserialize } from 'jsonapi-fractal';
import { IframeHTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { authApi } from '@/api/axios';
import PostBox from '@/components/PostBox';
import SitesReport from '@/components/SitesReport';
import useUser from '@/hooks/useUser';
import { Post, Team } from '@/schemas/entities';
import Loader from '@/themed/loader/Loader';
import Title from '@/themed/title/Title';

type Sort = 'asc' | 'desc';

const LookerStudioEmbed = () => {
  return (
    <iframe
      title="Looker Studio Report"
      width="100%"
      height="1000"
      src="https://lookerstudio.google.com/embed/reporting/52ffa4b7-c386-4c77-b5c8-ad765c9f15cc/page/2hjKE"
      scrolling="no"
      className="border-0 p-0 h-min-max overscroll-none overflow-hidden"
      sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
  );
};

const MyCommunity = () => {
  const { t } = useTranslation(['feed', 'errorCodes']);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataList, setDataList] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [all] = useState<boolean>(true);
  const user = useUser();

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

  return (
    <>
      <Title type="page2" label={t('community')} />
      <Divider />
      <Box className="flex pt-6 gap-6">
        <Box className="bg-gray-300 h-full w-full">
          <SitesReport />
          <LookerStudioEmbed />
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
        </Box>
      </Box>
    </>
  );
};

export default MyCommunity;
