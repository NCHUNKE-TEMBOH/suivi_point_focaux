export interface Intervention {
  id?: number;
  title: string;
  description: string;
  problemDescription?: string;
  solutionDescription?: string;
  type: InterventionType;
  priority: InterventionPriority;
  status: InterventionStatus;
  interventionDate: Date;
  startTime?: Date;
  endTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  equipmentAffected?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  validatedAt?: Date;
  validationComments?: string;
  isValidated?: boolean;
  itProfessionalId?: number;
  itProfessionalName?: string;
  focalPointUserId?: number;
  focalPointUserName?: string;
  focalPointId?: number;
  focalPointName?: string;
  comptablePostId?: number;
  comptablePostName?: string;
  comptablePostCode?: string;
}

export enum InterventionType {
  HARDWARE_REPAIR = 'HARDWARE_REPAIR',
  SOFTWARE_INSTALLATION = 'SOFTWARE_INSTALLATION',
  NETWORK_CONFIGURATION = 'NETWORK_CONFIGURATION',
  SYSTEM_MAINTENANCE = 'SYSTEM_MAINTENANCE',
  USER_TRAINING = 'USER_TRAINING',
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
  SECURITY_UPDATE = 'SECURITY_UPDATE',
  DATA_BACKUP = 'DATA_BACKUP',
  OTHER = 'OTHER'
}

export enum InterventionPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum InterventionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}
