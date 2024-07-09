import { TypeOf, object, string, z } from 'zod';

import i18nInstance from '../i18n/config';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

export const emailSchema = string().email(t('validation:invalidEmail')).optional();

const passwordSchema = string()
  .min(1, t('validation:requiredField.password'))
  .min(8, t('validation:passwordLength', { length: 8 }));

export const userNameSchema = string()
  .min(1, t('validation:requiredField.username'))
  .min(4, t('validation:usernameLength', { length: 4 }));

export const phoneSchema = string().min(1, t('validation:requiredField.phone')).min(8, t('validation:phoneLength'));

const TYPE_LOGIN = ['username', 'phone'] as const;

export const loginSchema = object({
  username: z
    .union([userNameSchema, z.string().length(0, '')])
    .optional()
    .transform((e) => (e === '' ? undefined : e)),
  phone: z
    .union([phoneSchema, z.string().length(0, '')])
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

const passwordConfirmSchema = string().min(1, t('validation:requiredField.confirmPassword'));

const requiredString = string().min(1, t('validation:requiredField.name'));

export const registerSchema = object({
  firstName: requiredString,
  lastName: requiredString,
  email: emailSchema,
  username: userNameSchema,
  phone: phoneSchema,
  city: string().optional(),
  neighborhood: string().optional(),
  organization: requiredString,
  password: passwordSchema,
  passwordConfirm: passwordConfirmSchema,
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: t('validation:notMatch'),
});

export type RegisterInputType = TypeOf<typeof registerSchema>;

export interface UserProfile {
  firstName: string;
  lastName: string;
  email?: string;
  gender?: number | string;
  phone?: string;
  points?: number;
  country?: string;
  city?: string;
  neighborhood?: string;
  organization?: string;
  timezone?: string;
  language?: string;
}

export interface IUser extends UserProfile {
  id: string;
}

export interface UserAccount {
  phone?: string;
  password: string;
  username?: string;
  email?: string;
  userProfile: UserProfile;
}

export type CreateAccountInputType = UserAccount;

export interface ILoginResponse {
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
