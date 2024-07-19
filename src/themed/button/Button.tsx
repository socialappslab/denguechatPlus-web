import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';

type SizeType = 'large' | 'small';

export interface ButtonProps {
  primary?: boolean;
  disabled?: boolean;
  label: string;
  size?: SizeType;
  onClick?: () => void;
}

export function Button<C extends React.ElementType>({
  primary = true,
  size = 'large',
  disabled = false,
  label,
  className,
  ...props
}: MUIButtonProps<C, { component?: C }> & ButtonProps) {
  return (
    <MUIButton
      disableElevation
      size={size}
      disabled={disabled}
      className={twMerge(
        [
          primary ? 'bg-grass text-white' : 'bg-white text-darkest',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80',
          'w-max text-lg font-semibold disabled:opacity-40',
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
