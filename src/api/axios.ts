import axios, { type AxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { configure, makeUseAxios } from 'axios-hooks';
import { ACCESS_TOKEN_LOCAL_STORAGE_KEY, REFRESH_TOKEN_LOCAL_STORAGE_KEY, USER_LOCAL_STORAGE_KEY } from '@/constants';
import { extractAxiosErrorData } from '@/util';

export const globalConfig: AxiosRequestConfig = {
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Device': 'web',
  },
};

export const authApi = axios.create(globalConfig);

export function removeUser(): void {
  localStorage.removeItem(USER_LOCAL_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
}

export function resetAuthApi() {
  if (globalConfig.headers) {
    delete globalConfig.headers['X-Authorization'];
  }
  delete authApi.defaults.headers['X-Authorization'];
  removeUser();
}

export const setAccessTokenToHeaders = (accessToken: string | null) => {
  if (!accessToken) {
    removeUser();
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, accessToken);
  authApi.defaults.headers['X-Authorization'] = `${accessToken}`;
};

export const setHeaderFromLocalStorage = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

  setAccessTokenToHeaders(token);
};

export const publicApi = axios.create(globalConfig);

export const useAxiosNoAuth = makeUseAxios({ axios: publicApi });

setHeaderFromLocalStorage(); // set header token from local storage on first load

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function refreshAuthLogic(failedRequest: any) {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);

  try {
    const refreshResult = await publicApi.post(
      '/users/session/refresh_token',
      {},
      {
        headers: {
          'X-Refresh-Token': refreshToken,
        },
      },
    );
    const newToken = refreshResult.data?.meta?.jwt?.res?.access;

    if (!newToken) {
      throw new Error('Refresh response did not include an access token');
    }

    failedRequest.response.config.headers['X-Authorization'] = `${newToken}`;
    setAccessTokenToHeaders(newToken);
    return Promise.resolve();
  } catch {
    resetAuthApi();
    window.location.href = '/login';
    // TODO logout user

    return Promise.reject();
  }
}

createAuthRefreshInterceptor(authApi, refreshAuthLogic, {
  deduplicateRefresh: false,
  shouldRefresh: (error) => {
    if (error.response?.status !== 401) return false;

    if (error.config?.url?.endsWith('refresh_token')) {
      return false;
    }
    const errorData = extractAxiosErrorData(error);

    if (errorData?.errors && `${errorData?.errors[0]?.error_code}` === 'expired_token') {
      return true;
    }

    return false;
  },
  onRetry: (requestConfig) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);

    if (accessToken) {
      requestConfig.headers.set('X-Authorization', accessToken);
    }

    return requestConfig;
  },
});

configure({ axios: authApi, cache: false });
