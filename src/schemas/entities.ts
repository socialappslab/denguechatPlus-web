export interface PaginationInput {
  'page[number]': number;
  'page[size]': number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface BaseEntity {
  id: string | number;
  name: string;
}
export interface BaseWithStatus extends BaseEntity {
  status: boolean;
  createdAt: string;
}

export interface Organization extends BaseWithStatus {}

export interface SpecialPlace extends BaseWithStatus {}

export interface Role extends BaseEntity {}
