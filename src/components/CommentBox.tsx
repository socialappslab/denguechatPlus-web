import { Box } from '@mui/material';
import useAxios from 'axios-hooks';
import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { useEffect, useState } from 'react';
import ThumbsUp from '@/assets/icons/thumbs-up.svg';
import useLangContext from '@/hooks/useLangContext';
import Loader from '@/themed/loader/Loader';
import Text from '@/themed/text/Text';
import { formatDateFromString } from '@/util';

interface CommentBoxProps {
  postId: number;
}

interface IComment {
  content: string;
  createdAt: string;
  id: number;
  likesCount: number;
  photos?: string;
  postId: number;
  updatedAt: string;
  canDeleteByUser: boolean;
  canEditByUser: boolean;
  createdBy: ICommentUser;
}

interface ICommentUser {
  accountId: number;
  lastName: string;
  userName: string;
}

const CommentBox = ({ postId }: CommentBoxProps) => {
  const [{ data, loading, error }] = useAxios({
    url: `/posts/${postId}`,
  });
  const [comments, setComments] = useState<DocumentObject[]>([]);
  const langContext = useLangContext();

  useEffect(() => {
    if (!data) return;
    const deserializedData = deserialize<{ comments: DocumentObject[] }>(data) as { comments: DocumentObject[] }[];
    const first = deserializedData.shift();
    if (first) setComments(first.comments);
  }, [data]);

  return (
    <>
      {loading && <Loader height="15vh" />}
      {!loading &&
        comments.map((commentData) => {
          const comment = deserialize<IComment>(commentData) as IComment;
          const acronym = `${comment.createdBy.userName[0]}${comment.createdBy.lastName[0]}`;

          return (
            <Box>
              <Box className="flex items-center gap-4 mt-6">
                <Box className="min-w-20 min-h-20 -tracking-4 bg-green-100 rounded-full flex items-center justify-center">
                  <Text className="mb-0 text-green-800 font-bold -tracking-4 uppercase">{acronym}</Text>
                </Box>
                <Box>
                  <Box className="flex gap-2">
                    <Text className="mb-0 font-semibold">
                      {comment.createdBy.userName} {comment.createdBy.lastName}
                    </Text>
                    <Text className="mb-0 opacity-60 max-w-max">
                      {formatDateFromString(langContext.state.selected, comment.createdAt)}
                    </Text>
                  </Box>
                  <Text className="mb-0">{comment.content}</Text>
                  <Box className="flex gap-2 rounded-md items-center">
                    <img className="self-center" src={ThumbsUp} alt="success" />
                    <Text className="mb-0 font-medium opacity-60">{comment.likesCount}</Text>
                  </Box>
                </Box>
              </Box>
              {error && <p>Something wrong happened</p>}
            </Box>
          );
        })}
    </>
  );
};

export default CommentBox;
