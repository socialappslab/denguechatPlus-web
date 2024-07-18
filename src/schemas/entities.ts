export interface PaginationInput {
  'page[number]': number;
  'page[size]': number;
  sort: string;
  order: 'asc' | 'desc';
}

export interface Organization {
  id: string | number;
  name: string;
  status: boolean;
  createdAt: string;
}

export interface Role {
  id: string | number;
  name: string;
}
