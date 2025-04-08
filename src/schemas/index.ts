import { ExistingResourceObject, MetaObject } from 'jsonapi-fractal';

export type ErrorResponse = {
  errors: {
    error_code: number;
    detail: string;
    field: string | null;
  }[];
};

export interface JsonApiResource<T> {
  id: string;
  type: string;
  attributes: T;
}

export type BaseDocumentObject<T> = {
  data: T | T[] | null;
  meta?: MetaObject;
  included?: ExistingResourceObject[];
};

export type BaseObject = {
  id: number;
  name: string;
};

export interface Neighborhood extends BaseObject {}

export interface Wedge extends BaseObject {}

export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface City extends Neighborhood {
  neighborhoods: Neighborhood[];
}

export interface State extends BaseObject {
  cities: City[];
}

export interface Locations {
  name: string;
  states: State[];
}

export type FormSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};
