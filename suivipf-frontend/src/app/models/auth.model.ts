export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  user: User;
  message: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  matricule: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  createdAt?: Date;
  lastLogin?: Date;
  serviceId?: number;
  serviceName?: string;
  password?: string;
}

export enum UserRole {
  ACCOUNTING_POST = 'ACCOUNTING_POST',     // Creates interventions, tracks interventions
  IT_PROFESSIONAL = 'IT_PROFESSIONAL',     // Manages interventions (create, track, validate)
  FOCAL_POINT = 'FOCAL_POINT',             // Creates and tracks intervention sheets
  USER = 'USER',                           // Views dashboards and reports
  SERVICE = 'SERVICE',                     // Manages focal points and accounting posts
  ADMIN = 'ADMIN'                          // Views all dashboards and reports, full access
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
