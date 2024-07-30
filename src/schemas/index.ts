import { ExistingResourceObject, MetaObject } from 'jsonapi-fractal';

export type ErrorResponse = {
  errors: {
    error_code: number;
    detail: string;
    field: string | null;
  }[];
};

export type ApiResponseCollection<T> = {
  data: T[];
  meta: {
    total: number;
  };
  links: {
    self: number;
    last: number;
  };
};

export interface JsonApiResponse<T> {
  data: T;
}

export interface JsonApiCollectionResponse<T> {
  data: T[];
}

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

export interface Neighborhood {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  neighborhoods: Neighborhood[];
}

export interface State {
  id: number;
  name: string;
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

export type BaseObject = {
  id: number;
  name: string;
};
