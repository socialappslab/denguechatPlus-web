import * as z from 'zod/mini';
import i18nInstance from '../i18n/config';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

// Role
export const createRoleSchema = () => {
  const requiredNameString = z.string().check(z.minLength(1, t('validation:requiredField.name')));

  return z.object({
    name: requiredNameString,
    permissionIds: z
      .array(z.object({ label: z.string(), value: z.string(), disabled: z.optional(z.boolean()) }))
      .check(z.minLength(1, t('validation:required'))),
  });
};

const createRoleSchemaForType = createRoleSchema();
export type CreateRoleInputType = z.infer<typeof createRoleSchemaForType>;

export interface CreateRole {
  name: string;
  permissionIds: number[];
}

// City
export const createCitySchema = () => {
  const requiredNameString = z.string().check(z.minLength(1, t('validation:requiredField.name')));

  return z.object({
    name: requiredNameString,
    neighborhoods: z.array(z.string()),
  });
};

const createCitySchemaForType = createCitySchema();
export type CreateCityInputType = z.infer<typeof createCitySchemaForType>;

export interface CreateCity {
  name: string;
  neighborhoodsAttributes: { name: string }[];
}

// Team
export const createTeamSchema = () => {
  const requiredNameString = z.string().check(z.minLength(1, t('validation:requiredField.name')));

  return z.object({
    name: requiredNameString,
    organizationId: z.string(),
    sectorId: z.string(),
    wedgeId: z.string(),
    memberIds: z.array(z.object({ label: z.string(), value: z.string() })).check(z.minLength(1)),
  });
};

const createTeamSchemaForType = createTeamSchema();
export type CreateTeamInputType = z.infer<typeof createTeamSchemaForType>;

export interface CreateTeam {
  name: string;
  organizationId: string;
  sectorId: string;
  wedgeId: string;
  memberIds: string[];
}
