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

async function refreshAuthLogic(failedRequest: any) {
  const refreshToken = getRefreshToken();
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
      return Promise.reject();
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
  statusCodes: [401],
  shouldRefresh: (error) => {
    const { config } = error;
    if (config?.url?.endsWith('refresh_token')) {
      return false;
    }
    const errorData = extractAxiosErrorData(error);

    if (errorData?.errors && `${errorData?.errors[0]?.error_code}` === 'expired_token') {
      return true;
    }

    return false;
  },
  // @ts-expect-error option exists at runtime but is missing from published types
  pauseInstanceWhileRefreshing: false,
});

configure({ axios: authApi, cache: false });
