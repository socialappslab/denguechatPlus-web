export type ErrorResponse = {
  errors: Array<{
    error_code: number;
    detail: string;
    field: string | null;
  }>;
};

export type ApiResponse<T> = {
  data: T[];
  meta: {
    total: number;
  };
  links: {
    self: number;
    last: number;
  };
};

export type UserAccountResponse = ApiResponse<{
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
