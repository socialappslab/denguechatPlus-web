import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = ['en', 'es'];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend((language: string, namespace: string) => {
      if (language === 'dev') return;
      // eslint-disable-next-line consistent-return
      return import(`./locales/${language}/${namespace}.json`);
    }),
  )
  .init({
    debug: import.meta.env.DEV,
    react: {
      useSuspense: true,
    },
    fallbackLng: {
      es: ['es'],
      default: ['en'],
    },
  });

export default i18next;
