import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type TextTypeType = 'menuItem';

export type TextProps = {
  className?: string;
  type?: TextTypeType;
};

export function Text({ children, type, className }: TextProps & PropsWithChildren) {
  let textClasses = 'text-md mb-4';
  if (type === 'menuItem') {
    textClasses = 'mb-0 text-sm';
  }

  return (
    <Typography variant="body1" className={twMerge(`text-darkest ${textClasses} ${className}`)}>
      {children}
    </Typography>
  );
}

export default Text;
