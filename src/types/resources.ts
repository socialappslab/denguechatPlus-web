import auth from '../i18n/locales/en/auth.json';
import errorCodes from '../i18n/locales/en/errorCodes.json';
import register from '../i18n/locales/en/register.json';
import translation from '../i18n/locales/en/translation.json';
import validation from '../i18n/locales/en/validation.json';

const resources = {
  auth,
  errorCodes,
  register,
  translation,
  validation,
} as const;

export default resources;
