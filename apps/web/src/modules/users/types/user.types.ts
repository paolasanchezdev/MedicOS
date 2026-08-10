export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  departmentId: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: Role[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}