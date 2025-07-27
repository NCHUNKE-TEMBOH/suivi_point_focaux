export interface ComptablePost {
  id?: number;
  codePc: string;
  postname: string;
  description?: string;
  location?: string;
  region?: string;
  city?: string;
  status: PostStatus;
  createdAt?: Date;
  updatedAt?: Date;
  serviceId?: number;
  serviceName?: string;
  focalPoints?: FocalPoint[];
  interventionCount?: number;
}

export interface FocalPoint {
  id?: number;
  firstName: string;
  lastName: string;
  matricule: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  status: FocalPointStatus;
  assignedAt?: Date;
  comptablePostId?: number;
  comptablePostName?: string;
  userId?: number;
  username?: string;
}

export enum PostStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export enum FocalPointStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TRANSFERRED = 'TRANSFERRED'
}
