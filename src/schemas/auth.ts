import { TypeOf, object, string } from 'zod';

import { UserTypes } from '../constants';
import i18nInstance from '../i18n/config';

const getTranslation = (key: string) => i18nInstance.t(key);

// i18next.on('initialized', function(options) {})
export const emailSchema = string()
  .min(1, getTranslation('validation:requiredField.email'))
  .email(getTranslation('validation:invalidEmail'));
const passwordSchema = string()
  .min(1, getTranslation('validation:requiredField.password'))
  .min(6, getTranslation('validation:passwordLength'));

export const loginSchema = object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginInput = TypeOf<typeof loginSchema>;

const nameSchema = string().min(1, getTranslation('validation:requiredField.name'));

const registerSchema = object({
  name: nameSchema,
  email: emailSchema,
});

export type RegisterInput = TypeOf<typeof registerSchema>;

export const setPasswordSchema = object({
  password: passwordSchema,
  passwordConfirm: string().min(1, getTranslation('validation:requiredField.confirmPassword')),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: getTranslation('validation:notMatch'),
});

export const resetPasswordSchema = object({
  email: emailSchema,
});

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;

export interface IUser {
  id?: string;
  'first-name': string;
  'last-name': string;
  email: string;
  'role-name'?: string;
  timezone?: string;
  'account-status'?: string;
  type: UserTypes;
}

export interface ILoginResponse {
  data: {
    id: number;
    type: UserTypes;
    attributes: IUser;
  };
  meta: {
    jwt: {
      csrf: string;
      access: string;
      access_expires_at: string;
      refresh_expires_at: string;
    };
  };
}
