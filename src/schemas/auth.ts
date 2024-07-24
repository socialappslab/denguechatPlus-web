import { TypeOf, object, string, z } from 'zod';

import { BaseObject } from '.';
import i18nInstance from '../i18n/config';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

export const emailSchema = z.union([z.literal(''), string().email(t('validation:invalidEmail'))]);

const passwordSchema = () =>
  string()
    .min(1, t('validation:requiredField.password'))
    .min(8, t('validation:passwordLength', { length: 8 }));

export const userNameSchema = string()
  .min(1, t('validation:requiredField.username'))
  .min(4, t('validation:usernameLength', { length: 4 }));

export const phoneSchema = string().min(1, t('validation:requiredField.phone')).min(8, t('validation:phoneLength'));

const TYPE_LOGIN = ['username', 'phone'] as const;

export const createLoginSchema = () => {
  return object({
    username: z
      .union([userNameSchema, z.string().length(0, '')])
      .optional()
      .transform((e) => (e === '' ? undefined : e)),
    phone: z
      .union([phoneSchema, z.string().length(0, '')])
      .optional()
      .transform((e) => (e === '' ? undefined : e)),
    password: passwordSchema(),
  });
};

const loginSchema = createLoginSchema();
export type LoginInputType = TypeOf<typeof loginSchema>;

export type LoginRequestType = {
  type: (typeof TYPE_LOGIN)[number];
  username?: string;
  phone?: string;
  password: string;
};

const passwordConfirmSchema = string().min(1, t('validation:requiredField.confirmPassword'));

export const createRegisterSchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));
  const requiredLastNameString = string().min(1, t('validation:requiredField.lastName'));
  const requiredString = string().min(1, t('validation:required'));

  return object({
    firstName: requiredNameString,
    lastName: requiredLastNameString,
    email: emailSchema,
    username: userNameSchema,
    phone: phoneSchema,
    city: requiredString,
    neighborhood: requiredString,
    organization: requiredString,
    password: passwordSchema(),
    passwordConfirm: passwordConfirmSchema,
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: t('validation:notMatch'),
  });
};

const createRegisterSchemaForType = createRegisterSchema();
export type RegisterInputType = TypeOf<typeof createRegisterSchemaForType>;

export const updateUserSchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));
  const requiredLastNameString = string().min(1, t('validation:requiredField.lastName'));
  const requiredString = string().min(1, t('validation:required'));

  return object({
    firstName: requiredNameString,
    lastName: requiredLastNameString,
    email: emailSchema,
    username: userNameSchema,
    phone: phoneSchema,
    city: requiredString,
    neighborhood: requiredString,
    organization: requiredString,
    password: z
      .union([passwordSchema(), z.string().length(0, '')])
      .optional()
      .transform((e) => (e === '' ? undefined : e)),
    passwordConfirm: z
      .union([passwordConfirmSchema, z.string().length(0, '')])
      .optional()
      .transform((e) => (e === '' ? undefined : e)),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: t('validation:notMatch'),
  });
};

const upateUserSchemaForType = updateUserSchema();
export type UpdateUserInputType = TypeOf<typeof upateUserSchemaForType>;

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;

  gender?: number | string;
  phone?: string;
  points?: number;
  country?: string;
  city?: string | BaseObject;
  neighborhood?: string | BaseObject;
  organization?: string | BaseObject;
  roles?: string[] | BaseObject[];

  countryId?: number;
  cityId?: number;
  neighborhoodId?: number;
  organizationId?: number;

  timezone?: string;
  language?: string;
  createdAt?: string;
}

export const UserStatusValues = ['active', 'pending', 'inactive', 'locked'] as const;
export type UserStatusType = (typeof UserStatusValues)[number];

export interface IUser extends UserProfile {
  id?: string;
  status?: UserStatusType;
  permissions?: string;

  cityName?: string;
  neighborhoodName?: string;
  organizationName?: string;
}

export interface UserAccount {
  phone?: string;
  password: string;
  username?: string;
  email?: string;
  userProfile: UserProfile;
}

export interface UserUpdate {
  status?: UserStatusType;
  password?: string;
  user_profile_attributes: UserProfile;
  roles?: number[];
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

export type ChangeStatus = {
  status: UserStatusType;
};
