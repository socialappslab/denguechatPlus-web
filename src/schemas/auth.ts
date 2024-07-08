import { TypeOf, object, string, z } from 'zod';

import { UserTypes } from '../constants';
import i18nInstance from '../i18n/config';

const getTranslation = (key: string) => i18nInstance.t(key);

export const emailSchema = string()
  .min(1, getTranslation('validation:requiredField.email'))
  .email(getTranslation('validation:invalidEmail'));

const passwordSchema = string()
  .min(1, getTranslation('validation:requiredField.password'))
  .min(6, getTranslation('validation:passwordLength'));

export const userNameSchema = string()
  .min(1, getTranslation('validation:requiredField.username'))
  .min(6, getTranslation('validation:usernameLength'));

export const phoneSchema = string()
  .min(1, getTranslation('validation:requiredField.phone'))
  .min(6, getTranslation('validation:phoneLength'));

const TYPE_LOGIN = ['username', 'phone'] as const;

export const loginSchema = object({
  username: z
    .union([z.string().length(0, ''), userNameSchema])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
  phone: z
    .union([z.string().length(0, ''), phoneSchema])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),

  password: passwordSchema,
});

export type LoginInputType = TypeOf<typeof loginSchema>;

export type LoginRequestType = {
  type: (typeof TYPE_LOGIN)[number];
  username?: string;
  phone?: string;
  password: string;
};

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
  firstName: string;
  lastName: string;
  email: string;
  gender?: number;
  phoneNumber?: string;
  points?: number;
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
}

export interface ILoginResponse {
  data: {
    id: string;
    type: UserTypes;
    attributes: IUser;
  };
  meta: {
    jwt: {
      res: {
        csrf: string;
        access: string;
        accessExpiresAt: string;
        refresh: string;
        refreshExpiresAt: string;
      };
    };
  };
}
