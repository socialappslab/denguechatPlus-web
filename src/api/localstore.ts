import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, LANG_STORAGE_KEY, USER_LOCAL_STORAGE_KEY } from '../constants';
import { IUser } from '../schemas/auth';

export function getUser(): IUser | null {
  const user = localStorage.getItem(USER_LOCAL_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
}

export function saveUser(user: IUser | null | unknown): void {
  if (user) {
    localStorage.setItem(USER_LOCAL_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  }
}

export function saveLang(lang: string | null): void {
  if (lang) {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } else {
    localStorage.removeItem(LANG_STORAGE_KEY);
  }
}

export function getLang(): string | null {
  return localStorage.getItem(LANG_STORAGE_KEY);
}
