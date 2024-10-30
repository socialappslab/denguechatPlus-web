import { Member } from '.';

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

export interface Permission extends BaseEntity {
  attributes: {
    id: number;
    name: string;
    resource: string;
  };
}

export interface Role extends BaseEntity {
  permissions: { data: Permission[] };
}

export interface Team extends BaseEntity {
  organization: Organization;
  sector: string;
  city: string;
  wedge: string;
  leader: string;
  members: Member[];
  memberCount: number;
}

export interface HouseBlock extends BaseEntity {
  team: string;
  houseIds: number[];
}

export interface Post {
  id: number;
  createdAt: number;
  userAccountId: number;
  canDeleteByUser: boolean;
  createdBy: string;
  createByUser: {
    accountId: number;
    userName: string;
    lastName: string;
  };
  location: string;
  postText: string;
  photoUrl?: {
    photo_url: string;
  };
  commentsCount?: number;
  likesCount: number;
  likedByUser: boolean;
  comments?: Comment[];
}
