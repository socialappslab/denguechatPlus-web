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

export type InspectionStatus = 'green' | 'red' | 'yellow';
export interface Visit extends BaseEntity {
  visitedAt: string;
  city: string | BaseEntity;
  sector: string | BaseEntity;
  wedge: string | BaseEntity;
  house: number;
  visitStatus: InspectionStatus;
  brigadist: string | BaseEntity;
  team: string | BaseEntity;
  visitPermission: boolean;
  notes: string;
  answers: Array<Record<string, string>>;
}

export interface InspectionSelectable {
  breadingSiteType: string;
  waterSourceType: string;
  wasChemicallyTreated: string;
  typeContents: null;
  containerProtection: string;
  eliminationMethodType: string;
}

export interface Inspection extends InspectionSelectable {
  id: number;
  eliminationMethodTypeOther: null;
  status: InspectionStatus;
  waterSourceOther: string;
  hasWater: boolean;
  containerProtectionOther: string;
  photoUrl: {
    id: number;
    url: string;
  };
}

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
  createdAt: string;
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
