import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';

type SizeType = 'large' | 'small' | 'cell';

export interface ButtonProps {
  primary?: boolean;
  disabled?: boolean;
  label: string;
  buttonType?: SizeType;
  onClick?: () => void;
}

export function Button<C extends React.ElementType>({
  primary = true,
  buttonType = 'large',
  disabled = false,
  label,
  className,
  ...props
}: MUIButtonProps<C, { component?: C }> & ButtonProps) {
  let sizeClass = '';
  switch (buttonType) {
    case 'large':
      sizeClass = 'px-5 py-3 w-full rounded-full';
      break;
    case 'small':
      sizeClass = 'px-4 py-2 text-sm rounded-md';
      break;
    default: // cell
      sizeClass = 'px-2 py-1 text-xs rounded-full font-light mr-1';
      if (!primary) {
        sizeClass += ' justify-start';
      }
      break;
  }

  return (
    <MUIButton
      disableElevation
      disabled={disabled}
      className={twMerge(
        [
          primary ? 'bg-grass text-white' : 'bg-white text-darkest',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80',
          'w-max text-lg font-semibold disabled:opacity-40',
          sizeClass,
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
