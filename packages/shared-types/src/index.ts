export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'BRIGADISTA' | 'AUTHORITY';
}

export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  bloodType?: string;
  createdAt: string;
}

export interface Brigade {
  id: string;
  name: string;
  location: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNED';
}
