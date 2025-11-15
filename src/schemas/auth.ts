import * as z from 'zod/mini';
import { BaseObject, FormSelectOption } from '.';

export type FieldErrorForTranslation = {
  key: string;
  args?: { [key: string]: string | number };
};

const t = (key: string, args?: { [key: string]: string | number }) => {
  return JSON.stringify({ key, args });
};

export const emailSchema = z.union([z.literal(''), z.string().check(z.trim(), z.email(t('validation:invalidEmail')))]);

export const passwordSchema = z.string().check(z.minLength(1, t('validation:requiredField.password')));

export const userNameSchema = z
  .string()
  .check(
    z.trim(),
    z.minLength(1, t('validation:requiredField.username')),
    z.minLength(4, t('validation:usernameLength', { length: 4 })),
  );

export const phoneSchema = z
  .string()
  .check(z.minLength(1, t('validation:requiredField.phone')), z.minLength(8, t('validation:phoneLength')));

const TYPE_LOGIN = ['username', 'phone'] as const;

export const loginSchema = z.object({
  username: z.pipe(
    z.union([userNameSchema, z.literal(''), z.literal(undefined)]),
    z.transform((e) => (e === '' ? undefined : e)),
  ),
  phone: z.pipe(
    z.union([phoneSchema, z.literal(''), z.literal(undefined)]),
    z.transform((e) => (e === '' ? undefined : e)),
  ),
  password: passwordSchema,
});

export type LoginInputType = z.infer<typeof loginSchema>;

export type LoginRequestType = {
  type: (typeof TYPE_LOGIN)[number];
  username?: string;
  phone?: string;
  password: string;
};

export const passwordConfirmSchema = z.string().check(z.minLength(1, t('validation:requiredField.confirmPassword')));
const requiredNameString = z.string().check(z.trim(), z.minLength(1, t('validation:requiredField.name')));
const requiredLastNameString = z.string().check(z.trim(), z.minLength(1, t('validation:requiredField.lastName')));
const requiredCity = z.string().check(z.minLength(1, t('validation:requiredField.city')));
const requiredHouseBlock = z.string().check(z.minLength(1, t('validation:requiredField.houseBlock')));
const requiredNeighborhood = z.string().check(z.minLength(1, t('validation:requiredField.neighborhood')));
const requiredOrganization = z.string().check(z.minLength(1, t('validation:requiredField.organization')));

export const RegisterSchema = z
  .object({
    firstName: requiredNameString,
    lastName: requiredLastNameString,
    email: emailSchema,
    username: userNameSchema,
    phone: phoneSchema,
    city: requiredCity,
    neighborhood: requiredNeighborhood,
    organization: requiredOrganization,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .check(
    z.refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: t('validation:notMatch'),
    }),
  );

export type RegisterInputType = z.infer<typeof RegisterSchema>;

export const UpdateUserSchema = z
  .object({
    firstName: requiredNameString,
    lastName: requiredLastNameString,
    email: emailSchema,
    username: userNameSchema,
    phone: phoneSchema,
    city: requiredCity,
    houseBlock: requiredHouseBlock,
    neighborhood: requiredNeighborhood,
    organization: requiredOrganization,
    team: z.optional(z.string()),
    password: z.pipe(
      z.union([passwordSchema, z.literal(''), z.literal(undefined)]),
      z.transform((e) => (e === '' ? undefined : e)),
    ),
    passwordConfirm: z.pipe(
      z.union([passwordConfirmSchema, z.literal(''), z.literal(undefined)]),
      z.transform((e) => (e === '' ? undefined : e)),
    ),
  })
  .check(
    z.refine((data) => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: t('validation:notMatch'),
    }),
  );

export type UpdateUserInputType = z.infer<typeof UpdateUserSchema>;

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;

  gender?: number | string;
  phone?: string;
  points?: number;
  country?: string | BaseObject;
  city?: string | BaseObject;
  neighborhood?: string | BaseObject;
  organization?: string | BaseObject;
  team?: string | BaseObject;
  houseBlock?: string | BaseObject;
  roles?: BaseObject[];

  countryId?: number;
  cityId?: number;
  neighborhoodId?: number;
  organizationId?: number;
  teamId?: number;
  houseBlockId?: number;

  timezone?: string;
  language?: string;
  createdAt?: string;
}

export const UserStatusValues = ['active', 'pending', 'inactive', 'locked'] as const;
export type UserStatusType = (typeof UserStatusValues)[number];

export interface IUser extends UserProfile {
  id?: string;
  status?: UserStatusType;
  permissions?: string[];

  cityName?: string;
  neighborhoodName?: string;
  organizationName?: string;
  state: {
    id: number;
    name: string;
  };
}

export type ChangeUserRoleInputType = {
  roles: FormSelectOption[];
};

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
  username?: string;
  phone?: string;
  userProfileAttributes?: UserProfile;
  roleIds?: number[];
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
