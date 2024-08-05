import { TypeOf, array, object, record, string } from 'zod';
import i18nInstance from '../i18n/config';

const t = (key: string, args?: { [key: string]: string | number }) => i18nInstance.t(key, args);

export const updateCitySchema = () => {
  const requiredNameString = string().min(1, t('validation:requiredField.name'));

  return object({
    name: requiredNameString,
    neighborhoods: record(string(), string()),
    newNeighborhoods: array(string()),
  });
};

const updateCitySchemaForType = updateCitySchema();
export type UpdateCityInputType = TypeOf<typeof updateCitySchemaForType>;

export interface CityUpdate {
  name?: string;
  neighborhoods_attributes?: {
    _destroy?: string;
    id?: string;
    name?: string;
  }[];
}
