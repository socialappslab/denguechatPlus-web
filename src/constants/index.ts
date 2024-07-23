export const COLORS: { [key: string]: string } = {
  grass: '#067507',
  green: '#D6FFD6',
  background: '#FFFFFF',
  darkest: '#1C1917',
  gray: '#4D4D54',
  neutral: '#F5F5F4',
  softGray: '#C4C4C4',
  lightGray: '#EEEEEE',
  secondary: '#FCC914',
  red: '#d32f2f',
  darkGreen: '#17736B',
  fieldBorder: '#DADADA',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const USER_LOCAL_STORAGE_KEY = 'DENGUECHAT_USER';
export const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'DENGUECHAT_USER_ACCESS_TOKEN';
export const REFRESH_TOKEN_LOCAL_STORAGE_KEY = 'DENGUECHAT_USER_REFRESH_TOKEN';
export const LANG_STORAGE_KEY = 'DENGUECHAT_LANG';

export const PAGE_SIZES = [5, 10, 25];

export const DISPATCH_ACTIONS = {
  SET_USER: 'SET_USER',
  SET_LANG: 'SET_LANG',
};

export enum UserTypes {
  ADMIN = 'ADMIN',
}

export const drawerWidth = 260;
