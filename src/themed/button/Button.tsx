import { Button as MUIButton, ButtonProps as MUIButtonProps } from '@mui/material';
import { twMerge } from 'tailwind-merge';

type SizeType = 'large' | 'small' | 'medium' | 'cell';

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
      sizeClass = 'px-5 py-3 w-full text-lg rounded-full';
      break;
    case 'small':
      sizeClass = 'px-4 py-2 text-sm rounded-md';
      break;
    case 'medium':
      sizeClass = 'px-4 py-2 text-base rounded-full';
      break;
    default: // cell
      sizeClass = 'px-2 py-1 text-xs rounded-full mr-1';
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
          primary ? 'bg-grass text-white' : 'bg-white text-darkest hover:text-gray hover:bg-fieldBorder',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          'w-max text-lg font-semibold disabled:opacity-40 hover:bg-opacity-80',
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
