import admin from '../i18n/locales/en/admin.json';
import auth from '../i18n/locales/en/auth.json';
import errorCodes from '../i18n/locales/en/errorCodes.json';
import feed from '../i18n/locales/en/feed.json';
import permissions from '../i18n/locales/en/permissions.json';
import questionnaire from '../i18n/locales/en/questionnaire.json';
import register from '../i18n/locales/en/register.json';
import splash from '../i18n/locales/en/splash.json';
import translation from '../i18n/locales/en/translation.json';
import validation from '../i18n/locales/en/validation.json';

const resources = {
  admin,
  auth,
  errorCodes,
  feed,
  permissions,
  questionnaire,
  register,
  splash,
  translation,
  validation
} as const;

export default resources;
