import { Box } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Comment from '@/assets/icons/comment.svg';
import ThumbsUp from '@/assets/icons/thumbs-up.svg';
import Trash from '@/assets/icons/trash.svg';
import Text from '@/themed/text/Text';
import CommentBox from './CommentBox';

interface PostProps {
  id: number;
  author: string;
  date: number;
  location: string;
  text: string;
  image?: { photo_url: string };
  likes: number;
  comments?: number;
  acronym: string;
}

const PostBox = ({ author, date, location, text, likes, image, id, comments, acronym }: PostProps) => {
  const { t } = useTranslation('feed');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [openComments, setOpenComments] = useState(false);

  return (
    <Box key={id} className="flex-col border-solid border-neutral-100 rounded-md p-8 flex justify-between mb-4">
      <Box className="flex items-center gap-4 mb-6">
        <Box className="w-20 h-20 -tracking-4 bg-green-100 rounded-full flex items-center justify-center">
          <Text className="mb-0 text-green-800 font-bold -tracking-4 uppercase">{acronym}</Text>
        </Box>
        <Box>
          <Text className="mb-0 font-semibold">{author}</Text>
          <Text className="mb-0 opacity-60">
            {date} • {location}
          </Text>
        </Box>
      </Box>
      <Text className={`mb-0 ${image?.photo_url && 'mb-4'}`}>{text}</Text>
      <Box className="rounded-lg mb-4 overflow-hidden">
        {image?.photo_url && !imageLoaded && (
          <div role="status" className="animate-pulse w-full">
            <div className="h-96 w-full bg-lightGray opacity-50 rounded-lg" />
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
          <Box className="flex gap-2 px-2 py-1 rounded-md items-center cursor-default">
            <img className="self-center" src={ThumbsUp} alt="success" />
            <Text className="mb-0 font-medium opacity-60">{likes}</Text>
          </Box>
          <Box
            onClick={() => {
              if (!comments) return;
              setOpenComments((prev) => !prev);
            }}
            className={`flex gap-2 px-2 py-1 rounded-md items-center ${comments ? 'cursor-pointer hover:bg-neutral-100' : 'cursor-default'}`}
          >
            <img className="self-center" src={Comment} alt="success" />
            <Text className="mb-0 font-medium opacity-60">
              {comments} {t('post.comment')}
            </Text>
          </Box>
        </Box>
        <Box className="flex gap-2 px-2 py-1 rounded-md items-center cursor-default">
          <img className="self-center" src={Trash} alt="success" />
          <Text className="mb-0 font-medium opacity-60">{t('post.delete')}</Text>
        </Box>
      </Box>
      {openComments && <CommentBox postId={id} />}
    </Box>
  );
};

export default PostBox;
