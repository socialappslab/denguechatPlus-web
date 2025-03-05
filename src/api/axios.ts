import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { configure, makeUseAxios } from 'axios-hooks';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, REFRESH_TOKEN_LOCAL_STORAGE_KEY, USER_LOCAL_STORAGE_KEY } from '../constants';
import { extractAxiosErrorData } from '../util';

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
    'X-Client-Device': 'web',
  },
};

export const authApi = axios.create(globalConfig);

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
}

export function removeUser(): void {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
}

export function saveAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
}

export const resetAuthApi = () => {
  if (globalConfig.headers) {
    delete globalConfig.headers['X-Authorization'];
  }
  delete authApi.defaults.headers['X-Authorization'];
  removeUser();
};

export const setAccessTokenToHeaders = (accessToken: string | null) => {
  if (!accessToken) {
    removeUser();
    return;
  }

  saveAccessToken(accessToken);
  authApi.defaults.headers['X-Authorization'] = `${accessToken}`;
};

export const setHeaderFromLocalStorage = () => {
  const token = getAccessToken();

  setAccessTokenToHeaders(token);
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

export const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, refreshToken);
};

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
}

setHeaderFromLocalStorage(); // set header token from local storage on first load

// Function that will be called to refresh authorization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshAuthLogic = (failedRequest: any) => {
  const refreshToken = getRefreshToken();
  console.log('refreshAuthLogic with refresh>>>>>>', refreshToken);
  return publicApi
    .post(
      '/users/session/refresh_token',
      {},
      {
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      },
    )
    .then((refreshResult) => {
      const newToken = refreshResult.data?.meta?.jwt?.res?.access;
      console.log('refreshResult newToken', newToken);

      if (!newToken) {
        return Promise.reject();
      }

      console.log('failedRequest with new token>>>>>>', newToken);
      // eslint-disable-next-line no-param-reassign
      failedRequest.response.config.headers['X-Authorization'] = `${newToken}`;
      setAccessTokenToHeaders(newToken);
      return Promise.resolve();
    })
    .catch((error) => {
      console.log('error refreshAuthLogic', JSON.stringify(error));
      resetAuthApi();
      window.location.href = '/login';
      // TODO logout user

      return Promise.reject();
    });
};

createAuthRefreshInterceptor(authApi, refreshAuthLogic, {
  statusCodes: [401],
  shouldRefresh: (error) => {
    const { config } = error;
    if (config?.url?.endsWith('refresh_token')) {
      return false;
    }
    const errorData = extractAxiosErrorData(error);

    console.log('shouldRefresh url >>>>>>', JSON.stringify(error.response));
    if (errorData?.errors && `${errorData?.errors[0]?.error_code}` === 'expired_token') {
      return true;
    }

    return false;
  },
  onRetry: (requestConfig) => {
    console.log('onRetry url >>>>>>', requestConfig.url);
    return requestConfig;
  },
  pauseInstanceWhileRefreshing: false,
});

configure({ axios: authApi, cache: false });
