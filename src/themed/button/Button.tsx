import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';

type SizeType = 'large' | 'small';

export interface ButtonProps {
  primary?: boolean;
  label: string;
  size?: SizeType;
  onClick?: () => void;
}

export function Button<C extends React.ElementType>({
  primary = true,
  size = 'large',
  label,
  className,
  ...props
}: MUIButtonProps<C, { component?: C }> & ButtonProps) {
  return (
    <MUIButton
      disableElevation
      size={size}
      className={twMerge(
        [
          primary ? 'bg-grass text-white hover:bg-opacity-80' : 'bg-white text-darkest hover:bg-lightGray',
          'w-max text-lg font-semibold disabled:opacity-50',
          size === 'large' ? 'px-5 py-3 w-full rounded-full' : 'px-4 py-2 text-sm rounded-md',
          `normal-case  ${className}`,
        ].join(' '),
      )}
      {...props}
    >
      {label}
    </MUIButton>
  );
}

export default Button;
