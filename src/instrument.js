import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://768.ingest.us.sentry.io',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

  tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  environment: import.meta.env.MODE,

  autoSessionTracking: true,

  release: import.meta.env.VITE_APP_VERSION || '1.0.0',

  beforeSend(event) {
    return event;
  },

  tracePropagationTargets: [/^\//, /^https:\/\/api\.tuservicio\.com/],
});

console.log('Sentry initialized with environment:', import.meta.env.MODE);
