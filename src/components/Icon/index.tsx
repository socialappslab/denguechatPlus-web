/* 
  Helper component to render SVG icons
  when importing a new svg icon, add it to the IconMap object
  and that <svg /> and <path /> elements have the "fill" attribute set to "current"
*/

import Success from '@/assets/icons/success.svg?react';
import Verified from '@/assets/icons/verified.svg?react';

const IconMap = {
  Verified,
  Success,
};

const Icon = ({
  type,
  className,
  ...rest
}: {
  type: keyof typeof IconMap;
  fill?: string;
  className?: string;
  rest?: React.ImgHTMLAttributes<HTMLImageElement>;
}) => {
  const Component = IconMap[type];
  return <Component className={className} {...rest} />;
};

export default Icon;
