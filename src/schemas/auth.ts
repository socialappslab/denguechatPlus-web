import { TypeOf, object, string, z } from 'zod';
import { BaseObject, FormSelectOption } from '.';

export type FieldErrorForTranslation = {
  key: string;
  args?: { [key: string]: string | number };
};

const t = (key: string, args?: { [key: string]: string | number }) => {
  return JSON.stringify({ key, args });
};

export const emailSchema = z.union([z.literal(''), string().trim().email(t('validation:invalidEmail'))]);

export const passwordSchema = string()
  .min(1, t('validation:requiredField.password'))
  .min(6, t('validation:passwordLength', { length: 6 }));

export const userNameSchema = string()
  .trim()
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

export const passwordConfirmSchema = string().min(1, t('validation:requiredField.confirmPassword'));
const requiredNameString = string().trim().min(1, t('validation:requiredField.name'));
const requiredLastNameString = string().trim().min(1, t('validation:requiredField.lastName'));
const requiredCity = string().min(1, t('validation:requiredField.city'));
const requiredHouseBlock = string().min(1, t('validation:requiredField.city'));
const requiredNeighborhood = string().min(1, t('validation:requiredField.neighborhood'));
const requiredOrganization = string().min(1, t('validation:requiredField.organization'));

export const RegisterSchema = object({
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
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: t('validation:notMatch'),
});

export type RegisterInputType = TypeOf<typeof RegisterSchema>;

export const UpdateUserSchema = object({
  firstName: requiredNameString,
  lastName: requiredLastNameString,
  email: emailSchema,
  username: userNameSchema,
  phone: phoneSchema,
  city: requiredCity,
  houseBlock: requiredHouseBlock,
  neighborhood: requiredNeighborhood,
  organization: requiredOrganization,
  team: string().optional(),
  password: z
    .union([passwordSchema, z.string().length(0, '')])
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

export type UpdateUserInputType = TypeOf<typeof UpdateUserSchema>;

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
