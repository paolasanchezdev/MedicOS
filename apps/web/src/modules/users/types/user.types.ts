//apps/web/src/modules/users/types/user.types.ts
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type UserRole = 'ADMIN' | 'AUTHORITY' | 'DOCTOR' | 'BRIGADISTA' | 'PATIENT';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string | null;
  role: UserRole | string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}