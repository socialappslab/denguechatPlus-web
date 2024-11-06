import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider } from '@rollbar/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';

import './index.css';
import { AppRouter } from './routes/AppRouter';

import './i18n/config';

dayjs.locale(import.meta.env.VITE_DEFAULT_LANG ?? 'es');

const rootElement = document.getElementById('root-app') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

const rollbarConfig = {
  accessToken: import.meta.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        code_version: '1.0.0',
        source_map_enabled: true,
      },
    },
  },
};

root.render(
  <StrictMode>
    <Provider config={rollbarConfig}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={import.meta.env.VITE_DEFAULT_LANG ?? 'es'}>
        <AppRouter />
      </LocalizationProvider>
    </Provider>
    ,
  </StrictMode>,
);
