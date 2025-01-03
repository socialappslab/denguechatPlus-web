import auth from '../i18n/locales/en/auth.json';
import errorCodes from '../i18n/locales/en/errorCodes.json';
import register from '../i18n/locales/en/register.json';
import translation from '../i18n/locales/en/translation.json';
import validation from '../i18n/locales/en/validation.json';
import splash from '../i18n/locales/en/splash.json';
import permissions from '../i18n/locales/en/permissions.json';
import admin from '../i18n/locales/en/admin.json';
import feed from '../i18n/locales/en/feed.json';

const resources = {
  auth,
  errorCodes,
  register,
  translation,
  validation,
  splash,
  permissions,
  admin,
  feed,
} as const;

export default resources;
