import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { configure, makeUseAxios } from 'axios-hooks';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, USER_LOCAL_STORAGE_KEY } from '../constants';

interface RetryConfig extends AxiosRequestConfig {
  retry: number;
  retryDelay: number;
}

export const globalConfig: RetryConfig = {
  retry: 0,
  retryDelay: 1000,
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
};

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
}

export const setHeaderFromLocalStorage = () => {
  const token = getAccessToken();
  if (token && token !== 'undefined' && globalConfig.headers) {
    globalConfig.headers['X-Authorization'] = `${token}`;
  } else if (globalConfig.headers) {
    globalConfig.headers['X-Authorization'] = '';
  }
};

export function removeUser(): void {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  setHeaderFromLocalStorage();
}

export function saveAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
  setHeaderFromLocalStorage();
}

setHeaderFromLocalStorage(); // set header token from local storage on first load

export const authApi = axios.create(globalConfig);

export const resetAuthApi = () => {
  if (globalConfig.headers) {
    delete globalConfig.headers['X-Authorization'];
  }
  delete authApi.defaults.headers['X-Authorization'];
};

export const setAccessTokenToHeaders = (accessToken: string | null) => {
  if (!accessToken) {
    removeUser();
    return;
  }

  saveAccessToken(accessToken);
  authApi.defaults.headers['X-Authorization'] = `${accessToken}`;
};

authApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (!config) {
      return Promise.reject(error);
    }

    const delayRetryRequest = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1000);
    });

    // if (error.request.status === 401) {
    //   const url = document.location.href.replace(document.location.origin, '');

    //   if (!config.retry && url !== '/login') {
    //     document.location.href = '/login';
    //     return Promise.reject(error);
    //   }
    // }

    if (!config.retry) {
      return Promise.reject(error);
    }

    config.retry -= 1;
    return delayRetryRequest.then(() => authApi(config));
  },
);

export const publicApi = axios.create(globalConfig);

export const useAxiosNoAuth = makeUseAxios({
  axios: publicApi,
});

configure({ axios: authApi, cache: false });
