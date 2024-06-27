import { Typography } from '@mui/material';
import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export type TextProps = {
  className?: string;
};

export function Text({ children, className }: TextProps & PropsWithChildren) {
  return (
    <Typography variant="body1" className={twMerge(`text-darkest text-lg mb-4 ${className}`)}>
      {children}
    </Typography>
  );
}

export default Text;
