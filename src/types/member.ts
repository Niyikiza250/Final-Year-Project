import { UserRole } from '@/constants/routes';

export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'TRANSFERRED' | 'DECEASED';

export interface MemberActivity {
  id: string;
  type: 'BAPTISM' | 'TRANSFER' | 'ROLE_CHANGE' | 'OFFICE_APPOINTMENT' | 'NOTE';
  description: string;
  date: string;
  performedBy: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: MemberStatus;
  churchName: string;
  zoneName: string;
  fieldName: string;
  unionName: string;
  baptismDate?: string;
  joinDate: string;
  address: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  imageUrl?: string;
  activities: MemberActivity[];
}

export interface MemberFilters {
  search?: string;
  role?: UserRole;
  status?: MemberStatus;
  field?: string;
  church?: string;
}
