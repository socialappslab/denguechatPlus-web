import { Typography } from '@mui/material';
import { twMerge } from 'tailwind-merge';

type TileTypeType = 'page' | 'section' | 'subsection';
type VariantType = 'h1' | 'h2' | 'h3';

export type TitleProps = {
  label?: string;
  type?: TileTypeType;
  className?: string;
};

export function Title({ label, type = 'section', className }: TitleProps) {
  let variant: VariantType = 'h2';
  let fontSizeClass = 'text-2xl font-medium';
  if (type === 'page') {
    variant = 'h1';
    fontSizeClass = 'text-[32px]';
  } else if (type === 'subsection') {
    variant = 'h3';
    fontSizeClass = 'text-xl';
  }

  return (
    <Typography variant={variant} className={twMerge(`text-darkest font-bold mb-4 ${fontSizeClass} ${className}`)}>
      {label}
    </Typography>
  );
}

export default Title;
