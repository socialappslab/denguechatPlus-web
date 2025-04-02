import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";

import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/es';

import './index.css';
import { AppRouter } from './routes/AppRouter';

import './i18n/config';

Sentry.init({
  dsn: "https://00ca79a9bacdeda58db140dafeb079d2@o4508732723232768.ingest.us.sentry.io/4508732750299136",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});

dayjs.locale(import.meta.env.VITE_DEFAULT_LANG ?? 'es');

const rootElement = document.getElementById('root-app') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={import.meta.env.VITE_DEFAULT_LANG ?? 'es'}>
      <AppRouter />
    </LocalizationProvider>
  </StrictMode>,
);
