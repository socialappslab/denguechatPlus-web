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

export type UserAccountResponse = ApiResponseCollection<{
  id: string;
  type: 'userAccount';
  attributes: {
    id: number;
    email: string | null;
    username: string;
    phone: string | null;
    status: boolean;
    locked: boolean;
    confirmedAt: string | null;
  };
  relationships: {
    userProfile: {
      data: {
        id: string;
        type: 'userProfile';
      };
    };
  };
}> & {
  included: Array<{
    id: string;
    type: 'userProfile';
    attributes: {
      id: number;
      firstName: string;
      lastName: string;
      gender: number;
      phoneNumber: string | null;
      slug: string | null;
      points: number | null;
      country: string;
      city: string;
      language: string;
      timezone: string;
    };
  }>;
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
};
