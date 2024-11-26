/* 
  Helper component to render SVG icons
  when importing a new svg icon, add it to the IconMap object
  and that <svg /> and <path /> elements have the "fill" attribute set to "current" 
*/

import Success from '@/assets/icons/success.svg?react';
import Verified from '@/assets/icons/verified.svg?react';
import Hello from '@/assets/icons/hello.svg?react';
import City from '@/assets/icons/city.svg?react';
import Comment from '@/assets/icons/comment.svg?react';
import Trash from '@/assets/icons/trash.svg?react';
import ThumbsUp from '@/assets/icons/thumbs-up.svg';
import Community from '@/assets/icons/community.svg?react';
import Data from '@/assets/icons/data.svg?react';
import Register from '@/assets/icons/register.svg?react';
import Export from '@/assets/icons/export.svg?react';
import FactCheck from '@/assets/icons/fact-check.svg?react';
import { COLORS } from '@/constants';

const IconMap = {
  Verified,
  Success,
  Hello,
  City,
  Community,
  Data,
  Register,
  Export,
  Comment,
  Trash,
  ThumbsUp,
  FactCheck,
};

const Icon = ({
  type,
  className,
  fill = COLORS.gray as string,
  ...rest
}: {
  type: keyof typeof IconMap;
  fill?: string;
  className?: string;
  rest?: React.ImgHTMLAttributes<HTMLImageElement>;
}) => {
  const Component = IconMap[type];
  return <Component fill={fill} className={className} {...rest} />;
};

export default Icon;
